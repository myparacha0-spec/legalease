"use client";

import { BookOpenText, Scale, UserRound } from "lucide-react";

import type { UiMessage } from "@/lib/legal-ai/types";
import { Markdown } from "@/components/legal-ai/markdown";
import { SourceCard } from "@/components/legal-ai/source-card";
import { Badge } from "@/components/ui/badge";

function confidenceLabel(value?: string): string {
  if (value === "high") return "High confidence";
  if (value === "medium") return "Medium confidence";
  return "Low confidence";
}

export function Message({ message }: { message: UiMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-navy px-4 py-2.5 text-sm text-white">
          {message.content}
        </div>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
          <UserRound className="size-4" data-icon="inline" />
        </span>
      </div>
    );
  }

  const structured = message.structured_response;

  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-navy text-gold">
        <Scale className="size-4" data-icon="inline" />
      </span>
      <div className="max-w-[89%] space-y-2 rounded-2xl rounded-bl-sm border border-border/70 bg-white px-4 py-3">
        {message.status === "error" ? (
          <p className="text-sm text-destructive">{message.error}</p>
        ) : (
          <Markdown content={message.content} />
        )}

        {structured && message.status !== "error" && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2">
            <Badge
              variant="secondary"
              className={
                structured.confidence === "high"
                  ? "bg-teal-soft text-teal"
                  : structured.confidence === "medium"
                    ? "bg-gold/20 text-navy-dark"
                    : "bg-muted text-muted-foreground"
              }
            >
              {confidenceLabel(structured.confidence)}
            </Badge>
            {structured.needs_lawyer && (
              <Badge variant="outline" className="text-navy">
                Consider a lawyer
              </Badge>
            )}
            {structured.mode === "insufficient" && (
              <Badge variant="outline" className="text-destructive">
                Knowledge-base gap
              </Badge>
            )}
          </div>
        )}

        {message.sources && message.sources.length > 0 && message.status !== "error" && (
          <div className="border-t border-border/60 pt-2">
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <BookOpenText className="size-3.5" data-icon="inline" />
              Sources from the verified knowledge base
            </p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, index) => (
                <SourceCard key={source.chunk_id} source={source} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}