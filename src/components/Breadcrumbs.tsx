import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ segments }: { segments: Crumb[] }) {
  const all: Crumb[] = [{ label: "Universe", href: "/" }, ...segments];
  return (
    <nav aria-label="Breadcrumb" className="t-mono uppercase text-text-muted">
      <ol className="flex flex-wrap items-center gap-x-1">
        {all.map((s, i) => (
          <li key={i} className="flex items-center gap-x-1">
            {i > 0 && <span aria-hidden>/</span>}
            {s.href && i < all.length - 1 ? (
              <Link href={s.href} className="hover:text-text-primary focus-visible:outline-2 focus-visible:outline-portal-300">{s.label}</Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined} className="text-text-primary">{s.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
