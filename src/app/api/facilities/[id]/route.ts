import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getFacilitiesCollection } from "@/features/facilities/facility.repository";
import type { Facility } from "@/features/facilities/facility.types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const collection = getFacilitiesCollection(db);
  const body = (await request.json()) as Partial<Facility>;

  await collection.updateOne({ id }, { $set: body });

  const updated = await collection.findOne(
    { id },
    { projection: { _id: 0 } },
  );

  return NextResponse.json(updated satisfies Facility | null);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const collection = getFacilitiesCollection(db);

  await collection.deleteOne({ id });
  return NextResponse.json({ ok: true });
}

