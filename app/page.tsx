import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  HeartPulse,
  Landmark,
  Lightbulb,
  MessageSquareText,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CtaSection } from "@/components/marketing/cta-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { LawyerCard } from "@/components/marketing/lawyer-card";
import { lawyers, PRACTICE_AREAS } from "@/lib/data/lawyers";

const practiceIcons: Record<string, React.ElementType> = {
  "Family Law": Users,
  "Employment Law": Briefcase,
  "Real Estate": Building2,
  "Intellectual Property": Lightbulb,
  "Criminal Defense": ShieldCheck,
  "Business & Contracts": Briefcase,
  Immigration: Plane,
  "Personal Injury": HeartPulse,
  "Estate Planning": Landmark,
  "Consumer Rights": Users,
};

const stats = [
  { value: "120+", label: "Verified lawyers" },
  { value: "4.9", label: "Average rating" },
  { value: "48hrs", label: "Median match time" },
  { value: "100%", label: "Plain-language advice" },
];

const steps = [
  {
    number: "01",
    title: "Describe your situation",
    description:
      "Tell us what happened in plain words — no legal jargon required. The AI assistant helps you sort the facts.",
  },
  {
    number: "02",
    title: "Match with verified lawyers",
    description:
      "Compare verified profiles, transparent hourly rates, and real client reviews side by side.",
  },
  {
    number: "03",
    title: "Consult and move forward",
    description:
      "Book a consultation, agree on scope and fees upfront, and work with someone who keeps you informed.",
  },
];

const testimonials = [
  {
    quote:
      "I understood my custody options for the first time before I ever opened a case. The plain-language guides did most of the heavy lifting.",
    name: "Hira S.",
    role: "Karachi",
  },
  {
    quote:
      "Compared six employment lawyers on rates and reviews in one afternoon. Fixed fee agreed before I paid anything.",
    name: "Adnan R.",
    role: "Lahore",
  },
  {
    quote:
      "The AI assistant didn't replace my lawyer — it made me a far more prepared client. Every question I brought to the consultation was sharp.",
    name: "Nadia T.",
    role: "Islamabad",
  },
];

