import type { Db, ObjectId } from "mongodb";
import type { AppUser } from "./user.types";

const COLLECTION_NAME = "users";

export function getUsersCollection(db: Db) {
  return db.collection<AppUser & { _id: ObjectId }>(COLLECTION_NAME);
}

