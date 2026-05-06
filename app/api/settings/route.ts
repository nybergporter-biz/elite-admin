import { getSettings, updateSetting } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { key, value } = await request.json();

    if (!key || !value) {
      return NextResponse.json(
        { success: false, error: 'Key and value are required' },
        { status: 400 }
      );
    }

    await updateSetting(key, value);

    return NextResponse.json({
      success: true,
      data: { key, value },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
