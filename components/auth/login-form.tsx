"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { signIn, type AuthActionResult } from "@/app/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";

const initialState: AuthActionResult = { ok: true };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <div className="space-y-5">
      <form action={formAction} className="space-y-5">
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
          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="remember" name="remember" />
          <Label htmlFor="remember" className="text-sm font-normal">
            Keep me signed in
          </Label>
        </div>

        {state.error && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Unable to log in</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Log in
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to LegalEase?{" "}
        <Link href="/signup" className="font-medium text-teal hover:text-navy">
          Create an account
        </Link>
      </p>
    </div>
  );
}