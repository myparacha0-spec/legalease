import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { LawyerDirectory } from "@/components/marketing/lawyer-directory";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Find a lawyer",
  description:
    "Browse verified lawyers by practice area, city, and budget. Transparent rates and real reviews before you book.",
};

export default function LawyersPage() {
  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Badge className="border-teal/30 bg-teal-soft text-teal">
              Lawyer directory
            </Badge>
            <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Find a lawyer who fits your situation.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Search verified professionals by practice area and city, compare
              transparent rates and genuine reviews, then book a consultation
              with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <LawyerDirectory />
      </section>

      <CtaSection />
    </>
  );
}