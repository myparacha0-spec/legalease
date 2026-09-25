import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarClock, FileText, Heart, MessageSquareText, Scale } from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/protected-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Citizen dashboard",
  description: "Your LegalEase citizen dashboard.",
  robots: { index: false },
};

const comingSoon = [
  {
    icon: Heart,
    title: "Saved lawyers",
    description: "Build a shortlist of favourites to compare before you decide.",
  },
  {
    icon: CalendarClock,
    title: "Appointment requests",
    description: "Request and track consultations with the lawyers you pick.",
  },
  {
    icon: MessageSquareText,
    title: "AI assistant sessions",
    description: "Revisit past legal orientation conversations anytime.",
  },
  {
    icon: FileText,
    title: "Document preparation",
    description: "Upload and organise files before each consultation.",
  },
  {
    icon: BookOpenText,
    title: "Legal toolkit",
    description: "Plain-language resources matched to your situation.",
  },
];

export default function CitizenDashboardPage() {
  return (
    <>
      <ProtectedDashboard
        role="citizen"
        heading="Citizen dashboard"
        description="Everything for getting the right legal help is coming together here — saved lawyers, consultations, and your assistant conversations."
        comingSoon={
          <>
            <Link href="/citizen/ai-assistant" className="block">
              <Card className="group mb-6 overflow-hidden border-teal/30 bg-teal-soft/40 transition-colors hover:border-teal/60 hover:bg-teal-soft/70">
                <CardHeader className="border-b border-teal/20">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy text-gold">
                      <Scale className="size-5" />
                    </span>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        AI Legal Assistant
                        <Badge className="bg-navy text-gold" variant="secondary">
                          Live
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Ask about Pakistani law and get grounded answers with cited sources
                        from the verified LegalEase knowledge base.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-4 p-6">
                  <p className="text-sm text-muted-foreground">
                    Rent, family, criminal, contracts and more — start with a question:
                    &ldquo;Can my landlord increase my rent without notice?&rdquo;
                  </p>
                  <Button asChild className="shrink-0 group-hover:bg-teal group-hover:text-white">
                    <span className="inline-flex items-center gap-2">
                      Start a conversation
                      <ArrowRight data-icon="inline-end" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {comingSoon.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="flex items-start gap-3 rounded-xl border border-border/70 bg-white p-4"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-soft text-teal">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-navy">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        }
      />
    </>
  );
}