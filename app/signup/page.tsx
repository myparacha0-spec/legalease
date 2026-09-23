import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a free LegalEase account.",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <div className="bg-grid-light mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <AuthCard
        title="Create your account"
        description="Free to join. Browse verified lawyers, save favourites, and prepare for consultations."
      >
        <SignupForm />
      </AuthCard>
    </div>
  );
}