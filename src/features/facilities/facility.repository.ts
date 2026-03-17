import type { Db, ObjectId } from "mongodb";
import type { Facility } from "./facility.types";

const COLLECTION_NAME = "facilities";

export function getFacilitiesCollection(db: Db) {
  return db.collection<Facility & { _id: ObjectId }>(COLLECTION_NAME);
}

