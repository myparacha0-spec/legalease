export type ResourceCategory =
  | "Know Your Rights"
  | "Guides"
  | "Templates"
  | "Financial";

export interface LegalResource {
  id: string;
  title: string;
  category: ResourceCategory;
  readingTime: string;
  summary: string;
  updated: string;
}

export const resources: LegalResource[] = [
  {
    id: "know-your-rights-detention",
    title: "Know Your Rights: Police Detention",
    category: "Know Your Rights",
    readingTime: "6 min read",
    summary:
      "What police can and cannot do when detaining you, what to say, and how to exercise your right to counsel from the first hour.",
    updated: "Updated 2026",
  },
  {
    id: "understand-an-employment-contract",
    title: "How to Read an Employment Contract",
    category: "Guides",
    readingTime: "9 min read",
    summary:
      "A plain-language walkthrough of clauses that matter: notice period, non-compete, confidentiality, and termination rights.",
    updated: "Updated 2026",
  },
  {
    id: "tenancy-agreement-checklist",
    title: "Tenancy Agreement Checklist",
    category: "Templates",
    readingTime: "4 min read",
    summary:
      "Five things to verify in every rental agreement, plus the clauses you should never agree to sign without changes.",
    updated: "Updated 2026",
  },
  {
    id: "consumer-complaint-process",
    title: "The Consumer Complaint Process, Explained",
    category: "Guides",
    readingTime: "7 min read",
    summary:
      "From the initial complaint to a hearing: how provincial consumer courts work and what evidence you should keep.",
    updated: "Updated 2026",
  },
  {
    id: "intellectual-property-basics",
    title: "Intellectual Property Basics for Creators",
    category: "Know Your Rights",
    readingTime: "8 min read",
    summary:
      "Trademarks, copyright, and design rights in plain language — what is automatically protected and what you need to register.",
    updated: "Updated 2026",
  },
  {
    id: "family-law-basics",
    title: "Family Law Basics: Custody and Support",
    category: "Guides",
    readingTime: "10 min read",
    summary:
      "A compassionate overview of custody arrangements, child support, and the documentation courts expect.",
    updated: "Updated 2026",
  },
  {
    id: "bail-understanding-process",
    title: "Understanding the Bail Process",
    category: "Know Your Rights",
    readingTime: "6 min read",
    summary:
      "Pre-arrest and post-arrest bail explained, including what factors courts weigh and how a lawyer builds the application.",
    updated: "Updated 2026",
  },
  {
    id: "debt-recovery-letter-template",
    title: "Demand Letter Template for Unpaid Debts",
    category: "Templates",
    readingTime: "3 min read",
    summary:
      "A ready-to-adapt formal demand letter that documents the claim before you escalate to a lawyer or court.",
    updated: "Updated 2026",
  },
  {
    id: "estate-planning-checklist",
    title: "First Steps to Estate Planning",
    category: "Templates",
    readingTime: "5 min read",
    summary:
      "Who needs a will, how to register one, and a checklist of assets and decisions to gather before meeting a planner.",
    updated: "Updated 2026",
  },
  {
    id: "legal-costs-budgeting",
    title: "Budgeting for Legal Fees Without Surprises",
    category: "Financial",
    readingTime: "5 min read",
    summary:
      "How consultation fees, retainers, and fixed-fee stages work — and the questions to ask before engaging a lawyer.",
    updated: "Updated 2026",
  },
];

export const resourceCategories: ResourceCategory[] = [
  "Know Your Rights",
  "Guides",
  "Templates",
  "Financial",
];