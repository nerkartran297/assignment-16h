import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getBookingsCollection } from "@/features/bookings/booking.repository";
import type { Booking } from "@/features/bookings/booking.types";

export async function GET() {
  const db = await getDb();
  const collection = getBookingsCollection(db);
  const bookings = await collection
    .find({}, { projection: { _id: 0 } })
    .toArray();

  return NextResponse.json(bookings satisfies Booking[]);
}

export async function POST(request: Request) {
  const db = await getDb();
  const collection = getBookingsCollection(db);
  const body = (await request.json()) as Booking;
  // MongoDB adds _id on insert; our Booking type uses id (string). Cast so insertOne accepts the payload.
  await collection.insertOne(body as Parameters<typeof collection.insertOne>[0]);
  return NextResponse.json(body, { status: 201 });
}

