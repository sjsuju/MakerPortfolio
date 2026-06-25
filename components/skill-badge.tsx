import { Badge } from "@/components/ui/badge";

export function SkillBadge({ skill }: { skill: string }) {
  return (
    <Badge className="border-teal-900/10 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm">
      {skill}
    </Badge>
  );
}
