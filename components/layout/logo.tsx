import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

export function Logo({ variant = "dark", className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="LegalEase home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-white ring-1 ring-border/60">
        <Image
          src="/leagaleaselogo.png"
          alt="LegalEase logo"
          width={40}
          height={40}
          className="size-8 object-contain"
        />
      </span>
      <span
        className={cn(
          "font-heading text-lg font-bold tracking-tight",
          variant === "dark" ? "text-navy" : "text-white"
        )}
      >
        Legal<span className="text-gold">Ease</span>
      </span>
    </Link>
  );
}