"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FloatingNavbar from "@/app/components/FloatingNavbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Users, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { Region } from "@/lib/db/schema";
import {
  useRegion,
  useUserVisits,
  useToggleRegionVisit,
} from "@/lib/hooks/useRegions";

export default function RegionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const regionCode = params.code as string;

  // Fetch region data using React Query
  const {
    data: region,
    isLoading,
    error,
  } = useRegion(regionCode, !!regionCode);

  // Fetch user visits to check if this region is visited
  const { data: visits = [] } = useUserVisits(!!session?.user);
  const isVisited = visits.some((v) => v.regionCode === regionCode);

  // Toggle visit mutation with optimistic updates
  const toggleVisitMutation = useToggleRegionVisit();

  // Mock data for demo purposes
  const mockRegionData: Partial<Region> = {
    description:
      "This region offers unique cultural heritage, stunning natural landscapes, and vibrant local communities. Visitors can explore historic sites, enjoy traditional cuisine, and experience the warmth of Macedonian hospitality.",
    placesToVisit:
      "• Historic Sites - Explore centuries-old architecture and cultural landmarks\n• Museums - Learn about the area's fascinating history and traditions\n• Natural Parks - Hike through pristine forests and enjoy mountain views\n• Local Markets - Shop for traditional crafts and artisanal products\n• Religious Sites - Visit ancient monasteries and spiritual centers\n• Scenic Viewpoints - Capture panoramic views of the landscape\n• Local Wineries - Taste regional wines and learn traditional methods\n• Cultural Venues - Attend performances showcasing traditional arts",
  };

  // Merge with mock data for richer content
  const enrichedRegion = region
    ? {
        ...region,
        description: region.description || mockRegionData.description || null,
        placesToVisit:
          region.placesToVisit || mockRegionData.placesToVisit || null,
      }
    : null;

  const handleToggleVisit = async () => {
    if (!session?.user) {
      toast.error("Please log in to mark regions as visited");
      return;
    }

    toggleVisitMutation.mutate(
      {
        regionCode,
        isVisited: !isVisited,
      },
      {
        onSuccess: () => {
          toast.success(
            isVisited ? "Removed from visited regions" : "Marked as visited!"
          );
        },
        onError: () => {
          toast.error("Failed to update visit status");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <>
        <FloatingNavbar />
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pt-32">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Loading region details...</p>
          </div>
        </section>
      </>
    );
  }

  if (error || !enrichedRegion) {
    return (
      <>
        <FloatingNavbar />
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pt-32">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Region not found
              </p>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={() => router.push("/")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <FloatingNavbar />

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pt-32">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Map
        </Button>

        {/* Hero Section */}
        <Card className="overflow-hidden">
          {enrichedRegion.image && (
            <div className="relative h-80 w-full overflow-hidden bg-muted">
              {/* <Image
                src={enrichedRegion.image}
                alt={enrichedRegion.name}
                fill
                className="object-cover"
                priority
              /> */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="text-5xl font-bold drop-shadow-lg">
                  {enrichedRegion.name}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-lg opacity-90">
                  <MapPin className="h-5 w-5" />
                  {enrichedRegion.code.toUpperCase()}
                </p>
              </div>
            </div>
          )}
          {!enrichedRegion.image && (
            <CardHeader className="pb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-5xl">
                    {enrichedRegion.name}
                  </CardTitle>
                  <CardDescription className="mt-3 flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Region Code: {enrichedRegion.code.toUpperCase()}
                  </CardDescription>
                </div>
                {isVisited && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Visited
                  </Badge>
                )}
              </div>
            </CardHeader>
          )}
          <CardContent className="space-y-6 py-6">
            <div className="flex flex-wrap items-center gap-4">
              {enrichedRegion.population && (
                <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Population</p>
                    <p className="text-lg font-semibold">
                      {enrichedRegion.population.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {isVisited && (
                <Badge
                  variant="default"
                  className="flex items-center gap-1 px-4 py-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Visited Region
                </Badge>
              )}
            </div>

            {session?.user && (
              <Button
                onClick={handleToggleVisit}
                disabled={toggleVisitMutation.isPending}
                variant={isVisited ? "outline" : "default"}
                size="lg"
                className="w-full sm:w-auto"
              >
                {toggleVisitMutation.isPending
                  ? "Updating..."
                  : isVisited
                  ? "Mark as Not Visited"
                  : "Mark as Visited"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        {enrichedRegion.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                About {enrichedRegion.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-muted-foreground">
                {enrichedRegion.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Places to Visit */}
        {enrichedRegion.placesToVisit && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Places to Visit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                {enrichedRegion.placesToVisit}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Region Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Region Code
              </p>
              <p className="text-lg font-semibold">
                {enrichedRegion.code.toUpperCase()}
              </p>
            </div>
            {enrichedRegion.population && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Population
                </p>
                <p className="text-lg font-semibold">
                  {enrichedRegion.population.toLocaleString()}
                </p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Added to Database
              </p>
              <p className="text-lg font-semibold">
                {new Date(enrichedRegion.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
