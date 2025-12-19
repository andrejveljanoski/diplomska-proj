"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import type { Region } from "@/lib/db/schema";

export default function RegionsListPage() {
  const router = useRouter();
  const [regions, setRegions] = useState<Region[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("/api/regions");
        if (!response.ok) throw new Error("Failed to fetch regions");
        const data: Region[] = await response.json();
        setRegions(data);
        setFilteredRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
        toast.error("Failed to load regions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRegions(regions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = regions.filter(
      (region) =>
        region.name.toLowerCase().includes(query) ||
        region.code.toLowerCase().includes(query) ||
        region.description?.toLowerCase().includes(query)
    );
    setFilteredRegions(filtered);
  }, [searchQuery, regions]);

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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search regions by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results count */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Found {filteredRegions.length} region
            {filteredRegions.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Regions Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRegions.map((region) => (
            <Card
              key={region.id}
              className="group cursor-pointer transition-all hover:shadow-lg"
              onClick={() => router.push(`/regions/${region.code}`)}
            >
              {region.image && (
                <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-muted">
                  {/* <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  /> */}
                </div>
              )}
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
          ))}
        </div>

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
