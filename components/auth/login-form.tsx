"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
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
              Login preview
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Sign-in with Supabase lands in the next milestone, together with
              citizen, lawyer, and admin dashboards.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
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
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-teal hover:text-navy"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="size-4 rounded border-border accent-[color:var(--brand-navy)]"
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Keep me signed in
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Log in
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        New to LegalEase?{" "}
        <Link href="/signup" className="font-medium text-teal hover:text-navy">
          Create an account
        </Link>
      </p>
    </div>
  );
}