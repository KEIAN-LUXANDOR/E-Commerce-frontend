import { cn } from "@/lib/utils";

/** Heading block used at the top of most pages: small label, title, one or two lines of intro. */
export function PageIntro({
  eyebrow,
  title,
  children,
  className,
  as = "h1",
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <Heading className={cn("text-ink", eyebrow ? "mt-2" : "", as === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl")}>{title}</Heading>
      {children && <div className="mt-3 text-base leading-relaxed text-slate sm:text-lg">{children}</div>}
    </div>
  );
}
