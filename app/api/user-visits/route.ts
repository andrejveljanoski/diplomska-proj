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

    const body = await request.json();
    const { visitedRegionCodes } = body as { visitedRegionCodes: string[] };

    if (!Array.isArray(visitedRegionCodes)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Normalize codes to lowercase
    const normalizedCodes = visitedRegionCodes.map((code) =>
      code.toLowerCase().trim()
    );

    // Get current user visits
    const currentVisits = await db
      .select()
      .from(userVisits)
      .where(eq(userVisits.userId, session.user.id));

    const currentVisitedCodes = new Set(
      currentVisits.map((v) => v.regionCode.toLowerCase())
    );

    // Find regions to add and remove
    const codesToAdd = normalizedCodes.filter(
      (code) => !currentVisitedCodes.has(code)
    );
    const codesToRemove = Array.from(currentVisitedCodes).filter(
      (code) => !normalizedCodes.includes(code)
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
    return NextResponse.json(
      { error: "Failed to save user visits" },
      { status: 500 }
    );
  }
}
