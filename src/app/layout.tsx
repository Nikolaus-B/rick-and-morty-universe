import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Rick and Morty Universe",
  description:
    "Unofficial fan site exploring the Rick and Morty universe. Not affiliated with Adult Swim, Warner Bros. or the creators of the show.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${manrope.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <header className="glass sticky top-0 z-10 border-x-0 border-t-0">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-display font-bold focus-visible:outline-2 focus-visible:outline-portal-300">Rick and Morty Universe</Link>
            <nav aria-label="Main">
              <Link href="/browse" className="t-small hover:text-portal-300 focus-visible:outline-2 focus-visible:outline-portal-300">Browse</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
