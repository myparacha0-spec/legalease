"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";

/**
 * Safe markdown renderer for AI responses. No raw HTML is ever rendered —
 * react-markdown escapes anything that isn't markdown by default.
 */
export function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h2 className="mt-3 font-semibold text-navy" {...props} />,
          h2: (props) => <h3 className="mt-3 font-semibold text-navy" {...props} />,
          h3: (props) => <h4 className="mt-2 font-semibold text-navy" {...props} />,
          h4: (props) => <h5 className="mt-2 font-semibold text-navy" {...props} />,
          p: (props) => <p className="text-foreground/90" {...props} />,
          ul: (props) => <ul className="ml-4 list-disc space-y-1" {...props} />,
          ol: (props) => <ol className="ml-4 list-decimal space-y-1" {...props} />,
          li: (props) => <li className="text-foreground/90" {...props} />,
          blockquote: (props) => (
            <blockquote
              className="border-l-2 border-gold/70 bg-navy/[0.04] px-3 py-1.5 text-foreground/80 italic"
              {...props}
            />
          ),
          code: (props) => (
            <code
              className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
              {...props}
            />
          ),
          a: ({ href, children, ...props }) =>
            href && /^https?:\/\//.test(href) ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-teal underline underline-offset-4 hover:text-navy"
                {...props}
              >
                {children}
                <ExternalLink className="size-3" data-icon="inline" />
              </a>
            ) : (
              <span>{children}</span>
            ),
          strong: (props) => <strong className="font-semibold text-navy" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}