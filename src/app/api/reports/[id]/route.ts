import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getReportsCollection } from "@/features/reports/report.repository";
import type { Report } from "@/features/reports/report.types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const collection = getReportsCollection(db);
  const body = (await request.json()) as Partial<Report>;

  await collection.updateOne({ id }, { $set: body });

  const updated = await collection.findOne(
    { id },
    { projection: { _id: 0 } },
  );

  return NextResponse.json(updated satisfies Report | null);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const collection = getReportsCollection(db);

  await collection.deleteOne({ id });
  return NextResponse.json({ ok: true });
}
