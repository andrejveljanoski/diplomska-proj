export const runtime = "nodejs";

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasAuthTrustHost: !!process.env.AUTH_TRUST_HOST,
      hasR2Endpoint: !!process.env.R2_ENDPOINT,
      nextAuthUrl: process.env.NEXTAUTH_URL || 'NOT_SET',
      authSecret: process.env.AUTH_SECRET ? 'SET (hidden)' : 'NOT_SET',
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'SET (hidden)' : 'NOT_SET',
      nodeEnv: process.env.NODE_ENV || 'NOT_SET',
      allEnvKeys: Object.keys(process.env).filter(k => 
        k.includes('AUTH') || k.includes('DATABASE') || k.includes('R2')
      ),
    };

    // Test database connection
    let dbStatus = 'not_tested';
    try {
      const { db } = await import('@/lib/db');
      const { regions } = await import('@/lib/db/schema');
      const testQuery = await db.select().from(regions).limit(1);
      dbStatus = testQuery ? 'connected' : 'no_data';
    } catch (dbError: any) {
      dbStatus = `error: ${dbError.message}`;
    }

    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
