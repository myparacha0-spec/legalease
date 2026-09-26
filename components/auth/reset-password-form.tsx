"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { updatePassword, type AuthActionResult } from "@/app/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";

const initialState: AuthActionResult = { ok: true };

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(
    updatePassword,
    initialState
  );
  const [clientError, setClientError] = useState<string | null>(null);

  if (state.ok && state.message) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-teal/30 bg-teal-soft/60 px-6 py-10 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-teal text-white">
          <CheckCircle2 className="size-6" />
        </span>
        <h2 className="mt-5 font-heading text-lg font-bold text-navy">
          Password updated
        </h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {state.message}
        </p>
        <Button asChild className="mt-5">
          <Link href="/login">Log in with new password</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form
        action={formAction}
        className="space-y-5"
        onSubmit={(event) => {
          const form = event.currentTarget;
          const data = new FormData(form);
          if (data.get("password") !== data.get("confirm_password")) {
            event.preventDefault();
            setClientError("Passwords do not match.");
            return;
          }
          setClientError(null);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">New password</Label>
            <span className="text-xs text-muted-foreground">
              Min. 8 characters, letters + numbers
            </span>
          </div>
          <PasswordInput
            id="password"
            name="password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm_password">Confirm new password</Label>
          <PasswordInput
            id="confirm_password"
            name="confirm_password"
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
        </div>

        {(clientError ?? state.error) && (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Password reset failed</AlertTitle>
            <AlertDescription>{clientError ?? state.error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          <KeyRound />
          Set new password
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-teal hover:text-navy">
          Back to log in
        </Link>
      </p>
    </div>
  );
}