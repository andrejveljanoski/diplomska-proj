"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { cn } from "@/lib/utils";

type RegionCardProps = {
  region: {
    name: string;
    image?: string | null;
    images?: string[] | null;
    description?: string | null;
    placesToVisit?: string | null;
  };
  className?: string;
};

const RegionCard = ({ region, className }: RegionCardProps) => {
  // Get images array, falling back to single image or default
  const images = region.images && region.images.length > 0 
    ? region.images 
    : region.image 
    ? [region.image] 
    : ["/images/mkd.png"];

  console.log('RegionCard images:', images, 'for region:', region.name);

  return (
    <div
      className={cn(
        "relative max-w-md rounded-xl shadow-lg overflow-hidden",
        className
      )}
    >
      <div className="relative h-60 w-full bg-muted">
        <ImageCarousel
          images={images}
          alt={region.name}
          aspectRatio="auto"
          className="h-full w-full"
          showControls={false}
          showCounter={false}
          showDots={images.length > 1}
          autoPlay={images.length > 1}
          interval={4000}
        />
      </div>

      <Card className="border-none">
        <CardHeader>
          <CardTitle>{region.name}</CardTitle>
          {region.placesToVisit && (
            <div className="flex flex-wrap items-center gap-2">
              {region.placesToVisit.split(",").map((place, idx) => (
                <Badge key={idx} variant="outline" className="rounded-sm">
                  {place.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        {region.description && (
          <CardContent>
            <p className="text-sm">{region.description}</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default RegionCard;
