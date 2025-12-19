"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
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

export default function RegionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const regionCode = params.code as string;

  const [region, setRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisited, setIsVisited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Mock data for demo purposes
  const mockRegionData: Partial<Region> = {
    description:
      "This region is known for its rich cultural heritage, stunning natural landscapes, and vibrant local communities. Visitors can explore historic sites, enjoy traditional cuisine, and experience the warmth of Macedonian hospitality. The region offers a perfect blend of urban attractions and rural charm, making it an ideal destination for travelers seeking authentic experiences.",
    placesToVisit:
      "• Historic Old Town - Wander through cobblestone streets and discover centuries-old architecture\n• Regional Museum - Learn about the area's fascinating history and cultural traditions\n• Natural Park - Hike through pristine forests and enjoy breathtaking mountain views\n• Traditional Bazaar - Shop for local crafts, textiles, and artisanal products\n• Monastery Complex - Visit ancient religious sites with stunning frescoes and peaceful grounds\n• Scenic Viewpoint - Capture panoramic photos of the valley and surrounding peaks\n• Local Wineries - Taste regional wines and learn about traditional winemaking methods\n• Cultural Center - Attend performances showcasing traditional music and dance",
  };

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const response = await fetch(`/api/regions/${regionCode}`);
        if (!response.ok) {
          throw new Error("Region not found");
        }
        const data: Region = await response.json();

        // Merge with mock data for richer content
        const enrichedRegion: Region = {
          ...data,
          description: data.description || mockRegionData.description || null,
          placesToVisit:
            data.placesToVisit || mockRegionData.placesToVisit || null,
        };

        setRegion(enrichedRegion);
      } catch (error) {
        console.error("Error fetching region:", error);
        toast.error("Failed to load region details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionCode]);

  useEffect(() => {
    const checkVisitStatus = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch("/api/user-visits");
        if (response.ok) {
          const visits = await response.json();
          const visited = visits.some(
            (v: { regionCode: string }) => v.regionCode === regionCode
          );
          setIsVisited(visited);
        }
      } catch (error) {
        console.error("Error checking visit status:", error);
      }
    };

    checkVisitStatus();
  }, [session, regionCode]);

  const handleToggleVisit = async () => {
    if (!session?.user) {
      toast.error("Please log in to mark regions as visited");
      return;
    }

    setIsToggling(true);
    try {
      // Get current visits
      const response = await fetch("/api/user-visits");
      if (!response.ok) throw new Error("Failed to fetch visits");

      const visits = await response.json();
      const visitedCodes = visits.map(
        (v: { regionCode: string }) => v.regionCode
      );

      // Toggle current region
      const updatedCodes = isVisited
        ? visitedCodes.filter((code: string) => code !== regionCode)
        : [...visitedCodes, regionCode];

      // Save updated visits
      const saveResponse = await fetch("/api/user-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitedRegionCodes: updatedCodes,
        }),
      });

      if (!saveResponse.ok) throw new Error("Failed to save");

      setIsVisited(!isVisited);
      toast.success(
        isVisited ? "Removed from visited regions" : "Marked as visited!"
      );
    } catch (error) {
      console.error("Error toggling visit:", error);
      toast.error("Failed to update visit status");
    } finally {
      setIsToggling(false);
    }
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

  if (!region) {
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
          {region.image && (
            <div className="relative h-64 w-full overflow-hidden bg-muted">
              <Image
                src={region.image}
                alt={region.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-4xl">{region.name}</CardTitle>
                <CardDescription className="mt-2 flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Region Code: {region.code}
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
          <CardContent className="space-y-4">
            {region.population && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Population: {region.population.toLocaleString()}</span>
              </div>
            )}

            {session?.user && (
              <Button
                onClick={handleToggleVisit}
                disabled={isToggling}
                variant={isVisited ? "outline" : "default"}
                className="w-full sm:w-auto"
              >
                {isToggling
                  ? "Updating..."
                  : isVisited
                  ? "Mark as Not Visited"
                  : "Mark as Visited"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        {region.description && (
          <Card>
            <CardHeader>
              <CardTitle>About {region.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {region.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Places to Visit */}
        {region.placesToVisit && (
          <Card>
            <CardHeader>
              <CardTitle>Places to Visit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {region.placesToVisit}
              </p>
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Region Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Region Code:</span>
              <span className="font-medium">{region.code}</span>
            </div>
            {region.population && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Population:</span>
                <span className="font-medium">
                  {region.population.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Added:</span>
              <span className="font-medium">
                {new Date(region.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
