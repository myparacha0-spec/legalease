"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LawyerCard } from "@/components/marketing/lawyer-card";
import {
  CITIES,
  lawyers,
  PRACTICE_AREAS,
  type City,
  type PracticeArea,
} from "@/lib/data/lawyers";

type SortKey = "rating" | "cheapest" | "experience";

export function LawyerDirectory() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState<PracticeArea | "all">("all");
  const [city, setCity] = useState<City | "all">("all");
  const [sort, setSort] = useState<SortKey>("rating");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = lawyers.filter((lawyer) => {
      const matchesQuery =
        !normalized ||
        [lawyer.name, lawyer.title, ...lawyer.practiceAreas]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesArea = area === "all" || lawyer.practiceAreas.includes(area);
      const matchesCity = city === "all" || lawyer.city === city;
      return matchesQuery && matchesArea && matchesCity;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "cheapest") return a.hourlyRate - b.hourlyRate;
      return b.experienceYears - a.experienceYears;
    });
  }, [query, area, city, sort]);

  return (
    <div>
      <div className="grid gap-4 rounded-2xl border border-border bg-white p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
        <div className="sm:col-span-2">
          <Label htmlFor="search" className="sr-only">
            Search lawyers
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Search by name, title, or practice area…"
              className="pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="area" className="sr-only">
            Practice area
          </Label>
          <Select
            value={area}
            onValueChange={(value) => setArea(value as PracticeArea | "all")}
          >
            <SelectTrigger id="area" className="w-full">
              <SelectValue placeholder="Practice area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All practice areas</SelectItem>
              {PRACTICE_AREAS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city" className="sr-only">
            City
          </Label>
          <Select
            value={city}
            onValueChange={(value) => setCity(value as City | "all")}
          >
            <SelectTrigger id="city" className="w-full">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {CITIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <p className="text-sm text-muted-foreground">
          {results.length} of {lawyers.length} lawyers match
          <span className="ml-2 rounded-md bg-gold-soft px-2 py-0.5 text-xs font-medium text-navy">
            Sample data
          </span>
        </p>
        <Select
          value={sort}
          onValueChange={(value) => setSort(value as SortKey)}
        >
          <SelectTrigger
            id="sort"
            aria-label="Sort lawyers"
            className="w-full sm:w-52"
          >
            <ArrowUpDown className="!size-4 text-muted-foreground" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest rated</SelectItem>
            <SelectItem value="cheapest">Lowest hourly rate</SelectItem>
            <SelectItem value="experience">Most experienced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((lawyer) => (
            <LawyerCard key={lawyer.id} lawyer={lawyer} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="font-heading text-lg font-bold text-navy">
            No lawyers match those filters yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Try widening the search or clearing a filter. The full directory
            will be populated from Supabase in a later milestone.
          </p>
        </div>
      )}
    </div>
  );
}