import type { Booking, BookingStatus } from "./booking.types";

export function getStatusClasses(status: BookingStatus) {
  switch (status) {
    case "confirmed":
      return "bg-[#DCFCE7] text-[#166534]";
    case "pending":
      return "bg-[#FEF3C7] text-[#92400E]";
    case "completed":
      return "bg-[#DBEAFE] text-[#1E40AF]";
    case "cancelled":
      return "bg-[#FEE2E2] text-[#991B1B]";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

export function formatStatusLabel(status: BookingStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

const monthIndex: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

/**
 * Parses booking.date like "Oct 24, 2026" or "2026-10-24" into a Date (local midnight).
 * Returns null if format is not recognized.
 */
export function parseBookingDate(dateLabel: string): Date | null {
  const trimmed = dateLabel.trim();

  // ISO-like format: 2026-10-24
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    const [, yyyy, mm, dd] = isoMatch;
    const year = Number.parseInt(yyyy, 10);
    const month = Number.parseInt(mm, 10) - 1;
    const day = Number.parseInt(dd, 10);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      return null;
    }
    return new Date(year, month, day);
  }

  // Legacy label format: "Oct 24, 2026"
  const match = /^([A-Za-z]{3})\s+(\d{1,2}),\s*(\d{4})$/.exec(trimmed);
  if (!match) return null;

  const [, mon, dd, yyyy] = match;
  const mm = monthIndex[mon];
  if (mm === undefined) return null;

  const day = Number.parseInt(dd, 10);
  const year = Number.parseInt(yyyy, 10);
  if (!Number.isFinite(day) || !Number.isFinite(year)) return null;

  return new Date(year, mm, day);
}

export function getNextBookingId(bookings: Booking[]): string {
  const numbers = bookings
    .map((booking) => {
      const match = /^BK-(\d+)$/.exec(booking.id);
      if (!match) return null;
      return Number.parseInt(match[1], 10);
    })
    .filter((n): n is number => Number.isFinite(n));

  const nextNumber = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `BK-${String(nextNumber).padStart(3, "0")}`;
}
