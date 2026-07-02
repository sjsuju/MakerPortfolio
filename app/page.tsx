import Link from "next/link";
import { FolderKanban, Mail, Printer } from "lucide-react";
import { PageShell } from "@/components/page-shell";

const pcbActions = [
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
    className: "pcb-button-projects"
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
    className: "pcb-button-contact"
  },
  {
    title: "Resume",
    href: "/contact?print=resume#resume",
    icon: Printer,
    className: "pcb-button-resume"
  }
];

export default function Home() {
  return (
    <PageShell>
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="pcb-field" aria-hidden="true">
          <div className="pcb-glow pcb-glow-one" />
          <div className="pcb-glow pcb-glow-two" />
        </div>

        <div className="container relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center py-14">
          <div className="pcb-home" aria-label="Portfolio navigation">
            <svg
              className="pcb-traces"
              viewBox="0 0 1100 680"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="traceGradient" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" stopOpacity="0.2" />
                  <stop offset="52%" stopColor="#0e7490" stopOpacity="0.52" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              <path id="projectsTrace" className="pcb-trace-main" d="M550 174 V112 H338 V156 H154" />
              <path id="contactTrace" className="pcb-trace-main" d="M740 340 H906 V340 H1016" />
              <path id="resumeTrace" className="pcb-trace-main" d="M550 506 V584 H330 V492 H166" />

              <path className="pcb-trace-main" d="M360 340 H238 V248 H116" />
              <path className="pcb-trace-main" d="M740 250 H860 V156 H946" />
              <path className="pcb-trace-faint" d="M360 242 H282 V88 H190" />
              <path className="pcb-trace-faint" d="M740 430 H838 V558 H980" />
              <path className="pcb-trace-faint" d="M446 174 V88 H506 V46" />
              <path className="pcb-trace-faint" d="M654 174 V104 H742 V58" />
              <path className="pcb-trace-faint" d="M446 506 V592 H502 V636" />
              <path className="pcb-trace-faint" d="M654 506 V586 H758 V628" />

              <circle className="pcb-pad" cx="154" cy="156" r="9" />
              <circle className="pcb-pad" cx="1016" cy="340" r="9" />
              <circle className="pcb-pad" cx="166" cy="492" r="9" />
              <circle className="pcb-pad" cx="116" cy="248" r="7" />
              <circle className="pcb-pad" cx="946" cy="156" r="7" />
              <circle className="pcb-pad" cx="190" cy="88" r="6" />
              <circle className="pcb-pad" cx="980" cy="558" r="6" />
              <circle className="pcb-pad" cx="506" cy="46" r="6" />
              <circle className="pcb-pad" cx="742" cy="58" r="6" />
              <circle className="pcb-pad" cx="502" cy="636" r="6" />
              <circle className="pcb-pad" cx="758" cy="628" r="6" />

              <circle className="pcb-pulse" r="6">
                <animateMotion dur="4.8s" repeatCount="indefinite">
                  <mpath href="#projectsTrace" />
                </animateMotion>
              </circle>
              <circle className="pcb-pulse pcb-pulse-delay-one" r="6">
                <animateMotion dur="5.2s" repeatCount="indefinite">
                  <mpath href="#contactTrace" />
                </animateMotion>
              </circle>
              <circle className="pcb-pulse pcb-pulse-delay-two" r="6">
                <animateMotion dur="5.6s" repeatCount="indefinite">
                  <mpath href="#resumeTrace" />
                </animateMotion>
              </circle>
            </svg>

            <div className="pcb-chip-card">
              <div className="pcb-pin pcb-pin-top" aria-hidden="true" />
              <div className="pcb-pin pcb-pin-right" aria-hidden="true" />
              <div className="pcb-pin pcb-pin-bottom" aria-hidden="true" />
              <div className="pcb-pin pcb-pin-left" aria-hidden="true" />
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <span aria-hidden="true" className="mr-2 text-hazard">
                  {"//"}
                </span>
                Technical maker portfolio
              </p>
              <h1 className="mt-5 text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
                Sooraj Sathyajith
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                Robotics, assistive tech, AI tools, embedded systems, and web builds.
              </p>
            </div>

            <nav aria-label="Portfolio sections">
              {pcbActions.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className={`pcb-button ${item.className}`}>
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
