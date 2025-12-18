"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import MacedoniaMap from "./components/MacedoniaMap";
import FloatingNavbar from "./components/FloatingNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { Region } from "@/lib/db/schema";

// Total regions in Macedonia
const TOTAL_REGIONS = 71;

export default function Home() {
  const { data: session, status } = useSession();
  const userKey = session?.user?.email ?? session?.user?.name ?? null;

  // Initialize visited regions from sessionStorage if available
  const [visitedRegions, setVisitedRegions] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const stored = sessionStorage.getItem("visitedRegions");
    if (stored) {
      try {
        return new Set(JSON.parse(stored));
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  // Simple dirty flag: true when user made changes since last save/load
  const [isDirty, setIsDirty] = useState(false);

  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoadingVisits, setIsLoadingVisits] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const visitsLoadInFlightRef = useRef(false);
  const hasLoadedFromServerRef = useRef(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("/api/regions");
        if (!response.ok) throw new Error("Failed to fetch regions");
        const data: Region[] = await response.json();
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
        toast.error("Failed to load regions");
      }
    };

    fetchRegions();
  }, []);

  // Sync visitedRegions to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "visitedRegions",
        JSON.stringify(Array.from(visitedRegions))
      );
    }
  }, [visitedRegions]);

  // Load saved visited regions from server ONCE per session (if not already loaded)
  useEffect(() => {
    if (status === "unauthenticated") {
      setVisitedRegions(new Set());
      setIsDirty(false);
      setIsLoadingVisits(false);
      visitsLoadInFlightRef.current = false;
      hasLoadedFromServerRef.current = false;
      sessionStorage.removeItem("visitedRegions");
      return;
    }

    if (status !== "authenticated" || !userKey) return;
    if (visitsLoadInFlightRef.current || hasLoadedFromServerRef.current) return;

    const controller = new AbortController();
    visitsLoadInFlightRef.current = true;
    setIsLoadingVisits(true);

    (async () => {
      try {
        const response = await fetch("/api/user-visits", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (response.ok) {
          const visits = await response.json();
          const visitedSet = new Set<string>(
            visits.map((v: { regionCode: string }) => v.regionCode)
          );
          setVisitedRegions(visitedSet);
          setIsDirty(false);
          hasLoadedFromServerRef.current = true;
          toast.success("Progress loaded successfully", {
            id: `progress-loaded-${userKey}`,
          });
        } else if (response.status === 401) {
          toast.error("Please log in to save your progress");
        }
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") {
          console.error("Error loading user visits:", error);
          toast.error("Failed to load saved progress");
        }
      } finally {
        setIsLoadingVisits(false);
        visitsLoadInFlightRef.current = false;
      }
    })();

    return () => {
      controller.abort();
    };
  }, [status, userKey]);

  // Memoize the visited regions set for stable reference
  const memoizedVisitedRegions = useMemo(
    () => visitedRegions,
    [visitedRegions]
  );

  const visitedCount = memoizedVisitedRegions.size;
  const progressPercent = (visitedCount / TOTAL_REGIONS) * 100;

  // Handle region toggle from map click
  const handleRegionToggle = useCallback(
    (regionCode: string, isVisited: boolean) => {
      setVisitedRegions((prev) => {
        const next = new Set(prev);
        if (isVisited) {
          next.add(regionCode);
        } else {
          next.delete(regionCode);
        }
        return next;
      });
      // mark as dirty whenever the user changes a region
      setIsDirty(true);
    },
    []
  );

  // Share map
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  // Save progress
  const handleSave = async () => {
    if (!session?.user) {
      toast.error("Please log in to save your progress");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/user-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitedRegionCodes: Array.from(visitedRegions),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      const result = await response.json();
      toast.success(
        `Progress saved! (${result.added} added, ${result.removed} removed)`
      );
      // saved successfully -> no unsaved changes
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Failed to save progress");
    } finally {
      setIsSaving(false);
    }
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
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || !session?.user || !isDirty}
            >
              {isSaving ? "Saving..." : "Save Progress"}
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
