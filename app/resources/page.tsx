import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ResourceLibrary } from "@/components/marketing/resource-library";
import { CtaSection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Legal resources",
  description:
    "Plain-language guides on your rights, templates you can adapt, and resources to help you prepare before consulting a lawyer.",
};

export default function ResourcesPage() {
  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Badge className="border-teal/30 bg-teal-soft text-teal">
              Legal resources
            </Badge>
            <h1 className="mt-5 font-heading text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Know your rights, before you sign anything.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Plain-language guides and adaptable templates across the situations
              people face most — so you arrive at every conversation prepared.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <ResourceLibrary />
      </section>

      <CtaSection />
    </>
  );
}