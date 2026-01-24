export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { regions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateRegionSchema = z.object({
  name: z.string().optional(),
  population: z.number().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  placesToVisit: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const session = await auth();

    // Check if user is authenticated and is admin
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { code } = await params;
    const body = await req.json();

    const validated = updateRegionSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error },
        { status: 400 }
      );
    }

    // Update the region
    const updatedRegion = await db
      .update(regions)
      .set(validated.data)
      .where(eq(regions.code, code))
      .returning();

    if (updatedRegion.length === 0) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }

    return NextResponse.json(updatedRegion[0]);
  } catch (error) {
    console.error("Error updating region:", error);
    return NextResponse.json(
      { error: "Failed to update region" },
      { status: 500 }
    );
  }
}
