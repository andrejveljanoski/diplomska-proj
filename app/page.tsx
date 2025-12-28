"use client";

import { useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import MacedoniaMap from "./components/MacedoniaMap";
import FloatingNavbar from "./components/FloatingNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  useRegions,
  useUserVisits,
  useSaveUserVisits,
} from "@/lib/hooks/useRegions";

// Total regions in Macedonia
const TOTAL_REGIONS = 71;

export default function Home() {
  const { data: session, status } = useSession();

  // Fetch regions and user visits using React Query
  const { data: regions = [] } = useRegions();
  const { data: serverVisits = [], isLoading: isLoadingVisits } = useUserVisits(
    status === "authenticated"
  );

  // Save mutation
  const saveVisitsMutation = useSaveUserVisits();

  // Derive server visited set
  const serverVisitedSet = useMemo(
    () => new Set<string>(serverVisits.map((v) => v.regionCode)),
    [serverVisits]
  );

  // Local state for visited regions - allows editing before save
  const [localVisitedRegions, setLocalVisitedRegions] = useState<Set<string>>(
    () => serverVisitedSet
  );

  // Track if user has made local changes
  const [isDirty, setIsDirty] = useState(false);

  // Use local state when dirty, server state when clean
  const memoizedVisitedRegions = useMemo(
    () => (isDirty ? localVisitedRegions : serverVisitedSet),
    [isDirty, localVisitedRegions, serverVisitedSet]
  );

  const visitedCount = memoizedVisitedRegions.size;
  const progressPercent = (visitedCount / TOTAL_REGIONS) * 100;

  // Handle region toggle from map click
  const handleRegionToggle = useCallback(
    (regionCode: string, isVisited: boolean) => {
      setLocalVisitedRegions((prev) => {
        const next = new Set(prev);
        if (isVisited) {
          next.add(regionCode);
        } else {
          next.delete(regionCode);
        }
        return next;
      });
      setIsDirty(true);
    },
    []
  );

  // Handle share
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const text = `I've explored ${visitedCount} out of ${TOTAL_REGIONS} regions in Macedonia! (${progressPercent.toFixed(
      1
    )}%)`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Macedonia Map Progress",
          text,
          url,
        });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if ((error as { name?: string }).name !== "AbortError") {
        console.error("Error sharing:", error);
        toast.error("Failed to share");
      }
    }
  }, [visitedCount, progressPercent]);

  return (
    <>
      <FloatingNavbar />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 pt-32">
        {/* Stats Row */}
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <article>
                <h1 className="text-3xl font-bold">Macedonia</h1>
                <p className="text-sm font-normal text-muted-foreground">
                  Click on a region to mark it as visited
                </p>
              </article>
              <aside className="flex items-center gap-4">
                <figure className="flex flex-col items-end">
                  <Badge variant="secondary" className="mb-1">
                    {visitedCount} / {TOTAL_REGIONS} regions
                  </Badge>
                  <Progress value={progressPercent} className="h-2 w-32" />
                  <figcaption className="mt-1 text-xs text-muted-foreground">
                    {progressPercent.toFixed(1)}% explored
                  </figcaption>
                </figure>
              </aside>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Map */}
        <Card className="w-full">
          <CardContent className="p-0">
            <div className="relative">
              <MacedoniaMap
                visitedRegions={memoizedVisitedRegions}
                onRegionToggle={handleRegionToggle}
                regions={regions}
              />
              {isLoadingVisits && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <p className="text-muted-foreground">
                    Loading your progress...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="w-full">
          <CardContent className="flex justify-center gap-4 p-4">
            <Button variant="outline" size="sm" onClick={handleShare}>
              Share Map
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
