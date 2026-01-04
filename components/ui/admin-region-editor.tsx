"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, X, Upload } from "lucide-react";
import { Region } from "@/lib/db/schema";
import Image from "next/image";

type AdminRegionEditorProps = {
  region: Region;
  onUpdate?: (updatedRegion: Region) => void;
};

export function AdminRegionEditor({ region, onUpdate }: AdminRegionEditorProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    region.images || (region.image ? [region.image] : [])
  );
  const [formData, setFormData] = useState({
    name: region.name,
    population: region.population || 0,
    shortDescription: region.shortDescription || "",
    description: region.description || "",
    placesToVisit: region.placesToVisit || "",
  });

  // Only show for admin users
  if (!session?.user?.isAdmin) {
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const uploadedUrls: string[] = [];

      // Upload new images if any were selected
      for (const file of newImages) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("regionCode", region.code);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          throw new Error(`Failed to upload image: ${file.name}`);
        }

        const { imageUrl } = await uploadRes.json();
        uploadedUrls.push(imageUrl);
      }

      // Combine existing (not removed) and newly uploaded images
      const allImages = [...existingImages, ...uploadedUrls];

      // Update region data
      const updateRes = await fetch(`/api/regions/${region.code}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: allImages,
          image: allImages[0] || null, // Keep first image as legacy field
        }),
      });

      if (!updateRes.ok) {
        throw new Error("Failed to update region");
      }

      const updatedRegion = await updateRes.json();
      toast.success("Region updated successfully");
      onUpdate?.(updatedRegion);
      setIsOpen(false);
      setNewImages([]);
    } catch (error) {
      console.error("Error updating region:", error);
      toast.error("Failed to update region");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit Region
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Region: {region.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="population">Population</Label>
            <Input
              id="population"
              type="number"
              value={formData.population}
              onChange={(e) =>
                setFormData({ ...formData, population: parseInt(e.target.value) || 0 })
              }
            />
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="placesToVisit">
              Places to Visit (comma-separated)
            </Label>
            <Input
              id="placesToVisit"
              value={formData.placesToVisit}
              onChange={(e) =>
                setFormData({ ...formData, placesToVisit: e.target.value })
              }
              placeholder="Place 1, Place 2, Place 3"
            />
          </div>

          <div className="space-y-3">
            <Label>Region Images</Label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Current Images ({existingImages.length})
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((url, index) => (
                    <div key={url} className="relative group">
                      <div className="relative aspect-video overflow-hidden rounded-md border">
                        <Image
                          src={url}
                          alt={`Region image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExistingImage(url)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Preview */}
            {newImages.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  New Images ({newImages.length})
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {newImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                        <div className="flex h-full items-center justify-center p-2">
                          <p className="text-xs text-center truncate">
                            {file.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Input */}
            <div>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select multiple images to upload
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Region"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
