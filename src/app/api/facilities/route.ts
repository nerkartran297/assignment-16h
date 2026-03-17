import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getFacilitiesCollection } from "@/features/facilities/facility.repository";
import type { Facility } from "@/features/facilities/facility.types";

export async function GET() {
  const db = await getDb();
  const collection = getFacilitiesCollection(db);
  const facilities = await collection
    .find({}, { projection: { _id: 0 } })
    .toArray();

  return NextResponse.json(facilities satisfies Facility[]);
}

export async function POST(request: Request) {
  const db = await getDb();
  const collection = getFacilitiesCollection(db);
  const body = (await request.json()) as Facility;
  await collection.insertOne(
    body as Parameters<typeof collection.insertOne>[0],
  );
  return NextResponse.json(body, { status: 201 });
}

