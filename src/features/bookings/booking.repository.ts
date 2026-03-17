import type { Booking } from "./booking.types";
import type { Db, ObjectId } from "mongodb";

const COLLECTION_NAME = "bookings";

export function getBookingsCollection(db: Db) {
  return db.collection<Booking & { _id: ObjectId }>(COLLECTION_NAME);
}

