import { getJobStats } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stats = await getJobStats();
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
