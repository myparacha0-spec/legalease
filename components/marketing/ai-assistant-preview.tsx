"use client";

import { useRef, useState } from "react";
import { Bot, Loader2, SendHorizonal, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const suggestions = [
  "My landlord wants to keep my security deposit",
  "My employer is holding my final salary",
  "What rights do I have when buying a property?",
];

const cannedReplies: { match: RegExp; reply: string }[] = [
  {
    match: /deposit|landlord|rent|tenant/i,
    reply:
      "Security deposits raise a common issue: deductions must usually be tied to actual documented damage, not just the landlord's preference. Start by reviewing your rental agreement for the clause on deposits, then send a written demand letter listing the amount, dates, and your right to return. Keep the contract and all payment receipts — that evidence is what consumer forums weigh first. You may also want to look at templates in the Resources section.",
  },
  {
    match: /salary|employer|terminat|notice|fired|leave/i,
    reply:
      "Leaving a job raises questions about final salary. Unless your contract explicitly allows a deduction for unworked notice, an employer generally can't withhold your full final dues as a punishment. First, check the exact wording of the notice clause. Then collect payslips, your appointment letter, and a copy of your resignation email. Employment lawyers in the directory handle exactly this kind of recovery case.",
  },
  {
    match: /proper|propert|buy|purchase|plot|house/i,
    reply:
      "Before buying property, the two checks that matter most are a clean title history and confirmation the seller owns what they're selling. Request an official title/history search, verify the seller's ownership documents, and confirm the project or society is legally approved. Never rely on a photocopy of a deed — verify at the sub-registrar's office. A real-estate lawyer can run a full due-diligence package for you.",
  },
];

function getReply(text: string): string {
  const match = cannedReplies.find(({ match: regex }) => regex.test(text));
  if (!match) {
    return "That's a good question to think through carefully. Here in the preview I can help with a few common topics — security deposits, employment and final salaries, and buying property. If your situation is outside those, the Resources section has plain-language guides, and our lawyer directory can connect you with someone who specialises in your issue.";
  }
  return match.reply;
}

export function AiAssistantPreview() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hi, I'm LegalEase — your preview legal assistant. Describe your situation in plain words and I'll point you toward what matters. This preview uses sample responses; the live assistant arrives with accounts in a later milestone.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    const question = text.trim();
    if (!question || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: getReply(question) },
      ]);
      setIsTyping(false);
      window.setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 30);
    }, 700);
  };

  return (
    <div className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl shadow-navy/5">
      <div className="flex items-center gap-3 border-b border-border bg-navy px-5 py-4">
        <span className="grid size-9 place-items-center rounded-full bg-teal text-white">
          <Bot className="size-5" />
        </span>
        <div>
          <p className="font-heading text-sm font-bold text-white">
            LegalEase Assistant
          </p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="size-1.5 rounded-full bg-gold" />
            Preview mode · sample responses
          </p>
        </div>
        <span className="ml-auto rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-white/70">
          Not legal advice
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.role === "user"
                ? "ml-auto flex max-w-[85%] items-start gap-2.5"
                : "mr-auto flex max-w-[90%] items-start gap-2.5"
            }
          >
            {message.role === "assistant" && (
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
                <Sparkles className="size-3.5" />
              </span>
            )}
            <div
              className={
                message.role === "user"
                  ? "rounded-2xl rounded-br-sm bg-navy px-4 py-3 text-sm leading-relaxed text-white"
                  : "rounded-2xl rounded-bl-sm border border-teal/20 bg-muted/60 px-4 py-3 text-sm leading-relaxed text-foreground"
              }
            >
              {message.text}
            </div>
            {message.role === "user" && (
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-navy/10 text-navy">
                <User className="size-3.5" />
              </span>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="mr-auto flex items-start gap-2.5">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
              <Sparkles className="size-3.5" />
            </span>
            <div className="rounded-2xl rounded-bl-sm border border-teal/20 bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border bg-background p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => send(suggestion)}
              className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-teal/40 hover:text-navy"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <Input
            aria-label="Ask the assistant"
            placeholder="Describe your situation in plain words…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1 bg-white"
          />
          <Button type="submit" disabled={!input.trim() || isTyping}>
            <SendHorizonal data-icon="inline-end" />
            Ask
          </Button>
        </form>
      </div>
    </div>
  );
}