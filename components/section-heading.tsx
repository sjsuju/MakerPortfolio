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
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-7 text-muted-foreground">{text}</p> : null}
    </div>
  );
}
