import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AiAssistantPreview } from "@/components/marketing/ai-assistant-preview";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "AI Legal Assistant",
  description:
    "Ask the LegalEase AI assistant about your rights and next steps in plain language. Preview only — powered by sample responses.",
};

const capabilities = [
  {
    icon: Sparkles,
    title: "Plain-language explanations",
    description:
      "Ask about situations — deposits, employment, property — and get a readable breakdown of where you stand.",
  },
  {
    icon: ShieldCheck,
    title: "Honest about limits",
    description:
      "The assistant tells you when something is case-specific and routes you to a verified lawyer instead of guessing.",
  },
  {
    icon: TriangleAlert,
    title: "Balanced guidance",
    description:
      "Explains both what you can do and what the other side may argue, so decisions are informed rather than one-sided.",
  },
];

export default function AiAssistantPage() {
  return (
    <>
      <section className="border-b border-border bg-gradient-to-br from-navy via-navy-dark to-teal">
        <div className="bg-grid-navy pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="border-white/15 bg-white/10 text-white">
              <Sparkles className="!size-3 text-gold" />
              AI Legal Assistant · Preview
            </Badge>
            <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ask. Understand. Act.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
              Describe your situation and get a plain-language read on your
              rights and next steps — or a confident push toward the right
              lawyer when you really need one.
            </p>
          </div>
        </div>
        <div className="relative mx-auto -mb-16 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <AiAssistantPreview />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="border-gold/30 bg-gold-soft text-navy">
            What this preview does
          </Badge>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            This preview is built with sample responses so the experience can be
            tested end-to-end. The production assistant — backed by curated
            legal knowledge and your account context — arrives in a later
            milestone. Nothing here is legal advice.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="gap-4">
              <CardContent className="space-y-4 p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-teal-soft text-teal">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-heading text-lg font-bold text-navy">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild>
            <Link href="/lawyers">
              Talk to a verified lawyer
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>

      <CtaSection />
    </>
  );
}