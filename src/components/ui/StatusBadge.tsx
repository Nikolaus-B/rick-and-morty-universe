const map = {
  ALIVE: { label: "Alive", dot: "bg-alive-500 animate-pulse", text: "text-alive-500" },
  DEAD: { label: "Dead", dot: "bg-dead-500", text: "text-dead-500" },
  UNKNOWN: { label: "Unknown", dot: "bg-warn-500", text: "text-warn-500" },
} as const;

export function StatusBadge({ status }: { status: keyof typeof map }) {
  const s = map[status];
  return (
    <span className={`t-small inline-flex items-center gap-1.5 ${s.text}`}>
      <span className={`size-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
