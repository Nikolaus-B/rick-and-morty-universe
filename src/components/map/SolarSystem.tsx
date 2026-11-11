"use client";
import Link from "next/link";
import { useState } from "react";

export type Planet = { id: number; name: string; type: string | null; color: string | null; size: number; orbitRadius: number; orbitAngle: number; residents: number };
const V = 1000, C = V / 2;

export function SolarSystem({ planets }: { planets: Planet[] }) {
  const [hover, setHover] = useState<Planet | null>(null);
  const rs = planets.map((p) => p.orbitRadius);
  const min = Math.min(...rs), max = Math.max(...rs);
  // map min..max to 15%..45% of the viewBox
  const norm = (r: number) => V * (max === min ? 0.3 : 0.15 + ((r - min) / (max - min)) * 0.3);
  const pos = (p: Planet) => ({ x: C + Math.cos(p.orbitAngle) * norm(p.orbitRadius), y: C + Math.sin(p.orbitAngle) * norm(p.orbitRadius) });
  const h = hover && pos(hover);
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${V} ${V}`} className="block h-auto w-full" role="group" aria-label="Система локацій">
        <style>{`@keyframes orbit{to{transform:rotate(360deg)}}.orb{transform-origin:${C}px ${C}px;animation:orbit 240s linear infinite}`}</style>
        <circle cx={C} cy={C} r={28} fill="#fde68a" />
        <circle cx={C} cy={C} r={60} fill="#fde68a" opacity={0.2} />
        {[...new Set(rs)].map((r) => <circle key={r} cx={C} cy={C} r={norm(r)} fill="none" stroke="#fff" strokeOpacity={0.15} />)}
        <g className="orb">
          {planets.map((p) => {
            const { x, y } = pos(p);
            return (
              <Link key={p.id} href={`/location/${p.id}`} aria-label={`${p.name}${p.type ? `, ${p.type}` : ""}, ${p.residents} мешканців`}
                onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p)} onBlur={() => setHover(null)}
                className="cursor-pointer outline-none [&:focus-visible>.ring]:opacity-100">
                <circle cx={x} cy={y} r={Math.max(8, p.size * 14)} fill={p.color ?? "#7dd3fc"} />
                <circle className="ring opacity-0" cx={x} cy={y} r={Math.max(8, p.size * 14) + 5} fill="none" stroke="#fff" strokeWidth={2.5} />
              </Link>
            );
          })}
        </g>
      </svg>
      {hover && h && (
        <div role="tooltip" className="glass pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-btn px-3 py-2 t-small" style={{ left: "50%", top: "8px" }}>
          <b>{hover.name}</b><br />{hover.type ?? "Unknown type"} · {hover.residents} мешканців
        </div>
      )}
    </div>
  );
}
