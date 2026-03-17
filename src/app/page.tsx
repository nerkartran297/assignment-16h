"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentBookingsTable } from "@/components/dashboard/RecentBookingsTable";
import { FacilityUsageCard } from "@/components/dashboard/FacilityUsageCard";
import { CampusMapCard } from "@/components/dashboard/CampusMapCard";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import type { Booking, FacilityUsage } from "@/features/bookings/booking.types";
import type { Facility } from "@/features/facilities/facility.types";
import type { AppUser } from "@/features/users/user.types";

export default function Page() {
  const { currentUser } = useCurrentUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [bookingsRes, facilitiesRes, usersRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/facilities"),
          fetch("/api/users"),
        ]);
        if (bookingsRes.ok) {
          const data = (await bookingsRes.json()) as Booking[];
          if (isMounted) setBookings(data);
        }
        if (facilitiesRes.ok) {
          const data = (await facilitiesRes.json()) as Facility[];
          if (isMounted) setFacilities(data);
        }
        if (usersRes.ok) {
          const data = (await usersRes.json()) as AppUser[];
          if (isMounted) setUsers(data);
        }
      } catch {
        // ignore; dashboard will show empty stats/table gracefully
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const activeFacilities = facilities.filter((f) => f.status === "active")
      .length;
    const registeredUsers = users.length;
    const pendingRequestsCount = bookings.filter(
      (b) => b.status === "pending",
    ).length;

    return {
      totalBookings,
      activeFacilities,
      registeredUsers,
      pendingRequests: pendingRequestsCount,
    };
  }, [bookings, facilities, users]);

  const bookingsVisibleByRole = useMemo(() => {
    if (!currentUser) return bookings;
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

  const facilityUsage = useMemo((): FacilityUsage[] => {
    const nonCancelled = bookings.filter((b) => b.status !== "cancelled");
    const total = nonCancelled.length;
    if (total === 0) return [];

    const byName = new Map<string, number>();
    for (const b of nonCancelled) {
      byName.set(b.facilityName, (byName.get(b.facilityName) ?? 0) + 1);
    }

    return Array.from(byName.entries())
      .map(([name, count]) => ({
        name,
        usage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.usage - a.usage);
  }, [bookings]);

  const createBookingDefaults = useMemo(() => {
    if (!currentUser || currentUser.role !== "staff") return undefined;
    return {
      employeeName: currentUser.name,
      companyName: currentUser.company,
      defaultStatus: "pending" as const,
    };
  }, [currentUser]);

  const handleAddBooking = async (booking: Booking) => {
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

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          badge="+12%"
          icon="book"
          href="/requests?status=all"
        />
        <StatCard
          title="Active Facilities"
          value={stats.activeFacilities}
          icon="facility"
          href="/facilities"
        />
        <StatCard
          title="Registered Users"
          value={stats.registeredUsers}
          badge="+5.2%"
          icon="user"
          href="/users"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          badge="New"
          badgeTone="amber"
          icon="request"
          href="/requests?status=pending"
        />
      </div>

      <div className="mt-6 grid gap-5 2xl:grid-cols-[minmax(0,1.55fr)_340px]">
        <div className="flex flex-col space-y-6">
          <RecentBookingsTable
            bookings={bookingsVisibleByRole}
            onAddBooking={handleAddBooking}
            createBookingDefaults={createBookingDefaults}
            className="flex-1"
          />
        </div>

        <div className="space-y-6">
          <FacilityUsageCard usage={facilityUsage} />
          <CampusMapCard />
        </div>
      </div>
    </div>
  );
}
