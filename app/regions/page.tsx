"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import FloatingNavbar from "../components/FloatingNavbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import type { Region } from "@/lib/db/schema";
import { useRegions } from "@/lib/hooks/useRegions";
import Image from "next/image";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "population-asc"
  | "population-desc";

type SortConfig = {
  field: keyof Region;
  order: "asc" | "desc";
  compareFn: (a: Region, b: Region, order: "asc" | "desc") => number;
};

const SORT_STRATEGIES: Record<SortOption, SortConfig> = {
  "name-asc": {
    field: "name",
    order: "asc",
    compareFn: (a, b, order) => {
      const result = a.name.localeCompare(b.name);
      return order === "asc" ? result : -result;
    },
  },
  "name-desc": {
    field: "name",
    order: "desc",
    compareFn: (a, b, order) => {
      const result = a.name.localeCompare(b.name);
      return order === "asc" ? result : -result;
    },
  },
  "population-asc": {
    field: "population",
    order: "asc",
    compareFn: (a, b, order) => {
      const valA = a.population ?? 0;
      const valB = b.population ?? 0;
      return order === "asc" ? valA - valB : valB - valA;
    },
  },
  "population-desc": {
    field: "population",
    order: "desc",
    compareFn: (a, b, order) => {
      const valA = a.population ?? 0;
      const valB = b.population ?? 0;
      return order === "asc" ? valA - valB : valB - valA;
    },
  },
};

const filterRegionsBySearch = (regions: Region[], query: string): Region[] => {
  if (!query.trim()) return regions;

  const normalizedQuery = query.toLowerCase();
  return regions.filter(
    (region) =>
      region.name.toLowerCase().includes(normalizedQuery) ||
      region.code.toLowerCase().includes(normalizedQuery) ||
      region.description?.toLowerCase().includes(normalizedQuery)
  );
};

const sortRegions = (regions: Region[], sortOption: SortOption): Region[] => {
  const strategy = SORT_STRATEGIES[sortOption];
  return [...regions].sort((a, b) => strategy.compareFn(a, b, strategy.order));
};

export default function RegionsListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [visibleCount, setVisibleCount] = useState(12); // Show 12 initially

  const { data: regions = [], isLoading, error } = useRegions();

  if (error) {
    toast.error("Failed to load regions");
  }

  const filteredRegions = useMemo(() => {
    const filtered = filterRegionsBySearch(regions, searchQuery);
    return sortRegions(filtered, sortBy);
  }, [regions, searchQuery, sortBy]);

  // Only show first N regions for performance
  const visibleRegions = useMemo(
    () => filteredRegions.slice(0, visibleCount),
    [filteredRegions, visibleCount]
  );

  const hasMore = visibleCount < filteredRegions.length;

  // Intersection observer for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 12, filteredRegions.length));
  }, [filteredRegions.length]);

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loadMore]);

  if (isLoading) {
    return (
      <>
        <FloatingNavbar />
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 pt-32">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Loading regions...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <FloatingNavbar />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 pt-32">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Explore Regions</h1>
            <p className="mt-2 text-muted-foreground">
              Browse all {regions.length} regions of Macedonia and learn more
              about each one
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search regions by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={sortBy}
              onValueChange={(value: typeof sortBy) => setSortBy(value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="population-asc">
                  Population (Low-High)
                </SelectItem>
                <SelectItem value="population-desc">
                  Population (High-Low)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Found {filteredRegions.length} region
            {filteredRegions.length !== 1 ? "s" : ""} (showing{" "}
            {visibleRegions.length})
          </div>
        )}

        {/* Regions Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleRegions.map((region) => {
            // Get first image from images array or fallback to single image field
            const firstImage = region.images && region.images.length > 0 
              ? region.images[0] 
              : region.image || "/images/mkd.png";
            
            return (
              <Card
                key={region.id}
                className="group cursor-pointer transition-all hover:shadow-lg"
                onClick={() => router.push(`/regions/${region.code}`)}
              >
                <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-muted">
                  <Image
                    src={firstImage}
                    alt={region.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{region.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {region.code}
                    </Badge>
                  </div>
                  {region.population && (
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Pop: {region.population.toLocaleString()}
                    </CardDescription>
                  )}
                </CardHeader>
                {region.description && (
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {region.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Load more trigger */}
        {hasMore && (
          <div ref={observerTarget} className="flex justify-center py-8">
            <Button variant="outline" onClick={loadMore}>
              Load More ({filteredRegions.length - visibleCount} remaining)
            </Button>
          </div>
        )}

        {/* Empty state */}
        {filteredRegions.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">
                No regions found matching &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Clear search
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
}
