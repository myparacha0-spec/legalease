import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="bg-grid-light flex flex-1 items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-navy to-teal text-white shadow-lg">
          <Compass className="size-7" />
        </span>
        <p className="mt-6 font-heading text-sm font-bold uppercase tracking-widest text-gold">
          404
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-navy">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The page you&apos;re looking for may have moved, or the link was
          mistyped. Let&apos;s get you back to solid ground.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild className="mt-7">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Back home
            </Link>
          </Button>
        </div>
        <div className="mt-10 flex justify-center">
          <Logo />
        </div>
      </div>
    </div>
  );
}