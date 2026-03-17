import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getReportsCollection } from "@/features/reports/report.repository";
import type { Report } from "@/features/reports/report.types";

export async function GET() {
  const db = await getDb();
  const collection = getReportsCollection(db);
  const reports = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(reports satisfies Report[]);
}

export async function POST(request: Request) {
  const db = await getDb();
  const collection = getReportsCollection(db);
  const body = (await request.json()) as Report;

  const doc = { ...body, createdAt: new Date().toISOString() };
  await collection.insertOne(
    doc as Parameters<typeof collection.insertOne>[0],
  );
  return NextResponse.json(
    { ...body, createdAt: new Date().toISOString() },
    { status: 201 },
  );
}
