import {
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '@/lib/api';
import { validateCustomer } from '@/lib/validators';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await getCustomerById(params.id);
    return NextResponse.json({ success: true, data: { customer } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Customer not found' },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const validationError = validateCustomer(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const customer = await updateCustomer(params.id, body);
    return NextResponse.json({ success: true, data: { customer } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCustomer(params.id);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
