import Link from "next/link";
import { ArrowRight, FileText, FolderKanban } from "lucide-react";
import { PageShell } from "@/components/page-shell";

const hubLinks = [
  {
    title: "Projects",
    href: "/projects",
    text: "Robotics, prosthetics, browser AI, music tools, web systems, and maker process.",
    icon: FolderKanban
  },
  {
    title: "Contact + Resume",
    href: "/contact",
    text: "About me, ways to reach me, profile, project experience, and skills.",
    icon: FileText
  }
];

export default function Home() {
  return (
    <PageShell>
      <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="gear-field" aria-hidden="true">
          <div className="gear-ring gear-ring-one" />
          <div className="gear-ring gear-ring-two" />
          <div className="gear-ring gear-ring-three" />
          <div className="gear-orbit gear-orbit-one" />
          <div className="gear-orbit gear-orbit-two" />
        </div>

        <div className="container relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-center py-16">
          <div className="max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Technical maker portfolio
            </p>
            <h1 className="mt-5 max-w-4xl text-6xl font-semibold tracking-tight text-slate-950 md:text-8xl">
              Sooraj Sathyajith
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              Robotics, assistive tech, AI tools, embedded systems, and web builds.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {hubLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative min-h-56 overflow-hidden rounded-lg border bg-white/76 p-7 shadow-glow backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:bg-white/90"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-primary/80 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex h-full flex-col justify-between gap-10">
                    <div>
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-slate-950 text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="text-3xl font-semibold tracking-tight">{item.title}</h2>
                      <p className="mt-4 max-w-xl leading-7 text-muted-foreground">{item.text}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      Open page
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
