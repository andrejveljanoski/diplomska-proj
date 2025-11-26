import MacedoniaMap from "./components/MacedoniaMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  // TODO: This will come from state/database later
  const visitedCount = 5;
  const totalRegions = 80;
  const progressPercent = (visitedCount / totalRegions) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <h1 className="text-2xl font-bold tracking-tight">🗺️ Scratch Map</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Share Map
            </Button>
            <Button size="sm">Save Progress</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
        {/* Stats Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Macedonia</h2>
            <p className="text-muted-foreground">
              Click on a region to mark it as visited
            </p>
          </div>

          <Card className="sm:min-w-[280px]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                Your Progress
                <Badge variant="secondary">
                  {visitedCount} / {totalRegions}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <Progress value={progressPercent} className="h-2" />
              <p className="mt-1.5 text-xs text-muted-foreground">
                {progressPercent.toFixed(1)}% explored
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card className="w-full overflow-hidden">
          <CardContent className="p-0">
            <MacedoniaMap />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button variant="destructive" size="sm">
            Reset All
          </Button>
        </div>
      </main>
    </div>
  );
}
