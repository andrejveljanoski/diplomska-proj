import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userVisits, regions } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";

// GET: Fetch user's visited regions
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const visits = await db
      .select({
        regionCode: userVisits.regionCode,
        regionName: regions.name,
        visitedAt: userVisits.visitedAt,
      })
      .from(userVisits)
      .innerJoin(regions, eq(userVisits.regionCode, regions.code))
      .where(eq(userVisits.userId, session.user.id));

    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching user visits:", error);
    return NextResponse.json(
      { error: "Failed to fetch user visits" },
      { status: 500 }
    );
  }
}

// POST: Save visited regions
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }
    
    const { visitedRegionCodes } = body as { visitedRegionCodes: string[] };

    if (!Array.isArray(visitedRegionCodes)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Normalize codes to lowercase and deduplicate
    const normalizedCodes = [...new Set(
      visitedRegionCodes.map((code) => code.toLowerCase().trim())
    )];

    // Validate that all region codes exist in the database
    let validNormalizedCodes: string[] = [];
    if (normalizedCodes.length > 0) {
      const validRegions = await db
        .select({ code: regions.code })
        .from(regions)
        .where(inArray(regions.code, normalizedCodes));
      
      const validCodes = new Set(validRegions.map((r) => r.code.toLowerCase()));
      validNormalizedCodes = normalizedCodes.filter((code) => validCodes.has(code));
    }

    // Get current user visits
    const currentVisits = await db
      .select()
      .from(userVisits)
      .where(eq(userVisits.userId, session.user.id));

    const currentVisitedCodes = new Set(
      currentVisits.map((v) => v.regionCode.toLowerCase())
    );

    // Find regions to add and remove (only use validated codes)
    const codesToAdd = validNormalizedCodes.filter(
      (code) => !currentVisitedCodes.has(code)
    );
    const codesToRemove = Array.from(currentVisitedCodes).filter(
      (code) => !validNormalizedCodes.includes(code)
    );

    const userId = session.user.id; // Extract for TypeScript

    // Add new visits (batch insert)
    if (codesToAdd.length > 0) {
      await db.insert(userVisits).values(
        codesToAdd.map((code) => ({
          userId,
          regionCode: code,
        }))
      );
    }

    // Remove old visits (batch delete using inArray)
    if (codesToRemove.length > 0) {
      await db
        .delete(userVisits)
        .where(
          and(
            eq(userVisits.userId, userId),
            inArray(userVisits.regionCode, codesToRemove)
          )
        );
    }

    return NextResponse.json({
      success: true,
      added: codesToAdd.length,
      removed: codesToRemove.length,
    });
  } catch (error) {
    console.error("Error saving user visits:", error);
    // Return more details in development
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      { error: "Failed to save user visits", details: errorMessage, stack: errorStack },
      { status: 500 }
    );
  }
}
