import Link from "next/link";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { SkillBadge } from "@/components/skill-badge";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contactLinks, projects, skills } from "@/lib/data";

export default function ContactPage() {
  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <SectionHeading
          eyebrow="About"
          title="I build to understand systems"
          text="My favorite projects combine physical constraints with software leverage: a robot mechanism that needs to score reliably, a prosthetic hand that needs cleaner control, or a browser assistant that needs to earn trust."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="bg-white/84 p-7">
            <h2 className="text-2xl font-semibold">What I care about</h2>
            <div className="mt-5 space-y-4 leading-7 text-muted-foreground">
              <p>
                I am drawn to projects that make thinking visible: CAD iterations,
                wiring choices, classifier plans, interface decisions, and the notes
                that explain why one version replaced another.
              </p>
              <p>
                Robotics taught me to respect deadlines and field reality. Assistive
                tech taught me that cost, comfort, and reliability are engineering
                requirements, not afterthoughts. Web and AI tools taught me to design
                for people who want clarity, not noise.
              </p>
            </div>
          </Card>
          <Card className="bg-white/84 p-7">
            <h2 className="text-2xl font-semibold">Working style</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Start with a concrete test or demo.</li>
              <li>Prefer prototypes that reveal the hardest unknown quickly.</li>
              <li>Document the reason behind each design change.</li>
              <li>Keep systems understandable enough for teammates to improve.</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="bg-white/50 py-16">
        <div className="container">
          <SectionHeading
            eyebrow="Contact"
            title="Open to internships, research, teams, and build conversations"
            text="The fastest way to reach me is email. I am especially interested in robotics, assistive technology, embedded systems, AI tooling, and product engineering."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
            {contactLinks.map((link) => (
              <Card key={link.label} className="bg-white/84 p-6 shadow-sm">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
                  {link.label === "Email" ? (
                    <Mail className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <p className="font-semibold">{link.label}</p>
                <Link
                  href={link.href}
                  className="mt-2 block break-words text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.value}
                </Link>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild>
              <Link href="mailto:sooraj@example.com">
                Send Email <Mail className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <aside>
            <div className="sticky top-24 rounded-lg border bg-slate-950 p-7 text-white shadow-glow">
              <h2 className="text-4xl font-semibold tracking-tight">Resume</h2>
              <p className="mt-3 text-white/68">
                Maker, robotics lead, embedded systems builder, and software developer.
              </p>
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="border-white/16 bg-white/8 text-white hover:bg-white/14"
                >
                  <Download className="h-4 w-4" /> PDF soon
                </Button>
              </div>
            </div>
          </aside>
          <div className="space-y-6">
            <Card className="bg-white/84 p-7">
              <h2 className="text-2xl font-semibold">Profile</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                Technical maker focused on robotics, assistive technology, local AI tools,
                and web products. Strongest in ambiguous projects that need mechanical
                intuition, software implementation, and practical iteration.
              </p>
            </Card>
            <Card className="bg-white/84 p-7">
              <h2 className="text-2xl font-semibold">Experience and Projects</h2>
              <div className="mt-5 space-y-5">
                {projects.map((project) => (
                  <div key={project.title} className="border-t pt-5 first:border-t-0 first:pt-0">
                    <p className="font-semibold">{project.title}</p>
                    <p className="mt-1 text-sm font-medium text-primary">{project.role}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {project.summary}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="bg-white/84 p-7">
              <h2 className="text-2xl font-semibold">Skills</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <Timeline />
      </section>
    </PageShell>
  );
}
