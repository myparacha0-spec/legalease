import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your LegalEase account.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="bg-grid-light mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <AuthCard
        title="Welcome back"
        description="Log in to manage consultations, saved lawyers, and assistant conversations."
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}