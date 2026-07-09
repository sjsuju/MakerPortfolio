import { PageShell } from "@/components/page-shell";
import { HeroCenterpiece } from "@/components/hero-centerpiece";

export default function Home() {
  return (
    <PageShell>
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="pcb-field" aria-hidden="true">
          <div className="pcb-glow pcb-glow-one" />
          <div className="pcb-glow pcb-glow-two" />
        </div>

        <div className="container relative z-10 flex min-h-[calc(100vh-4rem)] flex-col gap-10 py-14 md:grid md:grid-cols-2 md:items-center md:gap-8">
          <div className="max-w-xl md:self-start md:pt-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <span aria-hidden="true" className="mr-2 text-hazard">
                {"//"}
              </span>
              Technical maker portfolio
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
              Sooraj Sathyajith
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              Robotics, assistive tech, AI tools, embedded systems, and web builds.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[340px] md:mx-0 md:max-w-[600px] md:justify-self-end">
            <div className="aspect-square w-full">
              <HeroCenterpiece />
            </div>
            <p className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
              Drag to rotate
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
