import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getUsersCollection } from "@/features/users/user.repository";
import type { AppUser } from "@/features/users/user.types";

export async function GET() {
  const db = await getDb();
  const collection = getUsersCollection(db);
  const users = await collection
    .find({}, { projection: { _id: 0 } })
    .toArray();

  return NextResponse.json(users satisfies AppUser[]);
}

export async function POST(request: Request) {
  const db = await getDb();
  const collection = getUsersCollection(db);
  const body = (await request.json()) as AppUser;
  await collection.insertOne(
    body as Parameters<typeof collection.insertOne>[0],
  );
  return NextResponse.json(body, { status: 201 });
}

