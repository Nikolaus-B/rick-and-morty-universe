"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

export type MapDim = { id: number; name: string; color: string | null; locations: number; residents: number };
const W = 1000, H = 640, GOLD = 2.399963;

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

export function DimensionMap({ dims }: { dims: MapDim[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [hint, setHint] = useState(true);
  const stars = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: 150 }, () => ({ x: r() * W, y: r() * H, r: 0.4 + r() * 1.1, o: 0.3 + r() * 0.6 }));
  }, []);
  const nodes = useMemo(() => {
    const home = dims.find((d) => d.name === "Dimension C-137");
    const rest = dims.filter((d) => d !== home);
    const rad = (d: MapDim) => Math.min(44, 12 + 6 * Math.sqrt(d.locations));
    const out = rest.map((d, i) => {
      const a = i * GOLD, p = 75 * Math.sqrt(i + 1.5);
      return { d, x: W / 2 + Math.cos(a) * p * 1.35, y: H / 2 + Math.sin(a) * p * 0.9, r: rad(d) };
    });
    if (home) out.unshift({ d: home, x: W / 2, y: H / 2, r: rad(home) });
    return out;
  }, [dims]);
  const h = nodes.find((n) => n.d.id === hover);
  const c137 = nodes.find((n) => n.d.name === "Dimension C-137");

  return (
    <div className="relative overflow-hidden rounded-card border border-border bg-void">
      <div className="absolute right-3 top-3 z-10">
        <Button variant="secondary" href="/browse">Список</Button>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="group" aria-label="Мапа вимірів">
        <defs>
          <radialGradient id="glow"><stop offset="0%" stopColor="#fff" stopOpacity=".9" /><stop offset="45%" stopColor="#fff" stopOpacity=".35" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient>
        </defs>
        {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />)}
        {nodes.map(({ d, x, y, r }) => {
          const col = d.color ?? "#7dd3fc";
          const active = hover === d.id;
          return (
            <Link key={d.id} href={`/dimension/${d.id}`} aria-label={`${d.name}: ${d.locations} локацій, ${d.residents} мешканців`}
              onMouseEnter={() => { setHover(d.id); setHint(false); }} onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(d.id)} onBlur={() => setHover(null)} onClick={() => setHint(false)}
              className="cursor-pointer outline-none [&:focus-visible>.ring]:opacity-100">
              <circle cx={x} cy={y} r={r * 2} fill={col} opacity={active ? 0.45 : 0.25} style={{ transition: "opacity 200ms" }} />
              <circle cx={x} cy={y} r={r} fill={col} opacity={0.9} />
              <circle className="ring opacity-0" cx={x} cy={y} r={r + 6} fill="none" stroke="#fff" strokeWidth={2.5} style={{ transition: "opacity 150ms" }} />
              {active && <text x={x} y={y + r + 18} textAnchor="middle" fill="#fff" fontSize="14">{d.name}</text>}
            </Link>
          );
        })}
        {c137 && hint && (
          <g pointerEvents="none">
            <circle className="animate-pulse" cx={c137.x} cy={c137.y} r={c137.r + 12} fill="none" stroke="#fff" strokeWidth={2} />
            <text x={c137.x} y={c137.y - c137.r - 22} textAnchor="middle" fill="#fff" fontSize="15">Обери вимір</text>
          </g>
        )}
      </svg>
      {h && (
        <div role="tooltip" className="glass pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-btn px-3 py-2 t-small"
          style={{ left: `${(h.x / W) * 100}%`, top: `${((h.y - h.r - 6) / H) * 100}%` }}>
          <b>{h.d.name}</b><br />{h.d.locations} локацій · {h.d.residents} мешканців
        </div>
      )}
    </div>
  );
}
