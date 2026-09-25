"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { requestPasswordReset, type AuthActionResult } from "@/app/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionResult = { ok: true };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState
  );
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent && state.ok && state.message) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-teal/30 bg-teal-soft/60 px-6 py-10 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-teal text-white">
          <CheckCircle2 className="size-6" />
        </span>
        <h2 className="mt-5 font-heading text-lg font-bold text-navy">
          Check your inbox
        </h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          If an account exists for{" "}
          <span className="font-medium text-navy">{email}</span>, we&apos;ve sent
          a secure reset link.
        </p>
        <Button
          variant="outline"
          className="mt-5 text-navy"
          onClick={() => setSent(false)}
        >
          Request another link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form
        action={formAction}
        className="space-y-5"
        onSubmit={() => setSent(true)}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {state.error && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Couldn&apos;t send reset link</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-teal hover:text-navy">
          Back to log in
        </Link>
      </p>
    </div>
  );
}