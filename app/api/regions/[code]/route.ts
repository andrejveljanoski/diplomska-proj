export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { regions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Try exact match first, then case-insensitive
    let region = await db
      .select()
      .from(regions)
      .where(eq(regions.code, code))
      .limit(1);

    // If not found, try case-insensitive search
    if (!region || region.length === 0) {
      region = await db
        .select()
        .from(regions)
        .where(sql`LOWER(${regions.code}) = LOWER(${code})`)
        .limit(1);
    }

    if (!region || region.length === 0) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }

    return NextResponse.json(region[0]);
  } catch (error) {
    console.error("Error fetching region:", error);
    return NextResponse.json(
      { error: "Failed to fetch region" },
      { status: 500 }
    );
  }
}
