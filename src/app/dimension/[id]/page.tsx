import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SolarSystem } from "@/components/map/SolarSystem";

export const revalidate = 3600;
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await db.dimension.findMany({ select: { id: true } })).map((r) => ({ id: String(r.id) }));
}
type P = { params: Promise<{ id: string }> };

const load = async (id: string) =>
  /^\d+$/.test(id) && Number(id) < 1e9
    ? db.dimension.findUnique({
        where: { id: Number(id) },
        include: { locations: { orderBy: { id: "asc" }, include: { _count: { select: { residents: true } } } } },
      })
    : null;

export async function generateMetadata({ params }: P) {
  const d = await load((await params).id);
  return { title: d ? d.name : "Dimension not found" };
}

export default async function DimensionPage({ params }: P) {
  const d = await load((await params).id);
  if (!d) notFound();
  const planets = d.locations.map((l) => ({
    id: l.id, name: l.name, type: l.type, color: l.color, size: l.size,
    orbitRadius: l.orbitRadius, orbitAngle: l.orbitAngle, residents: l._count.residents,
  }));
  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <Breadcrumbs segments={[{ label: d.name }]} />
      <h1 className="t-h1">{d.name}</h1>
      <div className="flex flex-col gap-4 max-sm:flex-col-reverse">
        <div className="mx-auto w-full max-sm:max-w-xs"><SolarSystem planets={planets} /></div>
        <ul className="grid gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {planets.map((p) => (
            <li key={p.id}><Link href={`/location/${p.id}`} className="text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-portal-300">{p.name}</Link></li>
          ))}
        </ul>
      </div>
    </main>
  );
}
