import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { dashboardPathForRole, getRoleForUser } from "@/lib/auth/profile";
import { ChatInterface } from "@/components/legal-ai/chat-interface";

export const metadata: Metadata = {
  title: "AI Legal Assistant",
  description:
    "Ask about Pakistani law — grounded answers from the verified LegalEase knowledge base.",
  robots: { index: false },
};

export default async function AiAssistantPage() {
  const supabase = await createClient();

  if (!supabase) {
    redirect("/");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const role = await getRoleForUser(supabase, user);
  if (!role) {
    redirect("/login");
  }

  // If an admin somehow lands here, send them to their own dashboard.
  if (role === "admin") {
    redirect(dashboardPathForRole("admin"));
  }

  return <ChatInterface />;
}