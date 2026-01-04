"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
  showControls?: boolean;
  showCounter?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  interval?: number;
};

export function ImageCarousel({
  images,
  alt,
  className,
  aspectRatio = "video",
  showControls = true,
  showCounter = true,
  showDots = true,
  autoPlay = false,
  interval = 4000,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, images.length, interval]);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "video" && "aspect-video",
          className
        )}
      >
        <p className="text-sm text-muted-foreground">No images available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={cn("group relative overflow-hidden", className)}>
      {/* Main Image */}
      <div
        className={cn(
          "relative w-full h-full",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "video" && "aspect-video"
        )}
      >
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Navigation Arrows */}
      {showControls && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous image</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next image</span>
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {showCounter && images.length > 1 && (
        <div className="absolute right-4 top-4 rounded-md bg-black/50 px-2 py-1 text-xs text-white">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
