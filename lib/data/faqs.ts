export interface Faq {
  category: string;
  items: { question: string; answer: string }[];
}

export const faqs: Faq[] = [
  {
    category: "Finding a lawyer",
    items: [
      {
        question: "How does LegalEase vet the lawyers on its directory?",
        answer:
          "Every profile we feature is independently verified against bar records before it appears. We confirm enrollment, disciplinary standing, and years of practice, then re-check periodically. In this development preview the profiles are sample data, but the verification flow will run live once the platform connects to its database.",
      },
      {
        question: "How much does it cost to browse lawyer profiles?",
        answer:
          "Browsing the directory is completely free. Lawyers display transparent hourly rates and, where available, fixed-fee packages, so you can compare costs before booking a consultation.",
      },
      {
        question: "Can I switch lawyers after booking a consultation?",
        answer:
          "Yes. A consultation is an introductory conversation, not a commitment. If the fit isn't right, search again and book with someone else — there's no lock-in.",
      },
    ],
  },
  {
    category: "The AI assistant",
    items: [
      {
        question: "Is the AI assistant a substitute for legal advice?",
        answer:
          "No. The assistant helps you understand the law, prepare documents, and frame the right questions — but it is not a lawyer and cannot replace professional advice. For anything case-specific, we'll point you to a verified lawyer.",
      },
      {
        question: "What sort of questions can I ask it?",
        answer:
          "General questions like 'What should I do if my landlord refuses to return a deposit?' or 'How does the consumer complaint process work?' It explains your rights in plain language and suggests next steps.",
      },
      {
        question: "Is my conversation private?",
        answer:
          "We treat your conversations confidentially and never sell your data. In production, conversations will be protected by the same access controls as your account.",
      },
    ],
  },
  {
    category: "Accounts & privacy",
    items: [
      {
        question: "How do I create an account?",
        answer:
          "Sign up with your email address on the sign-up page. In this preview, the buttons are placeholders — full authentication will be wired up to Supabase in an upcoming milestone.",
      },
      {
        question: "What information does LegalEase store about me?",
        answer:
          "Only what's needed to serve you: your account details, conversations with the assistant, and records of consultations. We never sell personal data. Full details will be available in our privacy policy once authentication goes live.",
      },
      {
        question: "Can I delete my data?",
        answer:
          "Yes. You'll be able to request account deletion from your profile settings once accounts are live, and we'll erase your data within the legally required window.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        question: "How are consultations billed?",
        answer:
          "Each lawyer sets their own transparent hourly rate or fixed fee, shown on their profile before you book. Payments for consultations are processed securely and explained upfront — no surprise invoices.",
      },
      {
        question: "Do you support free consultations?",
        answer:
          "Many lawyers on the platform choose to offer a free initial consultation. Profiles clearly mark when free consultations are available.",
      },
    ],
  },
];

export const faqCategories = faqs.map((faq) => faq.category);