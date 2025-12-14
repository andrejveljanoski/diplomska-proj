"use client";

import { useState } from "react";

import { HeartIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import Image from "next/image";

type RegionCardProps = {
  region: {
    name: string;
    image?: string | null;
    description?: string | null;
    placesToVisit?: string | null;
  };
  className?: string;
};

const RegionCard = ({ region, className }: RegionCardProps) => {
  const [liked, setLiked] = useState<boolean>(false);

  return (
    <div
      className={cn(
        "relative max-w-md rounded-xl bg-linear-to-r from-neutral-600 to-violet-300 pt-0 shadow-lg ",
        className
      )}
    >
      <div className="relative h-60 w-full overflow-hidden rounded-xl">
        <Image
          src={"/images/mkd.png"} //temporary until img per region is uploaded
          alt={region.name}
          fill
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover"
        />
      </div>
      <Button
        size="icon"
        onClick={() => setLiked(!liked)}
        className="bg-primary/10 hover:bg-primary/20 absolute top-4 right-4 rounded-full"
      >
        <HeartIcon
          className={cn(
            liked ? "fill-destructive stroke-destructive" : "stroke-white"
          )}
        />
        <span className="sr-only">Like</span>
      </Button>
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
