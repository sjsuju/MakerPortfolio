export function SectionHeading({
  eyebrow,
  title,
  text
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center" data-reveal>
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          <span aria-hidden="true" className="mr-2 text-hazard">
            {"//"}
          </span>
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-muted-foreground">{text}</p> : null}
    </div>
  );
}
