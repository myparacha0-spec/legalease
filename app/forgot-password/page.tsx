import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your LegalEase password.",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="bg-grid-light mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <AuthCard
        title="Reset your password"
        description="Enter the email you signed up with and we'll send you a secure reset link."
      >
        <ForgotPasswordForm />
      </AuthCard>
    </div>
  );
}