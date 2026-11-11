import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { CharacterStatus } from "@prisma/client";

type C = { id: number; name: string; status: CharacterStatus; species: string; imageUrl: string; location?: { name: string } | null };

export function CharacterCard({ c }: { c: C }) {
  return (
    <Link href={`/character/${c.id}`} className="glass group block overflow-hidden rounded-card transition-shadow hover:shadow-glow focus-visible:outline-2 focus-visible:outline-portal-300">
      <Image src={c.imageUrl} alt={c.name} width={300} height={300} sizes="(min-width:1024px) 20vw, 50vw" className="aspect-square w-full object-cover" />
      <div className="space-y-1 p-3">
        <h3 className="truncate font-semibold">{c.name}</h3>
        <StatusBadge status={c.status} />
        <p className="t-small truncate text-text-muted">{c.species}{c.location ? ` · ${c.location.name}` : ""}</p>
      </div>
    </Link>
  );
}
