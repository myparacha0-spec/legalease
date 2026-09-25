"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, CalendarClock, Landmark } from "lucide-react";

import type {
  ConversationSummary,
  UiMessage,
  UiSource,
  UiStructuredResponse,
} from "@/lib/legal-ai/types";
import { Message } from "@/components/legal-ai/message";
import { ConversationSidebar } from "@/components/legal-ai/conversation-sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatApiResponse {
  conversation_id: string;
  assistant_message: {
    id: string;
    content: string;
    structured_response: UiStructuredResponse;
    sources: UiSource[];
    created_at: string;
  };
}

function uid(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatInterface() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/legal/conversations", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { conversations: ConversationSummary[] };
      setConversations(data.conversations ?? []);
    } catch {
      /* non-fatal */
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const selectConversation = useCallback(
    async (id: string) => {
      if (activeId === id && messages.length > 0) return;
      setActiveId(id);
      setLoadingConversation(true);
      setMessages([]);
      try {
        const res = await fetch(`/api/legal/conversations/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("load failed");
        const data = (await res.json()) as {
          messages: Array<{
            id: string;
            role: "user" | "assistant";
            content: string;
            structured_response: UiStructuredResponse | null;
            sources: UiSource[] | null;
            created_at: string;
          }>;
        };
        setMessages(
          (data.messages ?? []).map((m) => ({
            ...m,
            sources: m.sources ?? null,
            structured_response: m.structured_response ?? null,
            status: "done" as const,
          }))
        );
      } catch {
        setMessages([
          {
            id: uid(),
            role: "assistant",
            content: "",
            status: "error",
            error: "Could not load this conversation.",
          },
        ]);
      } finally {
        setLoadingConversation(false);
      }
    },
    [activeId, messages.length]
  );

  const startNewConversation = useCallback(() => {
    setActiveId(null);
    setMessages([]);
  }, []);

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/legal/conversations/${id}`, { method: "DELETE" });
      } catch {
        /* ignore */
      }
      const next = conversations.filter((c) => c.id !== id);
      setConversations(next);
      if (activeId === id) startNewConversation();
    },
    [activeId, conversations, startNewConversation]
  );

  const sendMessage = useCallback(async () => {
    const message = input.trim();
    if (!message || sending) return;

    const tempId = uid();
    const userMessage: UiMessage = {
      id: tempId,
      role: "user",
      content: message,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/legal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversation_id: activeId ?? undefined }),
      });

      if (res.status === 429) {
        throw new Error("You are sending messages too quickly. Wait a moment and try again.");
      }

      const ok = res.ok;
      const data = (await res.json()) as ChatApiResponse | { error?: string };
      if (!ok) {
        throw new Error((data as { error?: string }).error ?? "Something went wrong while answering.");
      }
      if ("error" in data) {
        throw new Error(data.error ?? "Something went wrong while answering.");
      }
      const chat = data as ChatApiResponse;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, role: "user", status: "done" } : m
        )
      );

      setMessages((prev) => [
        ...prev,
        {
          id: chat.assistant_message.id,
          role: "assistant",
          content: chat.assistant_message.content,
          structured_response: chat.assistant_message.structured_response ?? null,
          sources: chat.assistant_message.sources ?? null,
          created_at: chat.assistant_message.created_at,
          status: "done",
        },
      ]);

      if (!activeId || activeId !== chat.conversation_id) {
        setActiveId(chat.conversation_id);
        await loadConversations();
      } else {
        // bump title/order
        loadConversations();
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, role: "user", status: "error", error: (err as Error).message }
            : m
        )
      );
    } finally {
      setSending(false);
    }
  }, [input, sending, activeId, loadConversations]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden border-b border-border/70 bg-muted/30">
      <div className="hidden lg:block">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={selectConversation}
          onNew={startNewConversation}
          onDelete={deleteConversation}
        />
      </div>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border/70 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-navy text-gold">
              <Bot className="size-5" data-icon="inline" />
            </span>
            <div>
              <h1 className="font-heading text-base font-bold text-navy">
                AI Legal Assistant
              </h1>
              <p className="text-xs text-muted-foreground">
                Karachi · Sindh · Pakistan — grounded answers with cited sources
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={startNewConversation}
          >
            New chat
          </Button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.length === 0 && !loadingConversation ? (
            <EmptyState />
          ) : (
            messages.map((m) => <Message key={m.id} message={m} />)
          )}
          {sending && (
            <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-teal" />
              <span className="size-2 animate-pulse rounded-full bg-teal" style={{ animationDelay: "0.2s" }} />
              <span className="size-2 animate-pulse rounded-full bg-teal" style={{ animationDelay: "0.4s" }} />
              <span className="ml-1">Searching the knowledge base and drafting a grounded answer…</span>
            </div>
          )}
        </div>

        <div className="border-t border-border/70 bg-white px-4 py-3 sm:px-6">
          <Composer
            input={input}
            setInput={setInput}
            sending={sending}
            onSend={sendMessage}
            onKeyDown={handleKeyDown}
          />
          <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
            LegalEase provides general legal orientation only and does not constitute
            legal advice. For case-specific matters, please consult a qualified lawyer.
          </p>
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-10 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-navy text-gold">
        <Landmark className="size-8" data-icon="inline" />
      </span>
      <div>
        <h2 className="font-heading text-xl font-bold text-navy">
          Ask about Pakistani law, plainly explained
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Begin with topics like rent disputes, family matters, criminal procedure,
          contracts, or consumer rights in Karachi and Sindh. Every answer is grounded
          in the verified LegalEase knowledge base and shows its sources.
        </p>
      </div>
      <div className="grid w-full gap-2 rounded-xl border border-border/70 bg-white p-4 text-left text-xs text-muted-foreground sm:grid-cols-2">
        <Example title="Example questions">
          ● &quot;Can my landlord increase my rent without notice?&quot;
          <br />
          ● &quot;What are my options if I want a divorce?&quot;
          <br />
          ● &quot;What should I do if the police refuse my FIR?&quot;
        </Example>
        <div className="space-y-1.5">
          <p className="font-semibold text-navy">How it works</p>
          <p>1. Matches verified laws for your question.</p>
          <p>2. Drafts an answer from those sources only.</p>
          <p>3. Shows the exact law it used, with excerpts.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs text-navy-dark">
        <CalendarClock className="size-3.5" data-icon="inline" />
        Knowledge base contents are verified by LegalEase staff before publication.
      </div>
    </div>
  );
}

function Example({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 font-semibold text-navy">{title}</p>
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

function Composer({
  input,
  setInput,
  sending,
  onSend,
  onKeyDown,
}: {
  input: string;
  setInput: (value: string) => void;
  sending: boolean;
  onSend: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="mx-auto flex max-w-3xl items-end gap-2">
      <Textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Ask a legal question… (Enter to send, Shift+Enter for a new line)"
        rows={1}
        className="max-h-36 min-h-[44px] resize-none"
        aria-label="Your legal question"
      />
      <Button
        type="button"
        onClick={onSend}
        disabled={sending || input.trim().length === 0}
        className="h-[44px] shrink-0"
        aria-label="Send message"
      >
        {sending ? (
          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <ArrowUp className="size-4" data-icon="inline" />
        )}
      </Button>
    </div>
  );
}