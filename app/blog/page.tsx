import Link from "next/link";
import type { Metadata } from "next";
import { Mail, PenLine } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog | Sooraj Sathyajith"
};

// Topics I plan to write about first. Replace this section with the post list
// once there are posts.
const upcoming = [
  "Why the EMG hand refuses to move until it is sure",
  "What a 99% accuracy score was actually hiding",
  "Building a 3D gear on a canvas with no libraries"
];

export default function BlogPage() {
  return (
    <PageShell>
      <section className="container py-16 md:py-20">
        <SectionHeading
          eyebrow="Blog"
          title="Notes from the workbench"
          text="Longer writing about the things I build. Mostly the parts that did not work the first time, since those are the ones worth explaining."
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <Card className="p-8 md:p-10" data-reveal>
            <div className="liquid-icon mb-6 flex h-12 w-12 items-center justify-center rounded-lg text-primary">
              <PenLine className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">No posts yet</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              I am still writing the first few. They will show up here as they are
              finished, and the ones I have started are about:
            </p>
            <ul className="mt-5 grid gap-2">
              {upcoming.map((topic) => (
                <li key={topic} className="flex gap-3 leading-7 text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-hazard"
                  />
                  {topic}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              In the meantime, the{" "}
              <Link href="/projects" className="text-primary hover:underline">
                project write-ups
              </Link>{" "}
              cover most of the same ground in more detail. If you want to know when
              something goes up, or you want me to write about a specific one,{" "}
              <Link
                href="mailto:soorajjsathyajith@gmail.com"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                email me <Mail className="h-3.5 w-3.5" />
              </Link>
              .
            </p>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
