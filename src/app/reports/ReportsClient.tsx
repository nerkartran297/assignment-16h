"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { ReportsSection } from "@/components/dashboard/ReportsSection";
import type { Report } from "@/features/reports/report.types";
import type { Facility } from "@/features/facilities/facility.types";

export function ReportsClient() {
  const { currentUser } = useCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [reportsRes, facilitiesRes] = await Promise.all([
          fetch("/api/reports"),
          fetch("/api/facilities"),
        ]);
        if (!isMounted) return;
        if (reportsRes.ok) {
          const data = (await reportsRes.json()) as Report[];
          if (isMounted) setReports(data);
        }
        if (facilitiesRes.ok) {
          const data = (await facilitiesRes.json()) as Facility[];
          if (isMounted) setFacilities(data);
        }
      } catch {
        // ignore
      } finally {
        if (isMounted) setIsLoading(false);
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

  const canChangeStatus = useMemo(
    () =>
      currentUser?.role === "super_admin" || currentUser?.role === "admin",
    [currentUser?.role],
  );

  const handleCreateReport = useCallback(async (report: Report) => {
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...report,
          createdAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = (await res.json()) as Report;
      setReports((prev) => [created, ...prev]);
    } catch {
      setReports((prev) => [{ ...report, createdAt: new Date().toISOString() }, ...prev]);
    }
  }, []);

  const handleUpdateReport = useCallback(async (updated: Report) => {
    try {
      const res = await fetch(
        `/api/reports/${encodeURIComponent(updated.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      const data = (await res.json()) as Report | null;
      if (data) {
        setReports((prev) =>
          prev.map((r) => (r.id === data.id ? data : r)),
        );
      } else {
        setReports((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r)),
        );
      }
    } catch {
      setReports((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
    }
  }, []);

  return (
    <div className="space-y-6">
      <ReportsSection
        isLoading={isLoading}
        reports={reports}
        facilityNames={facilityNames}
        onCreateReport={handleCreateReport}
        onUpdateReport={handleUpdateReport}
        canChangeStatus={canChangeStatus}
      />
    </div>
  );
}
