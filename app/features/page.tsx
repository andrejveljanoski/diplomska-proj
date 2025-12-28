import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, MousePointer2, Trophy, MapPin, History } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Discover Macedonia Through Interactive Exploration
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Track your travels, learn about regions, and explore the beauty of
          North Macedonia with our interactive scratch map
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Map className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Interactive Map</CardTitle>
            <CardDescription>
              Explore all 71 municipalities of North Macedonia with our detailed
              interactive map powered by amCharts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Hover to see quick region info</li>
              <li>• Click to mark regions as visited</li>
              <li>• Smooth animations and transitions</li>
              <li>• Responsive design for all devices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MousePointer2 className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Scratch to Reveal</CardTitle>
            <CardDescription>
              Mark regions you&apos;ve visited with a satisfying scratch-off
              experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Visual Macedonian flag pattern</li>
              <li>• Toggle visited/unvisited easily</li>
              <li>• Instant visual feedback</li>
              <li>• Automatic progress tracking</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Rich Region Details</CardTitle>
            <CardDescription>
              Discover detailed information about each municipality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Population statistics</li>
              <li>• Regional descriptions</li>
              <li>• Top places to visit</li>
              <li>• Beautiful imagery</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>
              Monitor your exploration journey with real-time statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Total regions visited counter</li>
              <li>• Completion percentage</li>
              <li>• Visual progress bar</li>
              <li>• Population coverage stats</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Persistent Data</CardTitle>
            <CardDescription>
              Your progress is automatically saved with authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Secure user accounts</li>
              <li>• Automatic saving</li>
              <li>• Access from any device</li>
              <li>• Never lose your progress</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Comprehensive Coverage</CardTitle>
            <CardDescription>
              Complete data for all 71 municipalities of North Macedonia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Detailed region information</li>
              <li>• Accurate population data</li>
              <li>• Curated travel recommendations</li>
              <li>• Regular content updates</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Perfect For</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🎒</div>
            <h3 className="font-semibold mb-2">Travelers</h3>
            <p className="text-sm text-muted-foreground">
              Track where you&lsquo;ve been and plan your next adventure across
              Macedonia
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🏫</div>
            <h3 className="font-semibold mb-2">Students</h3>
            <p className="text-sm text-muted-foreground">
              Learn about Macedonian geography and municipalities in an engaging
              way
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🏡</div>
            <h3 className="font-semibold mb-2">Locals</h3>
            <p className="text-sm text-muted-foreground">
              Discover hidden gems in your own country and explore new regions
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Built With Modern Technology
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Badge variant="secondary">Next.js 16</Badge>
          <Badge variant="secondary">React 19</Badge>
          <Badge variant="secondary">amCharts 5</Badge>
          <Badge variant="secondary">PostgreSQL</Badge>
          <Badge variant="secondary">Drizzle ORM</Badge>
          <Badge variant="secondary">NextAuth</Badge>
          <Badge variant="secondary">Tailwind CSS</Badge>
          <Badge variant="secondary">shadcn/ui</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our platform leverages cutting-edge web technologies to provide a
          fast, reliable, and beautiful experience across all devices.
        </p>
      </div>
    </div>
  );
}
