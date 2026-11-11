import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { CharacterPortrait } from "@/components/CharacterPortrait";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const revalidate = 3600;
export const dynamicParams = false; // shortcut: new ids appear only after rebuild; rerun build after seed
export async function generateStaticParams() {
  return (await db.character.findMany({ select: { id: true } })).map((r) => ({ id: String(r.id) }));
}
type P = { params: Promise<{ id: string }> };

const load = async (id: string) =>
  /^\d+$/.test(id) && Number(id) < 1e9
    ? db.character.findUnique({
        where: { id: Number(id) },
        include: {
          origin: true,
          location: { include: { dimension: true } },
          episodes: { orderBy: [{ season: "asc" }, { number: "asc" }] },
        },
      })
    : null;

export async function generateMetadata({ params }: P) {
  const c = await load((await params).id);
  return { title: c ? c.name : "Character not found" };
}

const Loc = ({ l }: { l: { id: number; name: string } | null }) =>
  l ? <Link href={`/location/${l.id}`} className="underline decoration-border hover:text-portal-300 focus-visible:outline-2 focus-visible:outline-portal-300">{l.name}</Link> : <span className="text-text-muted">Unknown</span>;

export default async function CharacterPage({ params }: P) {
  const c = await load((await params).id);
  if (!c) notFound();
  const dim = c.location?.dimension;
  const crumbs: Crumb[] = [];
  if (dim) crumbs.push({ label: dim.name, href: `/browse?dimension=${dim.id}` });
  if (c.location) crumbs.push({ label: c.location.name, href: `/location/${c.location.id}` });
  crumbs.push({ label: c.name });
  const seasons = [...new Set(c.episodes.map((e) => e.season))];

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-6">
      <Breadcrumbs segments={crumbs} />
      <div className="grid gap-8 md:grid-cols-[auto_1fr]">
        <CharacterPortrait name={c.name} imageUrl={c.imageUrl} status={c.status} />
        <div className="space-y-4">
          <h1 className="t-h1">{c.name}</h1>
          <StatusBadge status={c.status} />
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            {([["Species", c.species], ["Type", c.type || "—"], ["Gender", c.gender]] as const).map(([k, v]) => (
              <div key={k} className="contents"><dt className="t-small text-text-muted">{k}</dt><dd>{v}</dd></div>
            ))}
            <dt className="t-small text-text-muted">Origin</dt><dd><Loc l={c.origin} /></dd>
            <dt className="t-small text-text-muted">Current location</dt><dd><Loc l={c.location} /></dd>
            <dt className="t-small text-text-muted">Dimension</dt><dd>{dim?.name ?? <span className="text-text-muted">Unknown</span>}</dd>
          </dl>
        </div>
      </div>
      <section className="space-y-4">
        <h2 className="t-h2">Episodes ({c.episodes.length})</h2>
        {seasons.map((s) => (
          <div key={s} className="glass rounded-card p-4">
            <h3 className="t-mono mb-2 uppercase text-text-muted">Season {s}</h3>
            <ul className="grid gap-1 sm:grid-cols-2">
              {c.episodes.filter((e) => e.season === s).map((e) => (
                <li key={e.id}><span className="t-mono mr-2 text-text-muted">{e.code}</span>{e.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
