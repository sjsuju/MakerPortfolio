import Link from "next/link";
// Resume section disabled 2026-07-09 (privacy). Uncomment the marked blocks to restore.
// import Image from "next/image";
// import { Suspense } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { PageShell } from "@/components/page-shell";
// import { PrintResumeButton } from "@/components/print-resume-button";
// import { PrintResumeHandler } from "@/components/print-resume-handler";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contactLinks } from "@/lib/data";

// const RESUME_IMAGE_WIDTH = 2550;
// const RESUME_IMAGE_HEIGHT = 3300;

export default function ContactPage() {
  return (
    <PageShell>
      {/* <Suspense fallback={null}>
        <PrintResumeHandler />
      </Suspense> */}
      <section className="container py-16 md:py-20">
        <SectionHeading
          eyebrow="About"
          title="I build to understand systems"
          text="My favorite projects combine physical constraints with software leverage: a robot mechanism that needs to score reliably, a prosthetic hand that needs cleaner control, or a browser assistant that needs to earn trust."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="p-7" data-reveal>
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
          <Card className="p-7" data-reveal>
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

      <section className="bg-foreground/[0.03] py-16 dark:bg-white/[0.02]">
        <div className="container">
          <SectionHeading
            eyebrow="Contact"
            title="Open to internships, research, teams, and build conversations"
            text="The fastest way to reach me is email. I am especially interested in robotics, assistive technology, embedded systems, AI tooling, and product engineering."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-3">
            {contactLinks.map((link) => (
              <Card key={link.label} className="p-6" data-reveal>
                <div className="liquid-icon mb-6 flex h-11 w-11 items-center justify-center rounded-lg text-primary">
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
              <Link href="mailto:soorajjsathyajith@gmail.com">
                Send Email <Mail className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Resume section disabled 2026-07-09 (privacy). Uncomment to restore.
      <section id="resume" className="resume-print container py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.38fr_1.62fr]">
          <aside data-reveal>
            <div className="glass-panel glass-inverse lg:sticky lg:top-24 rounded-lg p-7 text-foreground">
              <h2 className="text-4xl font-semibold tracking-tight">Resume</h2>
              <p className="mt-3 text-muted-foreground">
                Maker, robotics lead, embedded systems builder, and software developer.
              </p>
              <div className="mt-6">
                <PrintResumeButton />
              </div>
            </div>
          </aside>
          <div data-reveal>
            <article className="resume-sheet glass-panel mx-auto rounded-lg">
              <Image
                src="/resume-page-1.png"
                alt="Sooraj Sathyajith resume"
                width={RESUME_IMAGE_WIDTH}
                height={RESUME_IMAGE_HEIGHT}
                sizes="(min-width: 1024px) 62vw, 100vw"
                className="h-auto w-full"
                priority
              />
            </article>
          </div>
        </div>
      </section>
      */}
    </PageShell>
  );
}
