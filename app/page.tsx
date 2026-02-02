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

  // Handle save
  const handleSave = useCallback(async () => {
    if (!session?.user) {
      toast.error("Please log in to save your progress");
      return;
    }

    saveVisitsMutation.mutate(
      {
        visitedRegionCodes: Array.from(localVisitedRegions),
      },
      {
        onSuccess: () => {
          setIsDirty(false);
          toast.success("Progress saved successfully!");
          // No need to refetch - React Query auto-updates cache from mutation
        },
        onError: () => {
          toast.error("Failed to save progress");
        },
      }
    );
  }, [session, localVisitedRegions, saveVisitsMutation]);

  return (
    <>
      <FloatingNavbar />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-3 pt-20 pb-6 sm:gap-4 sm:px-4 sm:pt-24 md:gap-6 md:px-6 md:pt-32">
        {/* Stats Row */}
        <Card className="w-full">
          <CardHeader className="p-3 pb-2 sm:p-4 sm:pb-2 md:p-6 md:pb-2">
            <CardTitle className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
              <article className="text-center md:text-left">
                <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Macedonia</h1>
                <p className="text-xs font-normal text-muted-foreground sm:text-sm">
                  Click on a region to mark it as visited
                </p>
              </article>
              <aside className="flex items-center justify-center gap-4 md:justify-end">
                <figure className="flex flex-col items-center md:items-end">
                  <Badge variant="secondary" className="mb-1 text-xs sm:text-sm">
                    {visitedCount} / {TOTAL_REGIONS} regions
                  </Badge>
                  <Progress value={progressPercent} className="h-2 w-28 sm:w-32" />
                  <figcaption className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                    {progressPercent.toFixed(1)}% explored
                  </figcaption>
                </figure>
              </aside>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Map */}
        <Card className="w-full overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-auto">
              <MacedoniaMap
                visitedRegions={memoizedVisitedRegions}
                onRegionToggle={handleRegionToggle}
                regions={regions}
              />
              {isLoadingVisits && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <p className="text-sm text-muted-foreground sm:text-base">
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
            {!session?.user ? (
              <Button
                size="sm"
                onClick={() => window.location.href = "/login"}
              >
                Login to Save Progress
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saveVisitsMutation.isPending || !isDirty}
              >
                {saveVisitsMutation.isPending ? "Saving..." : "Save Progress"}
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
