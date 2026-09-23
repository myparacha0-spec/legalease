import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/logo";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/lawyers", label: "Find a lawyer" },
      { href: "/ai-assistant", label: "AI assistant" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/resources", label: "Legal resources" },
      { href: "/faq", label: "FAQ" },
      { href: "/about", label: "About us" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/signup", label: "Sign up" },
      { href: "/forgot-password", label: "Forgot password" },
    ],
  },
];

const contactDetails = [
  { icon: MapPin, label: "Clifton, Karachi, Pakistan" },
  { icon: Phone, label: "+92 300 000 0000" },
  { icon: Mail, label: "hello@legalease.com" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-transparent bg-navy text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-5">
            <Logo variant="light" />
            <p className="text-sm leading-relaxed text-white/65">
              Modern legal help without the runaround. Verified lawyers,
              plain-language guidance, and an AI assistant built to demystify
              the law.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/65">
              {contactDetails.map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-heading text-sm font-bold uppercase tracking-widest text-gold">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>
            © {new Date().getFullYear()} LegalEase. For development preview
            only.
          </p>
          <p className="inline-flex items-center gap-1.5">
            Built with Next.js · Powered by Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}