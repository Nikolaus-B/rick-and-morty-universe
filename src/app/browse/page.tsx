import Link from "next/link";
import { db } from "@/lib/db";
import { parseFilters, queryCharacters } from "@/lib/characters";
import { CharacterCard } from "@/components/CharacterCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 3600;
export const metadata = { title: "Browse characters" };

const field = "w-full rounded-btn border border-border bg-elevated px-3 py-2 text-text-primary focus-visible:outline-2 focus-visible:outline-portal-300";

export default async function Browse({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const f = parseFilters(await searchParams);
  const [{ items, total, pageSize }, species, dimensions] = await Promise.all([
    queryCharacters(f),
    db.character.findMany({ distinct: ["species"], select: { species: true }, orderBy: { species: "asc" } }),
    db.dimension.findMany({ orderBy: { name: "asc" } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const href = (p: number) => {
    const u = new URLSearchParams();
    if (f.q) u.set("q", f.q);
    if (f.status) u.set("status", f.status);
    if (f.species) u.set("species", f.species);
    if (f.dimension) u.set("dimension", String(f.dimension));
    u.set("page", String(p));
    return `/browse?${u}`;
  };
  const pageLink = "glass rounded-btn px-4 py-2 focus-visible:outline-2 focus-visible:outline-portal-300";

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <Breadcrumbs segments={[{ label: "Browse" }]} />
      <h1 className="t-h1">Browse</h1>
      <form method="GET" action="/browse" className="glass grid gap-3 rounded-card p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input name="q" defaultValue={f.q} placeholder="Name" aria-label="Name" className={field} />
        <select name="status" defaultValue={f.status ?? ""} aria-label="Status" className={field}>
          <option value="">Any status</option>
          <option value="ALIVE">Alive</option>
          <option value="DEAD">Dead</option>
          <option value="UNKNOWN">Unknown</option>
        </select>
        <select name="species" defaultValue={f.species ?? ""} aria-label="Species" className={field}>
          <option value="">Any species</option>
          {species.map((s) => <option key={s.species} value={s.species}>{s.species}</option>)}
        </select>
        <select name="dimension" defaultValue={f.dimension ?? ""} aria-label="Dimension" className={field}>
          <option value="">Any dimension</option>
          {dimensions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button className="rounded-btn bg-portal-500 px-5 py-2 font-semibold text-void hover:shadow-glow focus-visible:outline-2 focus-visible:outline-portal-300">Apply</button>
      </form>
      <p className="t-small text-text-muted">{total} characters</p>
      {items.length === 0 ? (
        <p className="glass rounded-card p-8 text-center text-text-muted">No characters match these filters. <Link href="/browse" className="underline">Reset</Link></p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((c) => <li key={c.id}><CharacterCard c={c} /></li>)}
        </ul>
      )}
      <nav aria-label="Pagination" className="flex items-center justify-between">
        {f.page > 1 ? <Link href={href(f.page - 1)} className={pageLink}>Prev</Link> : <span />}
        <span className="t-mono text-text-muted">{f.page} / {pages}</span>
        {f.page < pages ? <Link href={href(f.page + 1)} className={pageLink}>Next</Link> : <span />}
      </nav>
    </main>
  );
}
