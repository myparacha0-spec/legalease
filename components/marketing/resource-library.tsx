"use client";

import { useState } from "react";
import { BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  resourceCategories,
  resources,
  type ResourceCategory,
} from "@/lib/data/resources";

export function ResourceLibrary() {
  const [category, setCategory] = useState<ResourceCategory | "All">("All");

  const visible =
    category === "All"
      ? resources
      : resources.filter((resource) => resource.category === category);

  return (
    <div>
      <Tabs value={category} onValueChange={(value) => setCategory(value as ResourceCategory | "All")}>
        <TabsList className="w-fit flex-wrap">
          <TabsTrigger value="All">All</TabsTrigger>
          {resourceCategories.map((item) => (
            <TabsTrigger key={item} value={item}>
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((resource) => (
          <Card
            key={resource.id}
            className="gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5"
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between gap-2">
                <Badge className="bg-teal-soft text-teal">
                  {resource.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {resource.updated}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold leading-snug text-navy">
                {resource.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {resource.summary}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-3.5" />
                  {resource.readingTime}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Sample content
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className="font-heading text-lg font-bold text-navy">
            No resources in this category yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            More guides are being written. In the meantime, ask the AI assistant
            or explore the lawyer directory.
          </p>
        </div>
      )}
    </div>
  );
}