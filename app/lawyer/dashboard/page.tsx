import type { Metadata } from "next";
import {
  BarChart3,
  CalendarClock,
  FolderOpen,
  Inbox,
  UserRoundCheck,
} from "lucide-react";
import { ProtectedDashboard } from "@/components/dashboard/protected-dashboard";

export const metadata: Metadata = {
  title: "Lawyer dashboard",
  description: "Your LegalEase lawyer dashboard.",
  robots: { index: false },
};

const comingSoon = [
  {
    icon: UserRoundCheck,
    title: "Public profile",
    description: "Manage how you appear to citizens, including your rates.",
  },
  {
    icon: Inbox,
    title: "Enquiry inbox",
    description: "Review consultation requests from verified citizens.",
  },
  {
    icon: CalendarClock,
    title: "Scheduling",
    description: "Approve time slots and keep your calendar in sync.",
  },
  {
    icon: FolderOpen,
    title: "Case documents",
    description: "Securely receive and store client files.",
  },
  {
    icon: BarChart3,
    title: "Practice insights",
    description: "See profile views, enquiries, and consultation trends.",
  },
];

export default function LawyerDashboardPage() {
  return (
    <ProtectedDashboard
      role="lawyer"
      heading="Lawyer dashboard"
      description="Your professional hub is on the way — profile, enquiries, scheduling, and client documents, all in one place."
      comingSoon={
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comingSoon.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-white p-4"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy">
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
      }
    />
  );
}