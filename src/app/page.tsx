import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-4">
      <h1 className="t-display">Rick and Morty Universe</h1>
      <p className="text-text-muted">Explore every dimension, location and character of the multiverse.</p>
      <Button href="/browse">Enter the portal</Button>
    </main>
  );
}
