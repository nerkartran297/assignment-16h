import { useEffect, useMemo, useState } from "react";
import type {
  Booking,
  BookingStatus,
  FacilityType,
} from "@/features/bookings/booking.types";
import {
  formatStatusLabel,
  getNextBookingId,
  getStatusClasses,
  parseBookingDate,
} from "@/features/bookings/booking.utils";
import { cn } from "@/lib/cn";
import {
  CirclePlusIcon,
  ArrowLeft,
  HomeIcon,
  ShowerHeadIcon,
  TreesIcon,
  FlowerIcon,
  PodcastIcon,
  QuoteIcon,
  X,
  BuildingIcon,
  UserIcon,
  Clock4Icon,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { FormField } from "../UI/FormField";
import { TimeInput } from "../UI/TimeInput";
import { FilterDropdown } from "./FilterDropdown";
import { DatePicker } from "../UI/DatePicker";

export interface RecentBookingsTableProps {
  bookings: Booking[];
  onAddBooking?: (booking: Booking) => void;
  createBookingDefaults?: {
    employeeName: string;
    companyName: string;
    defaultStatus: BookingStatus;
  };
  className?: string;
  dateFrom: string;
  onDateFromChange: (next: string) => void;
  dateTo: string;
  onDateToChange: (next: string) => void;
}

function renderFacilityIcon(type: FacilityType | "all") {
  if (type === "all") return <BuildingIcon className="h-5 w-5" aria-hidden />;
  switch (type) {
    case "hut":
      return <HomeIcon className="h-5 w-5" aria-hidden />;
    case "bath":
      return <ShowerHeadIcon className="h-5 w-5" aria-hidden />;
    case "trail":
      return <TreesIcon className="h-5 w-5" aria-hidden />;
    case "deck":
      return <FlowerIcon className="h-5 w-5" aria-hidden />;
    case "pod":
      return <PodcastIcon className="h-5 w-5" aria-hidden />;
    default:
      return <QuoteIcon className="h-5 w-5" aria-hidden />;
  }
}

function renderStatusIcon(status: BookingStatus) {
  switch (status) {
    case "cancelled":
      return <XCircleIcon className="h-4 w-4 text-[#991B1B]" aria-hidden />;
    case "pending":
      return <Clock4Icon className="h-4 w-4 text-[#92400E]" aria-hidden />;
    case "confirmed":
      return (
        <CheckCircle2Icon className="h-4 w-4 text-[#166534]" aria-hidden />
      );
    case "completed":
      return (
        <CheckCircle2Icon className="h-4 w-4 text-[#1E40AF]" aria-hidden />
      );
    default:
      return <Clock4Icon className="h-4 w-4 text-slate-400" aria-hidden />;
  }
}

function getCapacityForType(type: FacilityType): number {
  switch (type) {
    case "trail":
      return 20;
    case "deck":
      return 12;
    case "hut":
      return 8;
    case "bath":
      return 6;
    case "pod":
    default:
      return 2;
  }
}

export function RecentBookingsTable({
  bookings,
  onAddBooking,
  createBookingDefaults,
  className,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}: RecentBookingsTableProps) {
  const pageSize = 6;
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [draftFacilityName, setDraftFacilityName] = useState("");
  const [draftFacilityType, setDraftFacilityType] = useState<
    "all" | FacilityType
  >("all");
  const [draftEmployeeName, setDraftEmployeeName] = useState("");
  const [draftCompanyName, setDraftCompanyName] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftTime, setDraftTime] = useState("09:00");
  const [draftAttendees, setDraftAttendees] = useState(4);
  const [draftPurpose, setDraftPurpose] = useState("New booking request");
  const [draftStatus, setDraftStatus] = useState<BookingStatus>("pending");
  const [toast, setToast] = useState<{ type: "error"; message: string } | null>(
    null,
  );

  const statusOptions: BookingStatus[] = useMemo(
    () => ["cancelled", "pending", "confirmed", "completed"],
    [],
  );

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const bookingDate = parseBookingDate(booking.date);
      const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
      const toDate = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
      return (
        !bookingDate ||
        ((!fromDate || bookingDate >= fromDate) &&
          (!toDate || bookingDate <= toDate))
      );
    });
  }, [bookings, dateFrom, dateTo]);

  const total = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedBookings = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, safePage]);

  const formatDateTime = (date: string, time: string) => {
    const parsedDate = parseBookingDate(date);
    if (!parsedDate) return `${date} - ${time}`;
    const formattedDate = parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return `${formattedDate} - ${time}`;
  };

  const facilityTypeMap = useMemo(() => {
    const map = new Map<string, FacilityType>();
    bookings.forEach((booking) => {
      if (!map.has(booking.facilityName)) {
        map.set(booking.facilityName, booking.facilityType);
      }
    });
    return map;
  }, [bookings]);

  const facilityOptions = useMemo(
    () =>
      (draftFacilityType === "all"
        ? Array.from(facilityTypeMap.keys())
        : Array.from(facilityTypeMap.entries())
            .filter(([, type]) => type === draftFacilityType)
            .map(([name]) => name)
      ).map((name) => ({
        label: name,
        value: name,
      })),
    [facilityTypeMap, draftFacilityType],
  );

  const employeeToCompanyMap = useMemo(() => {
    const map = new Map<string, string>();
    bookings.forEach((b) => {
      if (!map.has(b.employeeName)) map.set(b.employeeName, b.companyName);
    });
    return map;
  }, [bookings]);

  const allEmployeeNames = useMemo(
    () => Array.from(new Set(bookings.map((b) => b.employeeName))),
    [bookings],
  );

  const employeeOptions = useMemo(() => {
    const filterByCompany =
      draftCompanyName.trim() && draftCompanyName !== "All";
    const names = filterByCompany
      ? allEmployeeNames.filter(
          (name) => employeeToCompanyMap.get(name) === draftCompanyName,
        )
      : allEmployeeNames;
    return names.map((name) => ({ label: name, value: name }));
  }, [allEmployeeNames, employeeToCompanyMap, draftCompanyName]);

  const companyOptions = useMemo(
    () => [
      { label: "All", value: "All" },
      ...Array.from(new Set(bookings.map((b) => b.companyName))).map(
        (name) => ({ label: name, value: name }),
      ),
    ],
    [bookings],
  );

  const effectiveCompanyForSave =
    draftCompanyName === "All" && draftEmployeeName.trim()
      ? (employeeToCompanyMap.get(draftEmployeeName.trim()) ?? "")
      : draftCompanyName.trim();
  const canSave =
    draftFacilityName.trim().length > 0 &&
    draftEmployeeName.trim().length > 0 &&
    effectiveCompanyForSave.length > 0 &&
    draftDate.trim().length > 0 &&
    draftTime.trim().length > 0;

  const resetDraft = () => {
    setDraftFacilityName("");
    setDraftFacilityType("all");
    setDraftEmployeeName("");
    setDraftCompanyName("");
    setDraftDate("");
    setDraftTime("09:00");
    setDraftAttendees(4);
    setDraftPurpose("New booking request");
    setDraftStatus("pending");
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    resetDraft();
  };

  const handleSave = () => {
    if (!onAddBooking) return;
    if (!canSave) return;

    const effectiveType =
      draftFacilityType === "all"
        ? (facilityTypeMap.get(draftFacilityName.trim()) ?? "hut")
        : draftFacilityType;
    const capacity = getCapacityForType(effectiveType);

    const selectedDate = parseBookingDate(draftDate.trim());

    const hasConflict = bookings.some((booking) => {
      if (booking.facilityName !== draftFacilityName.trim()) return false;
      if (booking.status === "cancelled") return false;
      const existing = parseBookingDate(booking.date);
      if (!existing || !selectedDate) return false;
      return (
        existing.getFullYear() === selectedDate.getFullYear() &&
        existing.getMonth() === selectedDate.getMonth() &&
        existing.getDate() === selectedDate.getDate()
      );
    });

    if (hasConflict) {
      setToast({
        type: "error",
        message: `“${draftFacilityName}” is already booked on ${draftDate}. Please pick another day or facility.`,
      });
      return;
    }

    if (draftAttendees > capacity) {
      setToast({
        type: "error",
        message: `Attendees (${draftAttendees}) exceed the capacity (${capacity}) of this facility.`,
      });
      return;
    }

    const nextId = getNextBookingId(bookings);
    onAddBooking({
      id: nextId,
      facilityName: draftFacilityName.trim(),
      facilityType: effectiveType,
      employeeName: draftEmployeeName.trim(),
      companyName: effectiveCompanyForSave,
      date: draftDate.trim(),
      time: draftTime.trim(),
      status: createBookingDefaults?.defaultStatus ?? draftStatus,
      attendees: Math.max(
        1,
        Number.isFinite(draftAttendees) ? draftAttendees : 1,
      ),
      purpose: draftPurpose.trim().length
        ? draftPurpose.trim()
        : "New booking request",
    });

    setPage(1);
    closeAdd();
  };

  return (
    <>
      <section
        className={cn(
          "flex flex-col overflow-hidden rounded-lg border border-[#F1F5F9] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]",
          className,
        )}
      >
        <div className="flex flex-col gap-4 border-b border-slate-200/80 px-5 py-5 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-[#0F172A] md:text-2xl">
            Recent Bookings
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center">
              <DatePicker
                value={dateFrom}
                onChange={(next) => {
                  setPage(1);
                  onDateFromChange(next);
                }}
                placeholder="From date"
                className="w-full md:w-[150px]"
              />
              <DatePicker
                value={dateTo}
                onChange={(next) => {
                  setPage(1);
                  onDateToChange(next);
                }}
                placeholder="To date"
                className="w-full md:w-[150px]"
                leftOffset={-110}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (createBookingDefaults) {
                  setDraftEmployeeName(createBookingDefaults.employeeName);
                  setDraftCompanyName(createBookingDefaults.companyName);
                  setDraftStatus(createBookingDefaults.defaultStatus);
                }
                setIsAddOpen(true);
              }}
              className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-[#2E7D32] px-4 py-2.5 text-md font-semibold text-white shadow-[0_8px_20px_rgba(4,120,87,0.18)] transition-all duration-200 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            >
              <CirclePlusIcon className="h-3 w-3 mr-2" /> Add Booking
            </button>
            <Link
              href="/requests?status=all"
              className="inline-flex min-h-[42px] items-center justify-center rounded-lg px-2 text-md font-semibold text-[#208D26] transition-colors duration-200 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-[13px] uppercase tracking-[0.05em] text-slate-500">
                <th className="px-5 py-3.5 font-semibold md:px-6">
                  Facility Name
                </th>
                <th className="w-[220px] lg:w-[250px] px-5 py-3.5 font-semibold md:px-6">
                  Employee Name
                </th>
                <th className="w-[230px] lg:w-[220px] px-5 py-3.5 font-semibold md:px-6">
                  Date / Time
                </th>
                <th className="w-[140px] lg:w-[180px] px-5 py-3.5 font-semibold md:px-6">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-slate-100 transition-colors duration-200 hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4 md:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#208D261A] text-sm text-[#208D26]">
                        {renderFacilityIcon(booking.facilityType)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 text-md">
                          {booking.facilityName}
                        </p>
                        <p className="mt-0.5 text-md text-[#64748B]">
                          {booking.companyName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="w-[220px] lg:w-[250px] px-5 py-4 text-[#475569] md:px-6">
                    {booking.employeeName}
                  </td>
                  <td className="w-[190px] lg:w-[180px] px-5 py-4 text-[#64748B] md:px-6 text-md whitespace-nowrap">
                    {formatDateTime(booking.date, booking.time)}
                  </td>
                  <td className="w-[140px] lg:w-[180px] px-5 py-4 md:px-6">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold tracking-[0.02em]",
                        getStatusClasses(booking.status),
                      )}
                    >
                      {formatStatusLabel(booking.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200/80 bg-white px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {total === 0
                ? "No bookings to display."
                : `Showing ${(safePage - 1) * pageSize + 1}-${Math.min(
                    safePage * pageSize,
                    total,
                  )} of ${total}`}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, safePage - 1))}
                disabled={safePage <= 1}
                className={cn(
                  "inline-flex min-h-[38px] items-center justify-center rounded-lg border px-3.5 text-sm font-semibold transition-colors",
                  safePage <= 1
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                Prev
              </button>

              <div className="min-w-[96px] text-center text-sm font-semibold text-slate-700">
                Page {safePage} / {totalPages}
              </div>

              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                disabled={safePage >= totalPages}
                className={cn(
                  "inline-flex min-h-[38px] items-center justify-center rounded-lg border px-3.5 text-sm font-semibold transition-colors",
                  safePage >= totalPages
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {isAddOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-xs"
          onClick={closeAdd}
        >
          <div
            className="max-h-[90vh] w-full max-w-7xl overflow-hidden rounded-[24px] border border-slate-200 bg-[#F8FAFC] shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <button
                type="button"
                onClick={closeAdd}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-center text-slate-900">
                Add Booking
              </h3>
              <button
                type="button"
                onClick={closeAdd}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-146px)] overflow-y-auto px-6 py-6">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                <div className="space-y-4">
                  <section className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-3">
                      <h4 className="mt-1 text-base font-semibold text-slate-900">
                        Primary Information
                      </h4>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField label="Facility Name">
                        <FilterDropdown
                          value={draftFacilityName}
                          onChange={(next) => {
                            setDraftFacilityName(next);
                            const nextType = facilityTypeMap.get(next);
                            if (nextType) {
                              setDraftFacilityType(nextType);
                            }
                          }}
                          options={facilityOptions}
                          icon={<BuildingIcon className="h-4 w-4" />}
                          placeholder="Select facility"
                          className="min-w-0"
                        />
                      </FormField>

                      <FormField label="Facility Type">
                        <FilterDropdown
                          value={draftFacilityType}
                          onChange={(next) => {
                            const nextType = next as "all" | FacilityType;
                            setDraftFacilityType(nextType);
                            const firstOfType =
                              nextType === "all"
                                ? undefined
                                : Array.from(facilityTypeMap.entries()).find(
                                    ([, type]) => type === nextType,
                                  )?.[0];
                            setDraftFacilityName(firstOfType ?? "");
                          }}
                          options={[
                            { label: "All", value: "all" },
                            { label: "Hut", value: "hut" },
                            { label: "Bath", value: "bath" },
                            { label: "Trail", value: "trail" },
                            { label: "Deck", value: "deck" },
                            { label: "Pod", value: "pod" },
                          ]}
                          icon={renderFacilityIcon(draftFacilityType)}
                          className="min-w-0"
                        />
                      </FormField>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <FormField label="Employee">
                        <FilterDropdown
                          value={draftEmployeeName}
                          onChange={(next) => {
                            setDraftEmployeeName(next);
                            const company = employeeToCompanyMap.get(next);
                            if (company) setDraftCompanyName(company);
                          }}
                          options={employeeOptions}
                          icon={<UserIcon className="h-4 w-4" />}
                          placeholder="Select employee"
                          className="min-w-0"
                        />
                      </FormField>

                      <FormField label="Company">
                        <FilterDropdown
                          value={draftCompanyName}
                          onChange={(next) => {
                            setDraftCompanyName(next);
                            if (next === "All") return;
                            const currentEmployeeCompany = draftEmployeeName
                              ? employeeToCompanyMap.get(draftEmployeeName)
                              : null;
                            if (
                              currentEmployeeCompany &&
                              currentEmployeeCompany !== next
                            ) {
                              setDraftEmployeeName("");
                            }
                          }}
                          options={companyOptions}
                          icon={<BuildingIcon className="h-4 w-4" />}
                          placeholder="Select company"
                          className="min-w-0"
                        />
                      </FormField>
                    </div>
                  </section>

                  <section className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                    <div className="mb-3">
                      <h4 className="mt-1 text-base font-semibold text-slate-900">
                        Time & Capacity
                      </h4>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField label="Date">
                        <input
                          value={draftDate}
                          onChange={(e) => setDraftDate(e.target.value)}
                          placeholder="e.g. 2026-10-26"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                        />
                      </FormField>

                      <FormField label="Time">
                        <TimeInput
                          value={draftTime}
                          onChange={setDraftTime}
                          placeholder="09:00"
                        />
                      </FormField>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <FormField label="Attendees">
                        <input
                          type="number"
                          min={1}
                          value={draftAttendees}
                          onChange={(e) =>
                            setDraftAttendees(Number(e.target.value))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                        />
                      </FormField>

                      <FormField label="Purpose">
                        <input
                          value={draftPurpose}
                          onChange={(e) => setDraftPurpose(e.target.value)}
                          placeholder="e.g. Team retreat"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                        />
                      </FormField>
                    </div>
                  </section>
                </div>

                <aside className="space-y-4">
                  <section className="rounded-[22px] border border-slate-200 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Booking Status
                    </p>
                    <h4 className="mt-1 text-base font-semibold text-slate-900">
                      Current State
                    </h4>

                    <div className="mt-4">
                      <FilterDropdown
                        value={draftStatus}
                        onChange={(next) =>
                          setDraftStatus(next as BookingStatus)
                        }
                        options={statusOptions.map((status) => ({
                          label: formatStatusLabel(status),
                          value: status,
                        }))}
                        icon={renderStatusIcon(draftStatus)}
                        className="min-w-0"
                      />
                    </div>

                    {/* <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-500">
                        Selected status
                      </p>
                      <div className="mt-2">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold tracking-[0.02em]",
                            getStatusClasses(draftStatus),
                          )}
                        >
                          {formatStatusLabel(draftStatus)}
                        </span>
                      </div>
                    </div> */}
                  </section>

                  <section className="rounded-[22px] border border-slate-200 bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Summary
                    </p>
                    <h4 className="mt-1 text-base font-semibold text-slate-900">
                      Booking Overview
                    </h4>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-slate-500">Facility</span>
                        <span className="text-right font-medium text-slate-800">
                          {draftFacilityName || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-slate-500">Employee</span>
                        <span className="text-right font-medium text-slate-800">
                          {draftEmployeeName || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-slate-500">Company</span>
                        <span className="text-right font-medium text-slate-800">
                          {draftCompanyName || "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-slate-500">Schedule</span>
                        <span className="text-right font-medium text-slate-800">
                          {draftDate && draftTime
                            ? `${draftDate}, ${draftTime}`
                            : "—"}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <span className="text-slate-500">Attendees</span>
                        <span className="text-right font-medium text-slate-800">
                          {draftAttendees || "—"}
                        </span>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  {canSave
                    ? "Ready to create booking."
                    : "Fill required fields to save."}
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeAdd}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!canSave || !onAddBooking}
                    className={cn(
                      "inline-flex min-h-[42px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors",
                      canSave && onAddBooking
                        ? "bg-[#208D26] hover:bg-emerald-800"
                        : "cursor-not-allowed bg-slate-200 text-slate-500",
                    )}
                  >
                    Save booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-red-100 bg-white px-4 py-3 shadow-[0_18px_40px_rgba(248,113,113,0.35)]">
          <p className="text-sm font-semibold text-[#B91C1C]">Booking issue</p>
          <p className="mt-1 text-sm text-[#7F1D1D]">{toast.message}</p>
        </div>
      ) : null}
    </>
  );
}
