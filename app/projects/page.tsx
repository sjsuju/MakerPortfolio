import { ArrowUpRight, Bot, Cpu, Hand, Wrench } from "lucide-react";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Timeline } from "@/components/timeline";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { projects } from "@/lib/data";

const makerAreas = [
  {
    title: "Robotics mechanisms",
    text: "Intake, sorting, launching, field interaction, and iteration cycles for FTC constraints.",
    icon: Bot
  },
  {
    title: "Assistive hardware",
    text: "3D printed hand geometry, EMG signal flow, servo actuation, and embedded control.",
    icon: Hand
  },
  {
    title: "Embedded systems",
    text: "ESP32 prototyping, sensor integration, PWM driver control, and bench validation.",
    icon: Cpu
  },
  {
    title: "Fabrication workflow",
    text: "CAD, printing, assembly, failure analysis, and quick redesign loops.",
    icon: Wrench
  }
];

export default function ProjectsPage() {
  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <SectionHeading
          eyebrow="Projects"
          title="Technical builds and product experiments"
          text="Each project started with a real constraint: competition performance, accessible hardware, better reading workflows, more human music filtering, or reliable deployment."
        />
        <div className="mt-12 grid gap-6">
          {projects.map((project) => (
            <Card key={project.title} className="overflow-hidden bg-white/82 shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
                <div className="relative min-h-64 overflow-hidden">
                  <Image src={project.image} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-primary">{project.role}</p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</h2>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-5 max-w-3xl leading-7 text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <section className="bg-white/50 py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Maker Portfolio"
            title="Mechanisms, electronics, and iteration"
            text="The hands-on thread behind the projects: what was designed, what failed, what improved, and how each prototype moved closer to a useful system."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {makerAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Card key={area.title} className="bg-white/82 p-6 shadow-sm">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">{area.title}</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{area.text}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="container py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Timeline
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Key moments in the maker path
            </h2>
          </div>
          <Timeline />
        </div>
      </section>
    </PageShell>
  );
}
