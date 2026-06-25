"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { projects } from "@/lib/data";
import { iconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Project = (typeof projects)[number];

export function ProjectCard({
  project,
  large = false
}: {
  project: Project;
  large?: boolean;
}) {
  const Icon = iconMap[project.icon as keyof typeof iconMap];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(large && "md:col-span-2 md:row-span-2")}
    >
      <Card className="group h-full overflow-hidden bg-white/82 shadow-glow backdrop-blur">
        <div className={cn("relative h-48 overflow-hidden", large && "md:h-72")}>
          <Image
            src={project.image}
            alt=""
            fill
            sizes={large ? "(min-width: 768px) 50vw, 100vw" : "100vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/42 to-transparent" />
          <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-lg bg-white/88 text-primary shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="flex h-[calc(100%-12rem)] flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-primary">{project.role}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight">{project.title}</h3>
            </div>
            <Link
              href="/projects"
              aria-label={`View ${project.title}`}
              className="rounded-md border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{project.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.article>
  );
}
