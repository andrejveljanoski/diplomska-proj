import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Region } from "@/lib/db/schema";

// Query Keys
export const regionKeys = {
  all: ["regions"] as const,
  lists: () => [...regionKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...regionKeys.lists(), filters] as const,
  details: () => [...regionKeys.all, "detail"] as const,
  detail: (code: string) => [...regionKeys.details(), code] as const,
};

export const userVisitKeys = {
  all: ["user-visits"] as const,
  lists: () => [...userVisitKeys.all, "list"] as const,
  list: (userId?: string) => [...userVisitKeys.lists(), userId] as const,
};

// Fetch functions
async function fetchRegions(): Promise<Region[]> {
  const response = await fetch("/api/regions");
  if (!response.ok) throw new Error("Failed to fetch regions");
  return response.json();
}

async function fetchRegionByCode(code: string): Promise<Region> {
  const response = await fetch(`/api/regions/${code}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to fetch region");
  }
  return response.json();
}

interface UserVisit {
  regionCode: string;
  regionName: string;
  visitedAt: string;
}

async function fetchUserVisits(): Promise<UserVisit[]> {
  const response = await fetch("/api/user-visits", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch user visits");
  return response.json();
}

interface SaveVisitsParams {
  visitedRegionCodes: string[];
}

async function saveUserVisits(params: SaveVisitsParams) {
  const response = await fetch("/api/user-visits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) throw new Error("Failed to save visits");
  return response.json();
}

// Hooks
export function useRegions() {
  return useQuery({
    queryKey: regionKeys.lists(),
    queryFn: fetchRegions,
    staleTime: Infinity, // Regions rarely change, cache indefinitely
  });
}

export function useRegion(code: string, enabled = true) {
  return useQuery({
    queryKey: regionKeys.detail(code),
    queryFn: () => fetchRegionByCode(code),
    enabled: enabled && !!code,
  });
}

export function useUserVisits(enabled = true) {
  return useQuery({
    queryKey: userVisitKeys.lists(),
    queryFn: fetchUserVisits,
    enabled,
  });
}

export function useSaveUserVisits() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveUserVisits,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userVisitKeys.lists() });

      // Snapshot previous value
      const previousVisits = queryClient.getQueryData<UserVisit[]>(
        userVisitKeys.lists()
      );

      // Optimistically update cache with new visits
      queryClient.setQueryData<UserVisit[]>(userVisitKeys.lists(), () => {
        return variables.visitedRegionCodes.map((code) => ({
          regionCode: code,
          regionName: "",
          visitedAt: new Date().toISOString(),
        }));
      });

      return { previousVisits };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousVisits) {
        queryClient.setQueryData(userVisitKeys.lists(), context.previousVisits);
      }
    },
    onSuccess: () => {
      // Refetch to get accurate data from server
      queryClient.invalidateQueries({ queryKey: userVisitKeys.all });
    },
  });
}

export function useToggleRegionVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      regionCode,
      isVisited,
    }: {
      regionCode: string;
      isVisited: boolean;
    }) => {
      // Get current visits
      const currentVisits =
        queryClient.getQueryData<UserVisit[]>(userVisitKeys.lists()) || [];
      const visitedCodes = currentVisits.map((v) => v.regionCode);

      // Toggle the region
      const updatedCodes = isVisited
        ? [...visitedCodes, regionCode]
        : visitedCodes.filter((code) => code !== regionCode);

      return saveUserVisits({ visitedRegionCodes: updatedCodes });
    },
    onMutate: async ({ regionCode, isVisited }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userVisitKeys.lists() });

      // Snapshot previous value
      const previousVisits = queryClient.getQueryData<UserVisit[]>(
        userVisitKeys.lists()
      );

      // Optimistically update
      queryClient.setQueryData<UserVisit[]>(userVisitKeys.lists(), (old) => {
        if (!old) return old;
        if (isVisited) {
          return [
            ...old,
            {
              regionCode,
              regionName: "",
              visitedAt: new Date().toISOString(),
            },
          ];
        }
        return old.filter((v) => v.regionCode !== regionCode);
      });

      return { previousVisits };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousVisits) {
        queryClient.setQueryData(userVisitKeys.lists(), context.previousVisits);
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: userVisitKeys.all });
    },
  });
}
