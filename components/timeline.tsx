import { timeline } from "@/lib/data";

export function Timeline() {
  return (
    <div className="space-y-5">
      {timeline.map((item) => (
        <div key={item.title} className="grid gap-4 rounded-lg border bg-white/72 p-5 sm:grid-cols-[6rem_1fr]">
          <p className="text-sm font-semibold text-primary">{item.year}</p>
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
