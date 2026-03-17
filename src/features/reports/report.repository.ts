import type { Report } from "./report.types";
import type { Db, ObjectId } from "mongodb";

const COLLECTION_NAME = "reports";

export function getReportsCollection(db: Db) {
  return db.collection<Report & { _id: ObjectId }>(COLLECTION_NAME);
}
