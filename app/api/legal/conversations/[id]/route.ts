import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function jsonError(status: number, message: string): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

type RouteParams = { params: Promise<{ id: string }> };

/** Messages for one owned conversation (RLS-scoped by user). */
export async function GET(
  _request: Request,
  ctx: RouteParams
): Promise<NextResponse> {
  const { id } = await ctx.params;

  const supabase = await createClient();
  if (!supabase) {
    return jsonError(503, "Supabase is not configured yet.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return jsonError(401, "Unauthorized.");
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!conversation) {
    return jsonError(404, "Conversation not found.");
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, role, content, structured_response, sources, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) {
    return jsonError(500, "Could not load messages.");
  }

  return NextResponse.json({ messages: data ?? [] });
}

/** Delete one owned conversation (cascade removes its messages). */
export async function DELETE(
  _request: Request,
  ctx: RouteParams
): Promise<NextResponse> {
  const { id } = await ctx.params;

  const supabase = await createClient();
  if (!supabase) {
    return jsonError(503, "Supabase is not configured yet.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return jsonError(401, "Unauthorized.");
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!conversation) {
    return jsonError(404, "Conversation not found.");
  }

  const { error } = await supabase.from("conversations").delete().eq("id", id);
  if (error) {
    return jsonError(500, "Could not delete the conversation.");
  }

  return NextResponse.json({ ok: true });
}