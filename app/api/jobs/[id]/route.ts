import { getJobById, updateJob, deleteJob } from '@/lib/api';
import { validateJob } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const job = await getJobById(id);
    return NextResponse.json({ success: true, data: { job } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Job not found' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    if (body.customer_id || body.service_type || body.quoted_price !== undefined) {
      const validationError = validateJob(body);
      if (validationError) {
        return NextResponse.json(
          { success: false, error: validationError },
          { status: 400 }
        );
      }
    }

    const job = await updateJob(id, body);
    return NextResponse.json({ success: true, data: { job } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteJob(id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
