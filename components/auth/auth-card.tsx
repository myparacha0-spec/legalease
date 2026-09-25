import type { ReactNode } from "react";
import Link from "next/link";
import { BadgeCheck, BookOpenText, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const highlights = [
  {
    icon: BadgeCheck,
    title: "Verified lawyers only",
    description: "Every profile is checked against bar records.",
  },
  {
    icon: BookOpenText,
    title: "Plain-language guidance",
    description: "Resources written for people, not lawyers.",
  },
  {
    icon: Sparkles,
    title: "AI that points you forward",
    description: "Instant orientation before you commit.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays private",
    description: "Never sold. Never shared without consent.",
  },
];

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex justify-center lg:hidden">
        <Logo />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xl shadow-navy/5">
        <div className="hidden bg-navy px-8 py-10 lg:block">
          <Logo variant="light" />
          <p className="mt-6 font-heading text-2xl font-bold leading-snug text-white">
            Legal help without the runaround.
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon: Icon, title: itemTitle, description: itemDescription }) => (
              <li key={itemTitle} className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-gold">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {itemTitle}
                  </p>
                  <p className="text-xs text-white/60">{itemDescription}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-navy">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
      <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
        <Link href="/" className="font-medium text-navy hover:underline">
          Back to homepage
        </Link>
      </p>
    </div>
  );
}