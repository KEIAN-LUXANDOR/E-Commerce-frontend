import Link from "next/link";
import { cn } from "@/lib/utils";

/** Friendly message for an empty list, with one clear next step. */
export function EmptyState({
  title,
  children,
  action,
  icon,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  action?: { label: string; href: string };
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center border border-dashed border-line-dark px-6 py-14 text-center", className)}>
      {icon && <div className="mb-4 text-slate">{icon}</div>}
      <p className="font-serif text-2xl text-ink">{title}</p>
      {children && <div className="mt-2 max-w-md text-sm leading-relaxed text-slate">{children}</div>}
      {action && (
        <Link href={action.href} className="btn btn-primary mt-6">
          {action.label}
        </Link>
      )}
    </div>
  );
}
