import MacedoniaMap from "./components/MacedoniaMap";
import FloatingNavbar from "./components/FloatingNavbar";
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
    <>
      <FloatingNavbar />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 pt-24">
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
                    {visitedCount} / {totalRegions} regions
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
            <MacedoniaMap />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="w-full">
          <CardContent className="flex justify-center gap-4 p-4">
            <Button variant="outline" size="sm">
              Share Map
            </Button>
            <Button size="sm">Save Progress</Button>
            <Button variant="destructive" size="sm">
              Reset All
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
