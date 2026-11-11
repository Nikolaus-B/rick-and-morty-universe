import { CharacterStatus, Prisma } from "@prisma/client";
import { db } from "./db";

export const PAGE_SIZE = 24;
export type Filters = { q?: string; status?: CharacterStatus; species?: string; dimension?: number; page: number };
type Raw = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const posInt = (v?: string) => (v && /^\d+$/.test(v) && Number(v) > 0 && Number(v) < 1e9 ? Number(v) : undefined);

export function parseFilters(raw: Raw): Filters {
  const status = one(raw.status)?.toUpperCase();
  return {
    q: one(raw.q)?.slice(0, 100),
    status: status && status in CharacterStatus ? (status as CharacterStatus) : undefined,
    species: one(raw.species)?.slice(0, 100),
    dimension: posInt(one(raw.dimension)),
    page: posInt(one(raw.page)) ?? 1,
  };
}

export async function queryCharacters(f: Filters, pageSize = PAGE_SIZE) {
  const size = Math.min(Math.max(pageSize, 1), 50);
  const where: Prisma.CharacterWhereInput = {
    ...(f.q && { name: { contains: f.q, mode: "insensitive" } }),
    ...(f.status && { status: f.status }),
    ...(f.species && { species: f.species }),
    ...(f.dimension && { location: { dimensionId: f.dimension } }),
  };
  const [items, total] = await Promise.all([
    db.character.findMany({
      where,
      orderBy: { id: "asc" },
      skip: (f.page - 1) * size,
      take: size,
      include: { location: { select: { id: true, name: true } } },
    }),
    db.character.count({ where }),
  ]);
  return { items, total, page: f.page, pageSize: size };
}
