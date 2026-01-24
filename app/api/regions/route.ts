export const runtime = "nodejs";

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { regions } from '@/lib/db/schema';

export async function GET() {
    try{
        const allRegions = await db.select().from(regions);
        return NextResponse.json(allRegions);
    }
    catch(error){
        return NextResponse.json(
            {error: `Failed to fetch regions ${error}`},
            {status: 500}
            );

    }}