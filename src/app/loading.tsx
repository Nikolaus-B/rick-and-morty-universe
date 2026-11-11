export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="grid min-h-[60vh] place-items-center">
      <div
        className="size-20 animate-spin rounded-full shadow-glow"
        style={{
          background:
            "radial-gradient(circle, var(--color-void) 38%, transparent 40%), conic-gradient(var(--color-portal-300), var(--color-portal-500), transparent 70%, var(--color-portal-300))",
        }}
      />
    </div>
  );
}
