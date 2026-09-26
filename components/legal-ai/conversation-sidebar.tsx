"use client";

import { MessageSquareText, Plus, Trash2 } from "lucide-react";
import type { ConversationSummary } from "@/lib/legal-ai/types";

interface ConversationSidebarProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border/70 bg-white">
      <div className="border-b border-border/70 p-3">
        <button
          type="button"
          onClick={onNew}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-navy/90"
        >
          <Plus className="size-4" data-icon="inline" />
          New conversation
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {conversations.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No conversations yet. Ask your first legal question to get started.
          </p>
        )}
        {conversations.map((conversation) => {
          const active = conversation.id === activeId;
          return (
            <div
              key={conversation.id}
              className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors ${
                active
                  ? "bg-teal-soft/70 text-navy"
                  : "text-foreground/80 hover:bg-muted/60"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <MessageSquareText
                  className={`size-4 shrink-0 ${active ? "text-teal" : "text-muted-foreground"}`}
                  data-icon="inline"
                />
                <span className="truncate text-xs font-medium">{conversation.title}</span>
              </button>
              <button
                type="button"
                onClick={() => onDelete(conversation.id)}
                aria-label={`Delete conversation: ${conversation.title}`}
                className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 className="size-3.5" data-icon="inline" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border/70 p-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Answers come from verified Pakistani law in the LegalEase knowledge base.
        </p>
      </div>
    </aside>
  );
}