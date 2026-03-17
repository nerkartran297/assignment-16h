import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getUsersCollection } from "@/features/users/user.repository";
import type { AppUser } from "@/features/users/user.types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const collection = getUsersCollection(db);
  const body = (await request.json()) as Partial<AppUser>;

  await collection.updateOne({ id }, { $set: body });

  const updated = await collection.findOne(
    { id },
    { projection: { _id: 0 } },
  );

  return NextResponse.json(updated satisfies AppUser | null);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const db = await getDb();
  const collection = getUsersCollection(db);

  await collection.deleteOne({ id });
  return NextResponse.json({ ok: true });
}

