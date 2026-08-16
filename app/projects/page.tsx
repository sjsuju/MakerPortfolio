import { ArrowUpRight, Bot, CpuIcon, Hand, WrenchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Timeline } from "@/components/timeline";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { projects } from "@/lib/data";

const makerAreas = [
  {
    title: "Robotics mechanisms",
    text: "Mechanical systems for FIRST Tech Challenge: intake, sorting, shooter, and drivebase, designed in CAD and then fixed repeatedly once the field disagreed.",
    icon: Bot
  },
  {
    title: "Assistive hardware",
    text: "EMG sensors and a classifier that reads muscle activation, so a hand can be controlled by trying to move it instead of by pressing something.",
    icon: Hand
  },
  {
    title: "Embedded systems",
    text: "ESP32 prototyping, sensor integration, PWM driver control, and bench validation.",
    icon: CpuIcon
  },
  {
    title: "Fabrication workflow",
    text: "CAD, printing, assembly, failure analysis, and quick redesign loops.",
    icon: WrenchIcon
  }
];

export default function ProjectsPage() {
  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <SectionHeading
          eyebrow="Projects"
          title="Technical builds and product experiments"
          text="Every one of these started from a constraint I ran into rather than an idea I wanted to try. A robot that had to score reliably, a hand that had to be affordable, a reading tool I wanted to trust."
        />
        <div className="mt-12 grid gap-6">
          {projects.map((project) => (
            <Link key={project.title} href={`/projects/${project.slug}`} className="group block">
            <Card className="overflow-hidden" data-reveal>
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
                    <ArrowUpRight className="mt-1 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
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
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-secondary py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Maker Portfolio"
            title="Mechanisms, electronics, and iteration"
            text="The hands-on work sitting under the projects above: what got designed, what broke, and what the next revision did about it."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {makerAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Card key={area.title} className="p-6" data-reveal>
                  <div className="liquid-icon mb-5 flex h-12 w-12 items-center justify-center rounded-lg text-primary">
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
          <div data-reveal>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <span aria-hidden="true" className="mr-2 text-hazard">
                {"//"}
              </span>
              Timeline
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              How I got here
            </h2>
          </div>
          <Timeline />
        </div>
      </section>
    </PageShell>
  );
}
