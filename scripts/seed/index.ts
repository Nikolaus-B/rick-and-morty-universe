import { PrismaClient } from "@prisma/client";
import { fetchAll } from "./fetch";
import {
  idFromUrl, slugify, parseEpisodeCode, mapStatus, dimensionName, parseAirDate, nullIfEmpty, visuals,
} from "./transform";

const db = new PrismaClient();
const BATCH = 50;

async function batched<T>(items: T[], fn: (x: T) => any) {
  for (let i = 0; i < items.length; i += BATCH)
    await db.$transaction(items.slice(i, i + BATCH).map(fn));
}

async function main() {
  const chars = await fetchAll("character");
  const locs = await fetchAll("location");
  const eps = await fetchAll("episode");

  const dimNames = [...new Set(locs.results.map((l: any) => dimensionName(l.dimension)))];
  await batched(dimNames, (name) =>
    db.dimension.upsert({
      where: { name },
      update: {}, // keep custom color
      create: { name, slug: slugify(name), color: visuals(name).color },
    }),
  );
  const dimIds = new Map((await db.dimension.findMany()).map((d) => [d.name, d.id]));

  await batched(locs.results, (l: any) => {
    const base = { name: l.name, type: nullIfEmpty(l.type), dimensionId: dimIds.get(dimensionName(l.dimension)) ?? null };
    return db.location.upsert({
      where: { id: l.id },
      update: base,
      create: { id: l.id, ...base, ...visuals(l.id) },
    });
  });
  const locIds = new Set(locs.results.map((l: any) => l.id as number));
  const ref = (url: string) => { const id = idFromUrl(url); return id !== null && locIds.has(id) ? id : null; };

  await batched(chars.results, (c: any) => {
    const base = {
      name: c.name, status: mapStatus(c.status), species: c.species, type: nullIfEmpty(c.type),
      gender: c.gender, imageUrl: c.image, originId: ref(c.origin?.url), locationId: ref(c.location?.url),
    };
    return db.character.upsert({ where: { id: c.id }, update: base, create: { id: c.id, ...base } });
  });
  const charIds = new Set(chars.results.map((c: any) => c.id as number));

  await batched(eps.results, (e: any) => {
    const { season, number } = parseEpisodeCode(e.episode);
    const base = { name: e.name, code: e.episode, season, number, airDate: parseAirDate(e.air_date) };
    const connect = e.characters.map(idFromUrl).filter((id: number | null) => id !== null && charIds.has(id)).map((id: number) => ({ id }));
    return db.episode.upsert({
      where: { id: e.id },
      update: { ...base, characters: { set: connect } },
      create: { id: e.id, ...base, characters: { connect } },
    });
  });

  const rows = [
    ["dimension", await db.dimension.count(), dimNames.length],
    ["location", await db.location.count(), locs.count],
    ["character", await db.character.count(), chars.count],
    ["episode", await db.episode.count(), eps.count],
  ] as const;
  console.table(rows.map(([entity, dbCount, api]) => ({ entity, db: dbCount, api, status: dbCount === api ? "OK" : "MISMATCH" })));
  if (rows.some(([, a, b]) => a !== b)) process.exitCode = 1;
}

main().finally(() => db.$disconnect());
