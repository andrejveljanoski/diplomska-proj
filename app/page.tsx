"use client";

import { useState, useCallback, useMemo } from "react";
import MacedoniaMap from "./components/MacedoniaMap";
import FloatingNavbar from "./components/FloatingNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Total regions in North Macedonia
const TOTAL_REGIONS = 80;

export default function Home() {
  const [visitedRegions, setVisitedRegions] = useState<Set<string>>(
    () => new Set()
  );

  // Memoize the visited regions set for stable reference
  const memoizedVisitedRegions = useMemo(
    () => visitedRegions,
    [visitedRegions]
  );

  const visitedCount = memoizedVisitedRegions.size;
  const progressPercent = (visitedCount / TOTAL_REGIONS) * 100;

  // Handle region toggle from map click
  const handleRegionToggle = useCallback(
    (regionId: string, isVisited: boolean) => {
      setVisitedRegions((prev) => {
        const next = new Set(prev);
        if (isVisited) {
          next.add(regionId);
        } else {
          next.delete(regionId);
        }
        return next;
      });
    },
    []
  );

  // TODO: Implement these
  const handleShare = () => {
    console.log("Share map - to be implemented");
  };

  const handleSave = () => {
    console.log("Save progress - to be implemented");
  };

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
        <Card className="w-full overflow-hidden">
          <CardContent className="p-0">
            <MacedoniaMap
              visitedRegions={memoizedVisitedRegions}
              onRegionToggle={handleRegionToggle}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="w-full">
          <CardContent className="flex justify-center gap-4 p-4">
            <Button variant="outline" size="sm" onClick={handleShare}>
              Share Map
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Progress
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
