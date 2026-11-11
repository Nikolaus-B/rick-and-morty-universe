import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  href?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn px-5 py-2.5 font-semibold transition-[box-shadow,background-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-portal-300";
const variants = {
  primary: "bg-portal-500 text-void hover:shadow-glow",
  secondary: "bg-transparent text-text-primary border border-border hover:bg-elevated",
};

export function Button({ variant = "primary", href, className = "", ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) return <Link href={href} className={cls}>{rest.children}</Link>;
  return <button className={cls} {...rest} />;
}
