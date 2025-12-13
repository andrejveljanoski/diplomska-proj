"use client";

import { useState } from "react";

import { HeartIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

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
    <div className="relative max-w-md rounded-xl bg-gradient-to-r from-neutral-600 to-violet-300 pt-0 shadow-lg">
      <div className="flex h-60 items-center justify-center">
        <Image
          src={region.image ?? "/images/placeholder-image.png"}
          alt={region.name}
          className="h-full w-full object-cover"
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
          <CardDescription className="flex items-center gap-2">
            {region.placesToVisit && (
              <CardDescription className="flex flex-wrap items-center gap-2">
                {region.placesToVisit.split(",").map((place, idx) => (
                  <Badge key={idx} variant="outline" className="rounded-sm">
                    {place.trim()}
                  </Badge>
                ))}
              </CardDescription>
            )}
          </CardDescription>
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
