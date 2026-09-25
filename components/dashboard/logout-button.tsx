"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function DashboardLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    setPending(true);
    if (supabase) {
      await supabase.auth.signOut();
    }
    setPending(false);
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={pending}
      className="text-navy"
    >
      {pending ? <Loader2 className="animate-spin" /> : <LogOut />}
      Log out
    </Button>
  );
}