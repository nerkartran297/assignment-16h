import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getBookingsCollection } from "@/features/bookings/booking.repository";
import type { Booking } from "@/features/bookings/booking.types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const collection = getBookingsCollection(db);
  const body = (await request.json()) as Partial<Booking>;

  await collection.updateOne({ id }, { $set: body });

  const updated = await collection.findOne(
    { id },
    { projection: { _id: 0 } },
  );

  return NextResponse.json(updated satisfies Booking | null);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const collection = getBookingsCollection(db);

  await collection.deleteOne({ id });
  return NextResponse.json({ ok: true });
}

