import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { CharacterCard } from "@/components/CharacterCard";

export const revalidate = 3600;
export const dynamicParams = false; // shortcut: new ids appear only after rebuild; rerun build after seed
export async function generateStaticParams() {
  return (await db.location.findMany({ select: { id: true } })).map((r) => ({ id: String(r.id) }));
}
type P = { params: Promise<{ id: string }> };

const load = async (id: string) =>
  /^\d+$/.test(id) && Number(id) < 1e9
    ? db.location.findUnique({
        where: { id: Number(id) },
        include: { dimension: true, residents: { orderBy: { id: "asc" } }, _count: { select: { natives: true } } },
      })
    : null;

export async function generateMetadata({ params }: P) {
  const l = await load((await params).id);
  return { title: l ? l.name : "Location not found" };
}

export default async function LocationPage({ params }: P) {
  const l = await load((await params).id);
  if (!l) notFound();
  const crumbs: Crumb[] = [];
  if (l.dimension) crumbs.push({ label: l.dimension.name, href: `/browse?dimension=${l.dimension.id}` });
  crumbs.push({ label: l.name });
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <Breadcrumbs segments={crumbs} />
      <h1 className="t-h1">{l.name}</h1>
      <p className="t-small text-text-muted">
        {l.type || "Unknown type"} · {l.dimension?.name ?? "Unknown dimension"} · {l._count.natives} natives
      </p>
      <h2 className="t-h2">Residents ({l.residents.length})</h2>
      {l.residents.length === 0 ? (
        <p className="glass rounded-card p-8 text-center text-text-muted">No known residents.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {l.residents.map((c) => <li key={c.id}><CharacterCard c={{ ...c, location: null }} /></li>)}
        </ul>
      )}
    </main>
  );
}
