"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import type { UiSource } from "@/lib/legal-ai/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function refLabel(source: UiSource): string {
  const parts: string[] = [];
  if (source.section_number) parts.push(`Ss. ${source.section_number}`);
  if (source.article_number) parts.push(`Art. ${source.article_number}`);
  if (source.page_number) parts.push(`p. ${source.page_number}`);
  return parts.join(" · ");
}

function metaLabel(source: UiSource): string {
  const parts: string[] = [];
  if (source.category) parts.push(source.category);
  if (source.jurisdiction_level) parts.push(source.jurisdiction_level);
  if (source.province) parts.push(source.province);
  return parts.join(" · ");
}

/**
 * Truncated chip shown under an assistant answer. Opens a dialog with the
 * original excerpt (from the retrieved verified chunk) and document metadata.
 */
export function SourceCard({ source, index }: { source: UiSource; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex max-w-[240px] items-center gap-2 rounded-lg border border-border/80 bg-navy/[0.03] px-3 py-1.5 text-left text-xs text-navy transition-colors hover:border-teal/60 hover:bg-teal-soft/50"
        >
          <FileText className="size-3.5 shrink-0 text-teal" data-icon="inline" />
          <span className="truncate">
            [{index + 1}] {source.title}
            {refLabel(source) ? ` — ${refLabel(source)}` : ""}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading text-navy">
            [{index + 1}] {source.title}
          </DialogTitle>
          <DialogDescription asChild>
            <span>{metaLabel(source)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {refLabel(source) && (
            <p className="font-medium text-navy">{refLabel(source)}</p>
          )}
          <blockquote className="overflow-auto rounded-lg border border-border/70 bg-muted/40 p-3 text-[13px] leading-relaxed text-foreground/85">
            {source.excerpt}
          </blockquote>
          {source.official_source_url && (
            <a
              href={source.official_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-teal hover:text-navy"
            >
              Official source
            </a>
          )}
          {typeof source.similarity === "number" && (
            <p className="text-xs text-muted-foreground">
              Retrieval relevance: {(source.similarity * 100).toFixed(0)}%
            </p>
          )}
          <p className="text-xs leading-relaxed text-muted-foreground">
            Shown excerpt is from the verified LegalEase knowledge base and may be a
            condensed snippet. Always confirm details against the original law.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}