const featuredLawyers = lawyers.slice(0, 3);

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy">
        <div className="bg-grid-navy pointer-events-none absolute inset-0" />
        <div className="absolute -right-32 -top-32 size-96 rounded-full bg-teal/30 blur-3xl" />
        <div className="absolute -bottom-40 left-1/4 size-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10 lg:px-8 lg:py-28">
          <div>
            <Badge className="border-white/15 bg-white/10 text-white">
              <Sparkles className="!size-3 text-gold" />
              Development preview
            </Badge>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Legal help, minus the{" "}
              <span className="text-gold">guesswork</span>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              LegalEase connects you with verified lawyers, plain-language legal
              resources, and an AI assistant that explains your rights — so you
              can decide what to do next with real clarity.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="w-full bg-gold text-navy-dark hover:bg-gold/90 sm:w-auto"
              >
                <Link href="/lawyers">
                  Find a lawyer
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <Link href="/ai-assistant">
                  <MessageSquareText />
                  Try the AI assistant
                </Link>
              </Button>
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-heading text-2xl font-bold text-white">
                    {stat.value}
                  </dd>
                  <dd className="mt-1 text-xs text-white/55">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Hero product card */}
          <div className="relative">
            <Card className="relative z-10 gap-4 bg-white/95 shadow-2xl shadow-navy-dark/40 ring-white/20 backdrop-blur">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-teal-soft text-teal">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-navy">
                      LegalEase Assistant
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Understands your situation in plain English
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-navy px-4 py-3 text-sm text-white">
                    My landlord refuses to return my security deposit. What
                    should I do first?
                  </div>
                  <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">
                    Start by sending a written demand letter that documents the
                    amount, dates, and your right to the deposit. Keep the
                    contract and messages — these are the evidence consumer
                    courts weigh first.
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className="bg-teal-soft text-teal">
                        2 templates found
                      </Badge>
                      <Badge variant="outline" className="text-navy">
                        3 nearby lawyers
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-teal" />
                    Not a substitute for legal advice
                  </span>
                  <Link
                    href="/ai-assistant"
                    className="font-medium text-teal hover:text-navy"
                  >
                    Open preview →
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="absolute -right-3 -bottom-8 hidden w-56 gap-3 p-4 shadow-xl ring-gold/30 sm:block lg:-right-10">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-navy to-teal font-heading text-xs font-bold text-white">
                    AR
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-bold text-navy">
                      Amara Rahman
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Family Law · Karachi
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-medium text-foreground">
                    <Star className="size-3.5 fill-gold text-gold" />
                    4.9
                  </span>
                  <span className="text-muted-foreground">Available today</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works preview */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From question to consultation in three steps"
          description="A deliberate, transparent process built to remove the uncertainty that keeps people from seeking legal help."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="gap-3 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5"
            >
              <CardContent className="space-y-3 p-6">
                <span className="font-heading text-3xl font-bold text-gold/80">
                  {step.number}
                </span>
                <h3 className="font-heading text-lg font-bold text-navy">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline" className="text-navy">
            <Link href="/how-it-works">
              See the full process
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Practice areas */}
      <section className="border-y border-border bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Find a specialist"
            title="Browse lawyers by practice area"
            description="Every profile shows transparent rates, verified credentials, and real reviews — before you ever book a call."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
            {PRACTICE_AREAS.map((area) => {
              const Icon = practiceIcons[area];
              return (
                <Link
                  key={area}
                  href="/lawyers"
                  className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-lg hover:shadow-navy/5 sm:p-5"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-navy/5 text-navy transition-colors group-hover:bg-teal-soft group-hover:text-teal">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-heading text-sm font-bold leading-snug text-navy">
                    {area}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured lawyers */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured lawyers"
          title="Professionals you can verify at a glance"
          description="Sample profiles for development — real listings will be populated from Supabase in a later milestone."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featuredLawyers.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild className="text-primary-foreground">
            <Link href="/lawyers">
              View all lawyers
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>

      {/* AI assistant panel */}
      <section className="border-y border-border bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <div>
            <Badge className="border-teal/30 bg-teal-soft text-teal">
              <Sparkles className="!size-3" />
              AI Legal Assistant
            </Badge>
            <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Understand your rights before you spend a rupee
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              The assistant turns confusing situations into a clear picture: what
              applies to you, what evidence matters, what the next step looks
              like — and when you genuinely need a lawyer.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Explains concepts in plain language, not legal jargon",
                "Suggests documents and evidence to gather first",
                "Points you to the right practice area and nearby lawyers",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-teal-soft text-teal">
                    <ShieldCheck className="size-3" />
                  </span>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-teal text-white hover:bg-teal/90">
                <Link href="/ai-assistant">
                  Open the preview
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="text-muted-foreground">
                <Link href="/how-it-works">How we vet lawyers</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-teal/30 bg-teal-soft/50 p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal">
                <Sparkles className="size-3.5" />
                Sample conversation
              </div>
              {[
                {
                  who: "you",
                  text: "Can my employer withhold my final salary if I leave without notice?",
                },
                {
                  who: "assistant",
                  text: "Notice periods cut both ways. Unless your contract explicitly allows deduction for unworked notice, withholding full salary is generally not permitted. Check the clause first — then document hours and dates.",
                },
                {
                  who: "assistant",
                  text: "Next step: gather your contract, payslips, and resignation email. Employment lawyers in our directory handle this frequently.",
                },
              ].map((message, index) => (
                <div
                  key={index}
                  className={
                    message.who === "you"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-navy px-4 py-3 text-sm text-white"
                      : "max-w-[90%] rounded-2xl rounded-bl-sm border border-teal/20 bg-white px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm"
                  }
                >
                  {message.text}
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-teal/20 pt-4 text-xs text-muted-foreground">
              Preview only — responses are illustrative samples, not live AI
              output.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why people come back"
          title="Clarity is the real deliverable"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="gap-4">
              <CardContent className="space-y-4 p-6">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/80">
                  “{testimonial.quote}”
                </blockquote>
                <div className="text-xs text-muted-foreground">
                  <span className="font-heading font-bold text-navy">
                    {testimonial.name}
                  </span>
                  {" · "}
                  {testimonial.role}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}