import fs from "node:fs";
import path from "node:path";

const BASE = "https://rickandmortyapi.com/api";
const RAW = path.join(process.cwd(), "data/raw");
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson(url: string): Promise<any> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return await res.json();
    } catch (e) {
      if (attempt >= 5) throw e;
      await sleep(1000 * 2 ** attempt);
    }
  }
}

export async function fetchAll<T = any>(
  kind: "character" | "location" | "episode",
  refresh = process.argv.includes("--refresh"),
): Promise<{ results: T[]; count: number }> {
  const file = path.join(RAW, `${kind}.json`);
  if (!refresh && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  const results: T[] = [];
  let count = 0;
  let url: string | null = `${BASE}/${kind}`;
  while (url) {
    const page = await getJson(url);
    count = page.info.count;
    results.push(...page.results);
    url = page.info.next;
    await sleep(100);
  }
  fs.mkdirSync(RAW, { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ results, count }));
  return { results, count };
}
