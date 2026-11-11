export function idFromUrl(url?: string | null): number | null {
  const m = url?.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
}

export function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function parseEpisodeCode(code: string): { season: number; number: number } {
  const m = code.match(/^S(\d+)E(\d+)$/i);
  if (!m) throw new Error(`bad episode code: ${code}`);
  return { season: Number(m[1]), number: Number(m[2]) };
}

export function mapStatus(s: string): "ALIVE" | "DEAD" | "UNKNOWN" {
  return s === "Alive" ? "ALIVE" : s === "Dead" ? "DEAD" : "UNKNOWN";
}

export function dimensionName(d?: string | null): string {
  return !d || d === "unknown" ? "Unknown" : d;
}

export function parseAirDate(s?: string | null): Date | null {
  if (!s) return null;
  const d = new Date(`${s} UTC`);
  return isNaN(d.getTime()) ? null : d;
}

export const nullIfEmpty = (s?: string | null) => (s ? s : null);

// FNV-1a 32-bit
export function hash(n: number | string): number {
  let h = 0x811c9dc5;
  for (const c of String(n)) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

// independent 0..1 stream per salt
const unit = (id: number | string, salt: string) => hash(`${salt}:${id}`) / 0xffffffff;

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * v).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function visuals(id: number | string) {
  return {
    color: hslToHex(Math.floor(unit(id, "h") * 360), 65, 60),
    size: 0.6 + unit(id, "s"),
    orbitRadius: 4 + unit(id, "r") * 26,
    orbitAngle: unit(id, "a") * 2 * Math.PI,
  };
}
