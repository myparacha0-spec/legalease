"use client";

import { useState } from "react";
import { ArrowUpRight, Briefcase, UserRound } from "lucide-react";
import type { Role } from "@/lib/auth/types";
import { SignupForm } from "@/components/auth/signup-form";

const roleOptions: {
  role: Role;
  icon: typeof UserRound;
  title: string;
  description: string;
}[] = [
  {
    role: "citizen",
    icon: UserRound,
    title: "I need legal help",
    description:
      "Find verified lawyers, save favourites, and get oriented before a consultation.",
  },
  {
    role: "lawyer",
    icon: Briefcase,
    title: "I offer legal services",
    description:
      "Create a professional profile, receive enquiries, and grow your practice.",
  },
];

export function SignupFlow() {
  const [role, setRole] = useState<Role | null>(null);

  if (role) {
    return <SignupForm role={role} onBack={() => setRole(null)} />;
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3">
        {roleOptions.map(({ role: optionRole, icon: Icon, title, description }) => (
          <button
            key={optionRole}
            type="button"
            onClick={() => setRole(optionRole)}
            className="group flex items-start gap-4 rounded-xl border border-border bg-white p-4 text-left transition-all hover:border-teal hover:bg-teal-soft/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-navy group-hover:text-gold">
              <Icon className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block font-heading text-base font-bold text-navy">
                {title}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                {description}
              </span>
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-teal" />
          </button>
        ))}
      </div>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Citizens and lawyers share one platform. Your role is locked after
        sign-up, so choose the one that fits.
      </p>
    </div>
  );
}