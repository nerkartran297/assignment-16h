"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { RequestsSection } from "@/components/dashboard/RequestsSection";
import type { Booking, BookingStatus } from "@/features/bookings/booking.types";
import type { Facility } from "@/features/facilities/facility.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseBookingDate } from "@/features/bookings/booking.utils";

export interface RequestsClientProps {
  initialSearchQuery: string;
  initialStatus: "all" | BookingStatus;
}

export function RequestsClient({
  initialSearchQuery,
  initialStatus,
}: RequestsClientProps) {
  const { currentUser } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? initialSearchQuery ?? "";
  const statusParam = searchParams.get("status");

  const setQuery = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim().length === 0) params.delete("q");
    else params.set("q", next);
    const qs = params.toString();
    router.replace(qs.length ? `${pathname}?${qs}` : pathname);
  };

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [requestFilter, setRequestFilter] = useState<"all" | BookingStatus>(
    statusParam === "pending" ||
      statusParam === "confirmed" ||
      statusParam === "completed" ||
      statusParam === "cancelled"
      ? (statusParam as BookingStatus)
      : initialStatus,
  );
  const [facilityFilter, setFacilityFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [bookingsRes, facilitiesRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/facilities"),
        ]);
        if (!bookingsRes.ok || !facilitiesRes.ok) return;
        const [bookingsData, facilitiesData] = (await Promise.all([
          bookingsRes.json(),
          facilitiesRes.json(),
        ])) as [Booking[], Facility[]];
        if (isMounted) {
          setBookings(bookingsData);
          setFacilities(facilitiesData);
        }
      } catch {
        // ignore; UI handles empty list
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const facilityNames = useMemo(
    () => Array.from(new Set(facilities.map((f) => f.name))),
    [facilities],
  );

  const bookingsVisibleByRole = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "super_admin") return bookings;
    if (currentUser.role === "admin")
      return bookings.filter((b) => b.companyName === currentUser.company);
    if (currentUser.role === "staff")
      return bookings.filter(
        (b) =>
          b.employeeName === currentUser.name &&
          b.companyName === currentUser.company,
      );
    return bookings;
  }, [bookings, currentUser]);

  const filteredRequests = useMemo(() => {
    return bookingsVisibleByRole.filter((booking) => {
      const matchStatus =
        requestFilter === "all" ? true : booking.status === requestFilter;
      const matchFacility =
        facilityFilter === "all"
          ? true
          : booking.facilityName === facilityFilter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        q.length === 0
          ? true
          : booking.id.toLowerCase().includes(q) ||
            booking.facilityName.toLowerCase().includes(q) ||
            booking.employeeName.toLowerCase().includes(q) ||
            booking.companyName.toLowerCase().includes(q);

      const bookingDate = parseBookingDate(booking.date);
      const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
      const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
      const matchDateRange =
        !bookingDate ||
        ((!fromDate || bookingDate >= fromDate) &&
          (!toDate || bookingDate <= toDate));

      return matchStatus && matchFacility && matchQuery && matchDateRange;
    });
  }, [
    bookingsVisibleByRole,
    requestFilter,
    facilityFilter,
    query,
    dateFrom,
    dateTo,
  ]);

  const canChangeStatus = useCallback(
    (booking: Booking, newStatus: BookingStatus): boolean => {
      if (!currentUser) return false;
      if (currentUser.role === "super_admin") return true;
      if (currentUser.role === "admin")
        return booking.companyName === currentUser.company;
      if (currentUser.role === "staff")
        return (
          booking.employeeName === currentUser.name &&
          booking.companyName === currentUser.company &&
          newStatus === "cancelled"
        );
      return false;
    },
    [currentUser],
  );

  const canEditDetails = useCallback(
    (booking: Booking): boolean => {
      if (!currentUser) return false;
      if (currentUser.role === "super_admin") return true;
      if (currentUser.role === "admin")
        return booking.companyName === currentUser.company;
      return false;
    },
    [currentUser],
  );

  const createBookingDefaults = useMemo(() => {
    if (!currentUser || currentUser.role !== "staff") return undefined;
    return {
      employeeName: currentUser.name,
      companyName: currentUser.company,
      defaultStatus: "pending" as const,
    };
  }, [currentUser]);

  const selectedRequest =
    bookings.find((booking) => booking.id === selectedRequestId) ?? null;

  const handleUpdateStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status } : booking,
      ),
    );

    if (selectedRequestId === id && status !== "pending") {
      setSelectedRequestId(null);
    }
  };

  const handleCreateBooking = async (booking: Booking) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = (await res.json()) as Booking;
      setBookings((prev) => [created, ...prev]);
    } catch {
      setBookings((prev) => [booking, ...prev]);
    }
  };

  const handleUpdateBooking = async (updated: Booking) => {
    try {
      const res = await fetch(
        `/api/bookings/${encodeURIComponent(updated.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      const data = (await res.json()) as Booking | null;
      if (data) {
        setBookings((prev) => prev.map((b) => (b.id === data.id ? data : b)));
      } else {
        setBookings((prev) =>
          prev.map((b) => (b.id === updated.id ? updated : b)),
        );
      }
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b)),
      );
    }
  };

  return (
    <div className="space-y-6">
      <RequestsSection
        allBookings={bookings}
        searchQuery={query}
        onSearchQueryChange={setQuery}
        dateFrom={dateFrom}
        onDateFromChange={setDateFrom}
        dateTo={dateTo}
        onDateToChange={setDateTo}
        requestFilter={requestFilter}
        onRequestFilterChange={(next) => {
          setRequestFilter(next);
          const params = new URLSearchParams(searchParams.toString());
          if (next === "all") {
            params.delete("status");
          } else {
            params.set("status", next);
          }
          const qs = params.toString();
          router.replace(qs.length ? `${pathname}?${qs}` : pathname);
        }}
        facilityFilter={facilityFilter}
        onFacilityFilterChange={setFacilityFilter}
        facilities={facilityNames}
        facilityMeta={facilities}
        filteredRequests={filteredRequests}
        selectedRequestId={selectedRequestId}
        onSelectRequest={setSelectedRequestId}
        selectedRequest={selectedRequest}
        onUpdateStatus={handleUpdateStatus}
        onCreateBooking={handleCreateBooking}
        onUpdateBooking={handleUpdateBooking}
        canChangeStatus={canChangeStatus}
        canEditDetails={canEditDetails}
        createBookingDefaults={createBookingDefaults}
      />
    </div>
  );
}
