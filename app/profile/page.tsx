"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import FloatingNavbar from "../components/FloatingNavbar";
import { useRegions, useUserVisits } from "@/lib/hooks/useRegions";
import Image from "next/image";
import { CheckCircle2, Circle, MapPin } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: regions = [] } = useRegions();
  const { data: visits = [] } = useUserVisits(!!session?.user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <FloatingNavbar />
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pt-32">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
      </>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ||
    user.email?.[0].toUpperCase() ||
    "U";

  // Get visited region codes
  const visitedCodes = new Set(visits.map((v) => v.regionCode));
  
  // Split regions into visited and not visited
  const visitedRegions = regions.filter((r) => visitedCodes.has(r.code));
  const notVisitedRegions = regions.filter((r) => !visitedCodes.has(r.code));
  
  // Calculate progress
  const totalRegions = regions.length;
  const visitedCount = visitedRegions.length;
  const progressPercentage = totalRegions > 0 ? (visitedCount / totalRegions) * 100 : 0;

  return (
    <>
      <FloatingNavbar />

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 pt-32">
        {/* Profile Header */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">
                  {user.name || "User"}
                </CardTitle>
                <CardDescription className="text-base">
                  {user.email}
                </CardDescription>
                <div className="mt-3">
                  <Badge variant="secondary">Active User</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Information */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-base">{user.name || "Not provided"}</p>
              </div>

              <Separator />

              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{user.email}</p>
              </div>

              <Separator />

              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="font-mono text-sm">{user.id || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              Track your progress exploring Macedonia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Welcome to your profile! Here you can view your account
              information and track your journey exploring the regions of
              Macedonia. Visit the home page to mark regions you&apos;ve visited
              and save your progress.
            </p>
            
            {/* Progress Stats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exploration Progress</span>
                <span className="font-semibold">{visitedCount} / {totalRegions} regions</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {progressPercentage.toFixed(0)}% complete
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Visited Regions */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Visited Regions
                </CardTitle>
                <CardDescription>
                  {visitedCount} {visitedCount === 1 ? 'region' : 'regions'} you&apos;ve explored
                </CardDescription>
              </div>
              <Badge variant="default">{visitedCount}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {visitedRegions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                You haven&apos;t visited any regions yet. Start exploring!
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {visitedRegions.map((region) => {
                  const firstImage = region.images && region.images.length > 0 
                    ? region.images[0] 
                    : region.image || "/images/mkd.png";
                  
                  return (
                    <div
                      key={region.id}
                      className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
                      onClick={() => router.push(`/regions/${region.code}`)}
                    >
                      <div className="relative h-24 w-full overflow-hidden bg-muted">
                        <Image
                          src={firstImage}
                          alt={region.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm">{region.name}</h3>
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        </div>
                        {region.population && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {region.population.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Not Visited Regions */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="h-5 w-5 text-muted-foreground" />
                  Not Visited Yet
                </CardTitle>
                <CardDescription>
                  {notVisitedRegions.length} {notVisitedRegions.length === 1 ? 'region' : 'regions'} waiting to be explored
                </CardDescription>
              </div>
              <Badge variant="secondary">{notVisitedRegions.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {notVisitedRegions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-semibold">Congratulations!</p>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve visited all regions of Macedonia!
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {notVisitedRegions.map((region) => {
                  const firstImage = region.images && region.images.length > 0 
                    ? region.images[0] 
                    : region.image || "/images/mkd.png";
                  
                  return (
                    <div
                      key={region.id}
                      className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md opacity-75 hover:opacity-100"
                      onClick={() => router.push(`/regions/${region.code}`)}
                    >
                      <div className="relative h-24 w-full overflow-hidden bg-muted">
                        <Image
                          src={firstImage}
                          alt={region.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105 grayscale group-hover:grayscale-0"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm">{region.name}</h3>
                          <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                        {region.population && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {region.population.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
