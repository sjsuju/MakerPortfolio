"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven gear train rendered as a fixed background layer.
 * Scrolling is the crank: each gear's angular speed is inversely
 * proportional to its tooth count and adjacent gears counter-rotate,
 * so the meshing ratios are physically honest.
 */

const REF_TEETH = 24;
const BASE_SPEED = 0.055; // degrees per scrolled pixel for a 24-tooth gear
const CHARGE_PATH =
  "M70 150 C185 70 290 230 405 150 C560 40 620 330 775 260 C900 205 930 420 820 500 C710 585 560 420 450 555 C330 700 220 575 130 720 C70 815 190 900 340 835 C520 760 555 940 720 855 C845 790 900 910 960 830";

type GearTone = "base" | "cyan" | "hazard";

type GearSpec = {
  teeth: number;
  module: number;
  x: number;
  y: number;
  dir: 1 | -1;
  phase: number;
  holes: number;
  tone: GearTone;
  ring?: boolean;
};

type ClusterSpec = {
  className: string;
  gears: GearSpec[];
};

const CLUSTERS: ClusterSpec[] = [
  {
    // Drive cluster, upper left: 26T -> 12T -> 16T train.
    className: "gear-cluster gear-cluster-a",
    gears: [
      { teeth: 26, module: 15, x: 150, y: 150, dir: 1, phase: 0, holes: 6, tone: "base" },
      { teeth: 12, module: 15, x: 392, y: 301, dir: -1, phase: 15, holes: 0, tone: "cyan" },
      { teeth: 16, module: 15, x: 373, y: 510, dir: 1, phase: 11, holes: 5, tone: "base" }
    ]
  },
  {
    // Right edge pair. The center distance equals the sum of pitch radii.
    className: "gear-cluster gear-cluster-ring",
    gears: [
      { teeth: 34, module: 11, x: 292, y: 292, dir: -1, phase: 5, holes: 0, tone: "base", ring: true },
      { teeth: 14, module: 11, x: 28, y: 292, dir: 1, phase: 18, holes: 0, tone: "cyan" }
    ]
  },
  {
    // Output cluster, lower right: 22T -> 10T pinion.
    className: "gear-cluster gear-cluster-b",
    gears: [
      { teeth: 22, module: 13, x: 300, y: 260, dir: 1, phase: 4, holes: 6, tone: "base" },
      { teeth: 10, module: 13, x: 111.62, y: 171.83, dir: -1, phase: 18, holes: 0, tone: "hazard" }
    ]
  },
  {
    // Mid-column pair that passes behind the content cards: 18T -> 9T.
    className: "gear-cluster gear-cluster-c",
    gears: [
      { teeth: 18, module: 12, x: 140, y: 140, dir: -1, phase: 8, holes: 5, tone: "base" },
      { teeth: 9, module: 12, x: 280.19, y: 58.89, dir: 1, phase: 22, holes: 0, tone: "cyan" }
    ]
  }
];

const ALL_GEARS = CLUSTERS.flatMap((cluster) => cluster.gears);

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function sampledPath(path: SVGPathElement, start: number, end: number, steps: number): string {
  const parts: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const distance = start + ((end - start) * i) / steps;
    const point = path.getPointAtLength(distance);
    parts.push(`${i === 0 ? "M" : "L"}${round(point.x)} ${round(point.y)}`);
  }

  return parts.join(" ");
}

function gearPath(teeth: number, module: number): string {
  const pitchR = (teeth * module) / 2;
  const outerR = pitchR + module * 0.85;
  const rootR = pitchR - module * 1.05;
  const pitch = (Math.PI * 2) / teeth;
  const parts: string[] = [];

  for (let i = 0; i < teeth; i++) {
    const a = i * pitch;
    const rootLead = a;
    const tipLead = a + pitch * 0.18;
    const tipTrail = a + pitch * 0.46;
    const rootTrail = a + pitch * 0.64;
    parts.push(
      `${i === 0 ? "M" : "L"}${round(rootR * Math.cos(rootLead))},${round(rootR * Math.sin(rootLead))}`,
      `L${round(outerR * Math.cos(tipLead))},${round(outerR * Math.sin(tipLead))}`,
      `L${round(outerR * Math.cos(tipTrail))},${round(outerR * Math.sin(tipTrail))}`,
      `L${round(rootR * Math.cos(rootTrail))},${round(rootR * Math.sin(rootTrail))}`
    );
  }

  return `${parts.join(" ")} Z`;
}

