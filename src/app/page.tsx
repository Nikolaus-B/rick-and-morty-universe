import { db } from "@/lib/db";
import { DimensionMap } from "@/components/map/DimensionMap";

export const revalidate = 3600;

export default async function Home() {
  const [dims, locs] = await Promise.all([
    db.dimension.findMany({ select: { id: true, name: true, color: true }, orderBy: { id: "asc" } }),
    db.location.findMany({ select: { dimensionId: true, _count: { select: { residents: true } } } }),
  ]);
  const stat = new Map<number, { l: number; r: number }>();
  for (const x of locs) {
    if (x.dimensionId == null) continue;
    const s = stat.get(x.dimensionId) ?? { l: 0, r: 0 };
    s.l++; s.r += x._count.residents;
    stat.set(x.dimensionId, s);
  }
  const data = dims.map((d) => ({ ...d, locations: stat.get(d.id)?.l ?? 0, residents: stat.get(d.id)?.r ?? 0 }));
  return (
    <main className="mx-auto max-w-6xl space-y-3 px-4 py-4">
      <h1 className="t-h2">Rick and Morty Universe</h1>
      <DimensionMap dims={data} />
    </main>
  );
}
