export const PRACTICE_AREAS = [
  "Family Law",
  "Employment Law",
  "Real Estate",
  "Intellectual Property",
  "Criminal Defense",
  "Business & Contracts",
  "Immigration",
  "Personal Injury",
  "Estate Planning",
  "Consumer Rights",
] as const;

export const CITIES = ["Karachi", "Lahore", "Islamabad"] as const;

export type PracticeArea = (typeof PRACTICE_AREAS)[number];
export type City = (typeof CITIES)[number];

export interface Lawyer {
  id: string;
  name: string;
  title: string;
  practiceAreas: PracticeArea[];
  city: City;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  languages: string[];
  education: string;
  verified: boolean;
  availability: "Available" | "Booked 2 weeks" | "Accepting new clients";
  bio: string;
  approach: string;
  focus: string[];
}

export const lawyers: Lawyer[] = [
  {
    id: "amara-rahman",
    name: "Amara Rahman",
    title: "Partner, Family & Matrimonial Law",
    practiceAreas: ["Family Law", "Estate Planning"],
    city: "Karachi",
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 187,
    hourlyRate: 8500,
    languages: ["English", "Urdu"],
    education: "LL.B., University of Karachi — LL.M. in Family Law, University of London",
    verified: true,
    availability: "Accepting new clients",
    bio: "Amara has spent over a decade helping families navigate separation, custody, and inheritance with empathy and clarity. She is known for de-escalating conflict and prioritising the wellbeing of children in every settlement.",
    approach:
      "Amara works in plain language, agrees fixed-fee stages upfront, and makes sure you understand every option before signing anything.",
    focus: ["Divorce & Khula", "Child custody", "Inheritance disputes", "Prenuptial agreements"],
  },
  {
    id: "danish-siddiqui",
    name: "Danish Siddiqui",
    title: "Senior Associate, Employment Law",
    practiceAreas: ["Employment Law", "Business & Contracts"],
    city: "Lahore",
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 142,
    hourlyRate: 7000,
    languages: ["English", "Urdu", "Punjabi"],
    education: "LL.B., Punjab University — Bar Course, Lahore Bar Association",
    verified: true,
    availability: "Available",
    bio: "Danish advises employees and startups alike on contracts, terminations, and workplace disputes. He has recovered severance and unpaid dues for hundreds of workers.",
    approach:
      "Danish is direct and practical. He explores negotiation first, then escalates only when it serves your interests.",
    focus: ["Wrongful termination", "Employment contracts", "Severance negotiation", "Harassment claims"],
  },
  {
    id: "fatima-naqvi",
    name: "Fatima Naqvi",
    title: "Founding Partner, Intellectual Property",
    practiceAreas: ["Intellectual Property", "Business & Contracts"],
    city: "Islamabad",
    experienceYears: 12,
    rating: 5.0,
    reviewCount: 96,
    hourlyRate: 9500,
    languages: ["English", "Urdu"],
    education: "LL.B., Quaid-i-Azam University — Registered IP Attorney (PKIPO)",
    verified: true,
    availability: "Booked 2 weeks",
    bio: "Fatima protects brands, inventions, and creative work. She has registered trademarks for over 300 companies and litigates IP infringement with a rare combination of rigor and speed.",
    approach:
      "She treats IP as a business asset: registration, enforcement, and licensing planned around your commercial goals.",
    focus: ["Trademark registration", "Copyright disputes", "Patent strategy", "Brand enforcement"],
  },
  {
    id: "usman-tariq",
    name: "Usman Tariq",
    title: "Advocate, Criminal Defense",
    practiceAreas: ["Criminal Defense", "Consumer Rights"],
    city: "Karachi",
    experienceYears: 16,
    rating: 4.7,
    reviewCount: 231,
    hourlyRate: 8000,
    languages: ["English", "Urdu"],
    education: "LL.B., University of Sindh — Certificate in Forensic Law, Sindh Judicial Academy",
    verified: true,
    availability: "Available",
    bio: "Usman has defended clients in high-stakes criminal matters for sixteen years, with a special focus on bail, fair-trial rights, and wrongful accusations.",
    approach:
      "Calm under pressure and thorough with evidence, Usman keeps you informed at every stage and never over-promises outcomes.",
    focus: ["Bail applications", "Case strategy", "Pre-arrest protection", "Appeals"],
  },
  {
    id: "zara-imran",
    name: "Zara Imran",
    title: "Associate, Real Estate",
    practiceAreas: ["Real Estate", "Consumer Rights"],
    city: "Lahore",
    experienceYears: 7,
    rating: 4.8,
    reviewCount: 88,
    hourlyRate: 6000,
    languages: ["English", "Urdu"],
    education: "LL.B., Punjab University — Diploma in Property Law, Institute of Law",
    verified: true,
    availability: "Accepting new clients",
    bio: "Zara specialises in title verification, possession disputes, and builder-buyer agreements across Lahore's growing housing societies.",
    approach:
      "She protects buyers before they sign: verification, due diligence, and watertight agreements are her default.",
    focus: ["Title verification", "Historical searches", "Possession disputes", "Society compliance"],
  },
  {
    id: "omer-sheikh",
    name: "Omer Sheikh",
    title: "Principal, Business & Contracts",
    practiceAreas: ["Business & Contracts", "Employment Law"],
    city: "Islamabad",
    experienceYears: 11,
    rating: 4.9,
    reviewCount: 174,
    hourlyRate: 9000,
    languages: ["English", "Urdu"],
    education: "LL.B., Quaid-i-Azam University — MBA, LUMS",
    verified: true,
    availability: "Available",
    bio: "Half lawyer, half operator, Omer drafts and negotiates the agreements that keep startups, SaaS products, and SMEs running without surprises.",
    approach:
      "Commercial and pragmatic: he translates legalese into risk you can actually measure, and negotiates on your behalf as part of the engagement.",
    focus: ["Founder agreements", "Terms of service", "Partnerships", "Commercial negotiation"],
  },
  {
    id: "sana-malik",
    name: "Sana Malik",
    title: "Immigration Counsel",
    practiceAreas: ["Immigration"],
    city: "Karachi",
    experienceYears: 8,
    rating: 4.7,
    reviewCount: 121,
    hourlyRate: 7500,
    languages: ["English", "Urdu"],
    education: "LL.B., University of Karachi — Immigration Law Certification, IILS",
    verified: true,
    availability: "Accepting new clients",
    bio: "Sana guides families and professionals through visa, residency, and naturalisation processes, with a reputation for meticulous paperwork and honest timelines.",
    approach:
      "She prepares every application as if it will be scrutinised twice — because it will be.",
    focus: ["Work visas", "Family sponsorship", "Residency applications", "Appeals"],
  },
  {
    id: "ali-hassan",
    name: "Ali Hassan",
    title: "Counsel, Personal Injury",
    practiceAreas: ["Personal Injury", "Consumer Rights"],
    city: "Lahore",
    experienceYears: 6,
    rating: 4.6,
    reviewCount: 64,
    hourlyRate: 5500,
    languages: ["English", "Urdu"],
    education: "LL.B., Punjab University",
    verified: true,
    availability: "Available",
    bio: "Ali helps accident victims recover medical costs, wage loss, and compensation without being pushed through a system that favours insurers.",
    approach:
      "No win, no fee on most claims — and a settlement or trial strategy agreed with you before any step is taken.",
    focus: ["Road accident claims", "Medical negligence", "Insurance disputes", "Compensation"],
  },
  {
    id: "maria-khan",
    name: "Maria Khan",
    title: "Senior Associate, Estate Planning",
    practiceAreas: ["Estate Planning", "Family Law"],
    city: "Islamabad",
    experienceYears: 10,
    rating: 4.9,
    reviewCount: 152,
    hourlyRate: 8200,
    languages: ["English", "Urdu"],
    education: "LL.B., Quaid-i-Azam University — LL.M., University of Melbourne",
    verified: true,
    availability: "Booked 2 weeks",
    bio: "Maria helps families plan wills, trusts, and succession so that wealth passes smoothly and disputes are avoided — especially across borders.",
    approach:
      "Thorough, discreet, and empathetic, she works through scenarios with you before documents are ever drafted.",
    focus: ["Wills & wills registration", "Trust formation", "Succession planning", "Cross-border assets"],
  },
];

export const getLawyerById = (id: string): Lawyer | undefined =>
  lawyers.find((lawyer) => lawyer.id === id);

export const formatRate = (ratePerHour: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(ratePerHour);