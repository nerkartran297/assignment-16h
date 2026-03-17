"use client";

import { useEffect, useMemo, useState } from "react";
import { FacilitiesSection } from "@/components/dashboard/FacilitiesSection";
import type { Booking } from "@/features/bookings/booking.types";
import type {
  Facility,
  FacilityType,
} from "@/features/facilities/facility.types";

export function FacilitiesPageClient() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | FacilityType>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [facilitiesRes, bookingsRes] = await Promise.all([
          fetch("/api/facilities"),
          fetch("/api/bookings"),
        ]);
        if (!facilitiesRes.ok) return;
        const data = (await facilitiesRes.json()) as Facility[];
        if (isMounted) setFacilities(data);
        if (bookingsRes.ok) {
          const bookingsData = (await bookingsRes.json()) as Booking[];
          if (isMounted) setBookings(bookingsData);
        }
      } catch {
        // swallow for now; UI already handles empty state gracefully
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return facilities.filter((f) => {
      const matchStatus =
        statusFilter === "all" ? true : f.status === statusFilter;
      const matchType = typeFilter === "all" ? true : f.type === typeFilter;
      const matchQuery =
        q.length === 0
          ? true
          : f.id.toLowerCase().includes(q) ||
            f.name.toLowerCase().includes(q) ||
            f.location.toLowerCase().includes(q);
      return matchStatus && matchType && matchQuery;
    });
  }, [facilities, search, statusFilter, typeFilter]);

  const selected =
    facilities.find((facility) => facility.id === selectedId) ?? null;

  const handleCreate = async (next: Facility) => {
    try {
      const res = await fetch("/api/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = (await res.json()) as Facility;
      setFacilities((prev) => [created, ...prev]);
    } catch {
      setFacilities((prev) => [next, ...prev]);
    }
  };

  const handleUpdate = async (next: Facility) => {
    try {
      const res = await fetch(
        `/api/facilities/${encodeURIComponent(next.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      const data = (await res.json()) as Facility | null;
      if (data) {
        setFacilities((prev) =>
          prev.map((f) => (f.id === data.id ? data : f)),
        );
      } else {
        setFacilities((prev) =>
          prev.map((f) => (f.id === next.id ? next : f)),
        );
      }
    } catch {
      setFacilities((prev) =>
        prev.map((f) => (f.id === next.id ? next : f)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/facilities/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setFacilities((prev) => prev.filter((f) => f.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch {
      setFacilities((prev) => prev.filter((f) => f.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <FacilitiesSection
        facilities={filtered}
        allFacilities={facilities}
        bookings={bookings}
        selectedFacility={selected}
        onSelectFacility={setSelectedId}
        searchQuery={search}
        onSearchQueryChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        onCreateFacility={handleCreate}
        onUpdateFacility={handleUpdate}
        onDeleteFacility={handleDelete}
      />
    </div>
  );
}
