"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { LayoutDashboard, Loader2, LogOut, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config/supabase";
import { DASHBOARD_PATH, type Role } from "@/lib/auth/types";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface HeaderAuthProps {
  /** How to lay out the control: inline buttons (desktop) or stacked (mobile sheet). */
  layout?: "desktop" | "mobile";
}

/**
 * Session-aware auth area rendered inside SiteHeader. Uses the browser
 * Supabase client only (never the anon key) — if Supabase isn't configured,
 * it gracefully falls back to the public Log in / Get started buttons.
 */
export function HeaderAuth({ layout = "desktop" }: HeaderAuthProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(() => isSupabaseConfigured());
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      return;
    }

    let cancelled = false;

    const loadProfile = async (current: Session) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", current.user.id)
        .maybeSingle();
      if (cancelled || !profile) return;
      if (profile.role === "citizen" || profile.role === "lawyer") {
        setRole(profile.role);
      }
      if (profile.full_name) setName(profile.full_name);
    };

    supabase.auth
      .getSession()
      .then(async ({ data: { session: current } }) => {
        if (cancelled) return;
        setSession(current);
        setLoading(false);
        if (current) {
          await loadProfile(current);
        }
      })
.catch(() => {
          if (!cancelled) setLoading(false);
        });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (cancelled) return;
        setSession(nextSession);
        if (!nextSession) {
          setRole(null);
          setName("");
        }
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      setSigningOut(true);
      await supabase.auth.signOut();
    }
    setSession(null);
    setRole(null);
    setName("");
    setSigningOut(false);
    router.replace("/");
    router.refresh();
  };

  if (loading) {
    return <Skeleton className="h-9 w-36" />;
  }

  if (!session) {
    const isMobile = layout === "mobile";
    return (
      <div
        className={
          isMobile
            ? "flex flex-col gap-2"
            : "flex items-center gap-2"
        }
      >
        <Button
          asChild
          variant={isMobile ? "outline" : "ghost"}
          className={isMobile ? "w-full text-navy" : "text-muted-foreground"}
        >
          <Link href="/login">Log in</Link>
        </Button>
        <Button
          asChild
          className={isMobile ? "w-full" : undefined}
        >
          <Link href="/signup">
            {!isMobile && <Sparkles />}
            Get started
          </Link>
        </Button>
      </div>
    );
  }

  const email = session.user.email ?? "";
  const displayName = name || email.split("@")[0];
  const dashboardHref = role ? DASHBOARD_PATH[role] : null;

  if (layout === "mobile") {
    return (
      <div className="flex flex-col gap-2">
        {dashboardHref && (
          <Button asChild variant="outline" className="w-full text-navy">
            <Link href={dashboardHref}>
              <LayoutDashboard />
              My dashboard
            </Link>
          </Button>
        )}
        <Button
          className="w-full"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
          Log out
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar>
            <AvatarFallback className="bg-navy text-xs font-semibold text-white">
              {initials(displayName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-semibold text-navy">
            {displayName}
          </p>
          <p className="truncate text-xs font-normal text-muted-foreground">
            {email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dashboardHref && (
          <DropdownMenuItem asChild>
            <Link href={dashboardHref}>
              <LayoutDashboard />
              My dashboard
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LogOut />
          )}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}