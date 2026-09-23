import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy-dark to-teal px-6 py-16 sm:px-12 lg:px-16">
        <div className="bg-grid-navy pointer-events-none absolute inset-0" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-teal/30 blur-3xl" />
        <div className="relative text-center">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get your next legal question answered today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
            Browse verified lawyers, read plain-language resources, or ask the
            AI assistant where to start — free.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full bg-gold text-navy-dark hover:bg-gold/90 sm:w-auto"
            >
              <Link href="/signup">
                Create a free account
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <Link href="/lawyers">Browse lawyers</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}