function Gear({
  spec,
  setRef
}: {
  spec: GearSpec;
  setRef: (node: HTMLDivElement | null) => void;
}) {
  const pitchR = (spec.teeth * spec.module) / 2;
  const outerR = pitchR + spec.module * 0.85;
  const rootR = pitchR - spec.module * 1.05;
  const size = Math.ceil(outerR * 2 + 8);
  const c = size / 2;

  const rimR = spec.ring ? rootR * 0.8 : rootR * 0.62;
  const hubR = rootR * 0.26;
  const boreR = rootR * 0.115;
  const holeOrbitR = (rimR + hubR) / 2;
  const holeR = Math.min(rootR * 0.14, (rimR - hubR) * 0.34);

  const holes = Array.from({ length: spec.holes }, (_, i) => {
    const angle = (i / spec.holes) * Math.PI * 2 + Math.PI / spec.holes;
    return {
      cx: round(holeOrbitR * Math.cos(angle)),
      cy: round(holeOrbitR * Math.sin(angle))
    };
  });

  return (
    <div
      ref={setRef}
      className={`gear gear-tone-${spec.tone}`}
      style={{
        left: spec.x - c,
        top: spec.y - c,
        width: size,
        height: size,
        transform: `rotate(${spec.phase}deg)`
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <g transform={`translate(${c} ${c})`}>
          <path
            d={gearPath(spec.teeth, spec.module)}
            fill="currentColor"
            fillOpacity="0.045"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle r={round(rimR)} fill="none" stroke="currentColor" strokeWidth="1.5" />
          {spec.ring ? (
            <circle
              r={round(rootR * 0.72)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5 9"
            />
          ) : (
            <>
              <circle r={round(hubR)} fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle r={round(boreR)} fill="none" stroke="currentColor" strokeWidth="1" />
              {holes.map((hole) => (
                <circle
                  key={`${hole.cx},${hole.cy}`}
                  cx={hole.cx}
                  cy={hole.cy}
                  r={round(holeR)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
              ))}
            </>
          )}
          {/* CAD center mark */}
          <path
            d={`M${round(-hubR * 0.7)} 0 H${round(hubR * 0.7)} M0 ${round(-hubR * 0.7)} V${round(hubR * 0.7)}`}
            stroke="currentColor"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  );
}

export function GearField() {
  const gearRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chargeFieldRef = useRef<SVGSVGElement | null>(null);
  const chargePathRef = useRef<SVGPathElement | null>(null);
  const chargeProgressRef = useRef<SVGPathElement | null>(null);
  const chargeBridgeRef = useRef<SVGPathElement | null>(null);
  const chargeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    const apply = () => {
      frame = 0;
      const scrolled = window.scrollY;
      ALL_GEARS.forEach((spec, i) => {
        const el = gearRefs.current[i];
        if (!el) return;
        const speed = BASE_SPEED * (REF_TEETH / spec.teeth) * spec.dir;
        el.style.transform = `rotate(${spec.phase + scrolled * speed}deg)`;
      });

      const path = chargePathRef.current;
      const progressPath = chargeProgressRef.current;
      const bridgePath = chargeBridgeRef.current;
      const field = chargeFieldRef.current;
      const charge = chargeRef.current;
      if (path && progressPath && bridgePath && field && charge) {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, scrolled / maxScroll));
        const length = path.getTotalLength();
        const distance = length * progress;
        const point = path.getPointAtLength(distance);
        const progressSteps = Math.max(2, Math.min(96, Math.ceil(progress * 96)));
        const bridgeRadius = Math.min(38, length * 0.014);
        const bridgeStart = Math.max(0, distance - bridgeRadius);
        const bridgeEnd = Math.min(length, distance + bridgeRadius);

        progressPath.setAttribute("d", sampledPath(path, 0, distance, progressSteps));
        bridgePath.setAttribute("d", sampledPath(path, bridgeStart, bridgeEnd, 8));
        charge.style.left = `${round((point.x / 1000) * field.clientWidth)}px`;
        charge.style.top = `${round((point.y / 1000) * field.clientHeight)}px`;
      }
    };

    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(apply);
      }
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  let gearIndex = 0;

  return (
    <div className="gear-field" aria-hidden="true">
      <svg
        ref={chargeFieldRef}
        className="charge-field"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path ref={chargePathRef} className="charge-wire charge-wire-base" d={CHARGE_PATH} />
        <path ref={chargeProgressRef} className="charge-wire charge-wire-active" d="M70 150" />
        <path ref={chargeBridgeRef} className="charge-wire charge-wire-bridge" d="M70 150" />
      </svg>
      <div ref={chargeRef} className="charge-node">
        <span className="charge-node-halo" />
        <span className="charge-node-core" />
      </div>
      {CLUSTERS.map((cluster) => (
        <div key={cluster.className} className={cluster.className}>
          {cluster.gears.map((spec) => {
            const i = gearIndex++;
            return (
              <Gear
                key={`${spec.teeth}-${spec.x}-${spec.y}`}
                spec={spec}
                setRef={(node) => {
                  gearRefs.current[i] = node;
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
