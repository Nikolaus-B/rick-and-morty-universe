import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="t-mono uppercase text-text-muted">404</p>
      <h1 className="t-h1">Lost in another dimension</h1>
      <p className="text-text-muted">This page does not exist in any universe we know.</p>
      <Button href="/">Back to start</Button>
    </main>
  );
}
