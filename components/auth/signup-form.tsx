"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setPreview(true);
    }, 800);
  };

  return (
    <div className="space-y-5">
      {preview ? (
        <div className="flex items-start gap-3 rounded-xl border border-gold/40 bg-gold-soft/60 px-4 py-4">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-gold text-navy-dark">
            <Info className="size-4" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-navy">
              Account creation preview
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Full sign-up with Supabase Auth arrives in the next milestone.
              Citizen, lawyer, and admin dashboards will follow.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Aliya Khan"
              autoComplete="name"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="text-xs text-muted-foreground">
                Min. 8 characters
              </span>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
          <div className="flex items-start gap-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="mt-1 size-4 rounded border-border accent-[color:var(--brand-navy)]"
              required
            />
            <Label htmlFor="terms" className="text-xs font-normal leading-relaxed">
              I agree to the Terms of Service and Privacy Policy, and I
              understand the AI assistant is not a substitute for legal advice.
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Create account
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-teal hover:text-navy">
          Log in
        </Link>
      </p>
    </div>
  );
}