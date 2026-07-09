"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number };
type V = { x: number; y: number; z: number };
type Edge = { a: number; b: number; hz: boolean };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Interactive 3D wireframe gear rendered on a canvas with hand-rolled 3D math.
 * Drag to rotate (pointer + touch) with inertia that decays into a slow idle
 * spin. Theme-aware (reads --primary / --hazard), depth-cued, reduced-motion
 * aware, and paused when hidden or offscreen. No dependencies.
 */
export function HeroCenterpiece() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BASE_SPIN = reduced ? 0 : 0.004;

    // ---- geometry: an extruded spur gear (two faces + bore) ----
    const TEETH = 14;
    const R_TIP = 1;
    const R_ROOT = 0.82;
    const R_BORE = 0.34;
    const DEPTH = 0.3;

    const profile: Pt[] = [];
    const step = (Math.PI * 2) / TEETH;
    // per tooth: root -> tip -> tip -> root (trapezoidal), valley chord to next
    const tooth: Array<[number, number]> = [
      [0, R_ROOT],
      [0.16, R_TIP],
      [0.34, R_TIP],
      [0.5, R_ROOT],
    ];
    for (let i = 0; i < TEETH; i++) {
      const a0 = i * step;
      for (const [f, r] of tooth) {
        const a = a0 + f * step;
        profile.push({ x: Math.cos(a) * r, y: Math.sin(a) * r });
      }
    }

    const bore: Pt[] = [];
    const BORE_SEG = 20;
    for (let i = 0; i < BORE_SEG; i++) {
      const a = (i / BORE_SEG) * Math.PI * 2;
      bore.push({ x: Math.cos(a) * R_BORE, y: Math.sin(a) * R_BORE });
    }

    const verts: V[] = [];
    const edges: Edge[] = [];
    const ring = (pts: Pt[], z: number, hz: boolean) => {
      const idx = pts.map((p) => {
        verts.push({ x: p.x, y: p.y, z });
        return verts.length - 1;
      });
      for (let i = 0; i < idx.length; i++) {
        edges.push({ a: idx[i], b: idx[(i + 1) % idx.length], hz });
      }
      return idx;
    };
    const pf = ring(profile, DEPTH / 2, false);
    const pb = ring(profile, -DEPTH / 2, false);
    for (let i = 0; i < pf.length; i++) edges.push({ a: pf[i], b: pb[i], hz: false });
    const bf = ring(bore, DEPTH / 2, true);
    const bb = ring(bore, -DEPTH / 2, true);
    for (let i = 0; i < bf.length; i++) edges.push({ a: bf[i], b: bb[i], hz: true });

    // ---- theme colors (re-read when the dark class toggles) ----
    let primary = "209 100% 36%";
    let hazard = "23 73% 44%";
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      primary = cs.getPropertyValue("--primary").trim() || primary;
      hazard = cs.getPropertyValue("--hazard").trim() || hazard;
    };

    // ---- rotation state ----
    let rx = -0.5;
    let ry = 0.6;
    let rxVel = 0;
    let ryVel = BASE_SPIN;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let dpr = 1;

    const rot = (v: V): V => {
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const x1 = v.x * cy - v.z * sy;
      const z1 = v.x * sy + v.z * cy;
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const y2 = v.y * cx - z1 * sx;
      const z2 = v.y * sx + z1 * cx;
      return { x: x1, y: y2, z: z2 };
    };

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.38;
      const CAM = 3.4;
      const proj = verts.map((v) => {
        const r = rot(v);
        const p = CAM / (CAM - r.z);
        return { x: cx + r.x * scale * p, y: cy + r.y * scale * p, z: r.z };
      });
      for (const e of edges) {
        const A = proj[e.a];
        const B = proj[e.b];
        const t = clamp(((A.z + B.z) / 2 + 1) / 2, 0, 1); // 0 far, 1 near
        const alpha = 0.16 + t * 0.66;
        ctx.strokeStyle = `hsl(${e.hz ? hazard : primary} / ${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.6 + t * 1.5;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }
      ctx.restore();
    };

    // ---- animation loop, only alive while active ----
    let raf = 0;
    let running = false;
    let visible = true;
    let onscreen = true;
    const isActive = () => visible && onscreen;

    const frame = () => {
      if (!dragging) {
        ryVel += (BASE_SPIN - ryVel) * 0.03;
        ry += ryVel;
        rxVel *= 0.9;
        rx = clamp(rx + rxVel, -1.15, 1.15);
      }
      render();
      const settled =
        !dragging &&
        Math.abs(ryVel - BASE_SPIN) < 0.0002 &&
        Math.abs(rxVel) < 0.0002;
      if (!isActive() || (reduced && settled)) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!running && isActive()) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    // ---- interaction ----
    const SENS = 0.008;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      lastX = e.clientX;
      lastY = e.clientY;
      ryVel = 0;
      rxVel = 0;
      canvas.style.cursor = "grabbing";
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      ry += dx * SENS;
      rx = clamp(rx + dy * SENS, -1.15, 1.15);
      ryVel = dx * SENS;
      rxVel = dy * SENS;
    };
    const onUp = () => {
      dragging = false;
      canvas.style.cursor = "grab";
      wake();
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    // ---- sizing (crisp lines via devicePixelRatio) ----
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      render();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        if (onscreen) wake();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) wake();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const mo = new MutationObserver(() => {
      readColors();
      render();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    readColors();
    resize();
    wake();

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interactive 3D wireframe gear. Drag to rotate."
      className="h-full w-full cursor-grab touch-none select-none"
    />
  );
}
