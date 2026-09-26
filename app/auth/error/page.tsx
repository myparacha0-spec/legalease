import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: "Verification issue",
  description: "Your email verification link couldn't be completed.",
  robots: { index: false },
};

const ERROR_COPY: Record<string, { title: string; description: string }> = {
  invalid_link: {
    title: "This link has expired or is invalid",
    description:
      "Verification links are only valid for a short time. Request a fresh link from the login or password reset page and try again.",
  },
  missing_profile: {
    title: "Account needs a profile",
    description:
      "Your signup didn't create an application profile. Contact support so we can finish setting up your account.",
  },
};

const DEFAULT_COPY = {
  title: "Something went wrong",
  description:
    "We couldn't complete that verification. Please try again or request a new link.",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const code = Array.isArray(params.error) ? params.error[0] : params.error;

  const copy = (code ? ERROR_COPY[code] : null) ?? DEFAULT_COPY;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Alert variant="destructive" className="px-4 py-5">
          <AlertTriangle />
          <AlertTitle>{copy.title}</AlertTitle>
          <AlertDescription>{copy.description}</AlertDescription>
        </Alert>
        <div className="mt-6 flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/login">Go to log in</Link>
          </Button>
          <Button asChild variant="outline" className="w-full text-navy">
            <Link href="/">Back to homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}