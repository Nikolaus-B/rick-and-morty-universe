"use client";
import Image from "next/image";
import type { CharacterStatus } from "@prisma/client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { StatusBadge } from "@/components/ui/StatusBadge";

const MAX = 12;
const spring = { stiffness: 200, damping: 20, mass: 0.5 };

export function HoloCard({ name, imageUrl, status }: { name: string; imageUrl: string; status: CharacterStatus }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const rotateY = useTransform(sx, [0, 1], [-MAX, MAX]);
  const rotateX = useTransform(sy, [0, 1], [MAX, -MAX]);
  const glarePos = useTransform([sx, sy], ([x, y]: number[]) => `${x * 100}% ${y * 100}%`);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { px.set(0.5); py.set(0.5); };

  return (
    <div className="w-full max-w-xs" style={{ perspective: 800 }}>
      <motion.div
        onPointerMove={move}
        onPointerLeave={leave}
        style={reduce ? undefined : { rotateX, rotateY }}
        className="relative aspect-square overflow-hidden rounded-card border border-border bg-panel transition-shadow hover:shadow-glow"
      >
        <Image src={imageUrl} alt={name} fill sizes="320px" priority className="object-cover" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-color-dodge"
          style={{
            backgroundImage: "linear-gradient(115deg, var(--color-rick-300), var(--color-portal-300), var(--color-morty-400), var(--color-rick-300))",
            backgroundSize: "300% 300%",
            backgroundPosition: reduce ? "50% 50%" : glarePos,
          }}
        />
        <div aria-hidden className="scanlines pointer-events-none absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="font-semibold">{name}</span>
          <StatusBadge status={status} />
        </div>
      </motion.div>
    </div>
  );
}
