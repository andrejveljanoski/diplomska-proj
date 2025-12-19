import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { regions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const region = await db
      .select()
      .from(regions)
      .where(eq(regions.code, params.code))
      .limit(1);

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
