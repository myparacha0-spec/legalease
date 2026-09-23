"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-border bg-white px-6 py-20 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-teal-soft text-teal">
          <CheckCircle2 className="size-7" />
        </span>
        <h2 className="mt-6 font-heading text-2xl font-bold text-navy">
          Message received
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out. We&apos;ll reply to the email you provided
          within one business day. This is a preview form — no message was
          actually sent.
        </p>
        <Button
          variant="outline"
          className="mt-6 text-navy"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-white p-6 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Aliya Khan" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="topic">Topic</Label>
        <Select name="topic">
          <SelectTrigger id="topic" className="w-full">
            <SelectValue placeholder="What is your message about?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General question</SelectItem>
            <SelectItem value="lawyer">Finding a lawyer</SelectItem>
            <SelectItem value="assistant">AI assistant</SelectItem>
            <SelectItem value="partner">Partner with LegalEase</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us what's on your mind…"
          className="min-h-32 flex-1"
          required
        />
      </div>

      <Button type="submit" className="mt-2 w-full sm:w-auto" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        Send message
      </Button>
      <p className="text-xs text-muted-foreground">
        Preview form — submissions are simulated and not stored anywhere.
      </p>
    </form>
  );
}