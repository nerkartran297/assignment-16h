import { Suspense } from "react";
import type { BookingStatus } from "@/features/bookings/booking.types";
import { RequestsClient } from "./RequestsClient";

export default function RequestsPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string };
}) {
  const q = searchParams.q ?? "";
  const statusParam = searchParams.status ?? "all";
  const initialStatus =
    statusParam === "pending" ||
    statusParam === "confirmed" ||
    statusParam === "completed" ||
    statusParam === "cancelled"
      ? (statusParam as BookingStatus)
      : "all";

  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] rounded-lg border border-slate-200 bg-white p-6">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-4 w-96 animate-pulse rounded bg-slate-100" />
        </div>
      }
    >
      <RequestsClient initialSearchQuery={q} initialStatus={initialStatus} />
    </Suspense>
  );
}
