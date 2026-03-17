"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  Booking,
  BookingStatus,
  FacilityType,
} from "@/features/bookings/booking.types";
import type { Facility } from "@/features/facilities/facility.types";
import {
  formatStatusLabel,
  getNextBookingId,
  getStatusClasses,
  parseBookingDate,
} from "@/features/bookings/booking.utils";
import { cn } from "@/lib/cn";
import {
  SearchIcon,
  Filter,
  Building2,
  HomeIcon,
  ShowerHeadIcon,
  TreesIcon,
  FlowerIcon,
  PodcastIcon,
  QuoteIcon,
  Clock4Icon,
  CheckCircle2Icon,
  XCircleIcon,
  Plus,
} from "lucide-react";
import { DatePicker } from "@/components/UI/DatePicker";
import { FilterDropdown } from "./FilterDropdown";
import { RequestCreateModal } from "./modals/RequestCreateModal";
import { RequestEditModal } from "./modals/RequestEditModal";

export interface RequestsSectionProps {
  allBookings: Booking[];
  facilityMeta: Facility[];
  searchQuery: string;
  onSearchQueryChange: (next: string) => void;
  dateFrom: string;
  onDateFromChange: (next: string) => void;
  dateTo: string;
  onDateToChange: (next: string) => void;
  requestFilter: "all" | BookingStatus;
  onRequestFilterChange: (next: "all" | BookingStatus) => void;
  facilityFilter: string;
  onFacilityFilterChange: (next: string) => void;
  facilities: string[];
  filteredRequests: Booking[];
  selectedRequestId: string | null;
  onSelectRequest: (id: string) => void;
  selectedRequest: Booking | null;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onCreateBooking?: (booking: Booking) => void;
  onUpdateBooking?: (booking: Booking) => void;
  canChangeStatus?: (booking: Booking, newStatus: BookingStatus) => boolean;
  canEditDetails?: (booking: Booking) => boolean;
  createBookingDefaults?: {
    employeeName: string;
    companyName: string;
    defaultStatus: BookingStatus;
  };
}

function renderFacilityIcon(type: FacilityType | "all") {
  if (type === "all") return <Building2 className="h-5 w-5" aria-hidden />;
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

export function RequestsSection({
  allBookings,
  facilityMeta,
  searchQuery,
  onSearchQueryChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  requestFilter,
  onRequestFilterChange,
  facilityFilter,
  onFacilityFilterChange,
  facilities,
  filteredRequests,
  selectedRequestId,
  onSelectRequest,
  selectedRequest,
  onUpdateStatus,
  onCreateBooking,
  onUpdateBooking,
  canChangeStatus,
  canEditDetails,
  createBookingDefaults,
}: RequestsSectionProps) {
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState<BookingStatus | null>(null);

  const [draftFacilityName, setDraftFacilityName] = useState("");
  const [draftFacilityType, setDraftFacilityType] = useState<
    "all" | Booking["facilityType"]
  >("all");
  const [draftEmployeeName, setDraftEmployeeName] = useState("");
  const [draftCompanyName, setDraftCompanyName] = useState("");
  const [draftDate, setDraftDate] = useState("");
  const [draftTime, setDraftTime] = useState("");
  const [draftAttendees, setDraftAttendees] = useState<number | undefined>(
    undefined,
  );
  const [draftPurpose, setDraftPurpose] = useState("");
  const [toast, setToast] = useState<{ type: "error"; message: string } | null>(
    null,
  );

  const resetCreateDraft = () => {
    setDraftFacilityName("");
    setDraftFacilityType("all");
    setDraftEmployeeName("");
    setDraftCompanyName("");
    setDraftDate("");
    setDraftTime("");
    setDraftAttendees(undefined);
    setDraftPurpose("");
    setDraftStatus("pending");
  };

  const openDetailModal = (id: string) => {
    const booking =
      filteredRequests.find((b) => b.id === id) ?? selectedRequest ?? null;

    if (booking) {
      setDraftFacilityName(booking.facilityName);
      setDraftFacilityType(booking.facilityType);
      setDraftEmployeeName(booking.employeeName);
      setDraftCompanyName(booking.companyName);
      setDraftDate(booking.date);
      setDraftTime(booking.time);
      setDraftAttendees(booking.attendees);
      setDraftPurpose(booking.purpose);
      setDraftStatus(booking.status);
    }

    onSelectRequest(id);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    resetCreateDraft();
    if (createBookingDefaults) {
      setDraftEmployeeName(createBookingDefaults.employeeName);
      setDraftCompanyName(createBookingDefaults.companyName);
      setDraftStatus(createBookingDefaults.defaultStatus);
    }
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    resetCreateDraft();
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDetailModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  const total = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedRequests = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRequests.slice(start, start + pageSize);
  }, [filteredRequests, safePage]);

  const allStatusOptions = useMemo<BookingStatus[]>(
    () => ["cancelled", "pending", "confirmed", "completed"],
    [],
  );

  const editStatusOptions = useMemo((): BookingStatus[] => {
    if (!selectedRequest || !canChangeStatus) return allStatusOptions;
    const allowed = allStatusOptions.filter((status) =>
      canChangeStatus(selectedRequest, status),
    );
    const current = selectedRequest.status;
    if (allowed.includes(current)) return allowed;
    return [current, ...allowed];
  }, [selectedRequest, canChangeStatus, allStatusOptions]);

  const statusOptions = allStatusOptions;

  const facilityTypeMap = useMemo(() => {
    const map = new Map<string, FacilityType>();
    facilityMeta.forEach((facility) => {
      if (!map.has(facility.name)) {
        map.set(facility.name, facility.type);
      }
    });
    return map;
  }, [facilityMeta]);

  const modalFacilityOptions = useMemo(
    () =>
      (draftFacilityType === "all"
        ? facilities
        : facilities.filter(
            (name) => facilityTypeMap.get(name) === draftFacilityType,
          )
      ).map((name) => ({
        label: name,
        value: name,
      })),
    [facilities, facilityTypeMap, draftFacilityType],
  );

  const employeeToCompanyMap = useMemo(() => {
    const map = new Map<string, string>();
    allBookings.forEach((b) => {
      if (!map.has(b.employeeName)) map.set(b.employeeName, b.companyName);
    });
    return map;
  }, [allBookings]);

  const allEmployeeNames = useMemo(
    () => Array.from(new Set(allBookings.map((b) => b.employeeName))),
    [allBookings],
  );

  const modalEmployeeOptions = useMemo(() => {
    const filterByCompany =
      draftCompanyName.trim() && draftCompanyName !== "All";
    const names = filterByCompany
      ? allEmployeeNames.filter(
          (name) => employeeToCompanyMap.get(name) === draftCompanyName,
        )
      : allEmployeeNames;
    return names.map((name) => ({ label: name, value: name }));
  }, [allEmployeeNames, employeeToCompanyMap, draftCompanyName]);

  const modalCompanyOptions = useMemo(
    () => [
      { label: "All", value: "All" },
      ...Array.from(new Set(allBookings.map((b) => b.companyName))).map(
        (name) => ({ label: name, value: name }),
      ),
    ],
    [allBookings],
  );

  const hasChanges =
    selectedRequest !== null &&
    (draftFacilityName !== selectedRequest.facilityName ||
      draftFacilityType !== selectedRequest.facilityType ||
      draftEmployeeName !== selectedRequest.employeeName ||
      draftCompanyName !== selectedRequest.companyName ||
      draftDate !== selectedRequest.date ||
      draftTime !== selectedRequest.time ||
      draftAttendees !== selectedRequest.attendees ||
      draftPurpose !== selectedRequest.purpose ||
      (draftStatus ?? selectedRequest.status) !== selectedRequest.status);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const hasAvailabilityConflict = (
    facilityName: string,
    date: string,
    excludeBookingId?: string,
  ) => {
    if (!facilityName.trim() || !date.trim()) return false;
    const selectedDate = parseBookingDate(date);
    if (!selectedDate) return false;
    return allBookings.some((booking) => {
      if (booking.facilityName !== facilityName) return false;
      if (excludeBookingId && booking.id === excludeBookingId) return false;
      if (booking.status === "cancelled") return false;
      const existing = parseBookingDate(booking.date);
      if (!existing) return false;
      return (
        existing.getFullYear() === selectedDate.getFullYear() &&
        existing.getMonth() === selectedDate.getMonth() &&
        existing.getDate() === selectedDate.getDate()
      );
    });
  };

  const handleSaveChanges = () => {
    if (!selectedRequest) return;

    const nextStatus = draftStatus ?? selectedRequest.status;
    const effectiveType =
      draftFacilityType === "all"
        ? (facilityTypeMap.get(draftFacilityName) ?? "hut")
        : draftFacilityType;
    const capacity = getCapacityForType(effectiveType);

    if (
      hasAvailabilityConflict(draftFacilityName, draftDate, selectedRequest.id)
    ) {
      setToast({
        type: "error",
        message: `“${draftFacilityName}” is already booked on ${draftDate}. Please pick another day or facility.`,
      });
      return;
    }

    if ((draftAttendees ?? selectedRequest.attendees) > capacity) {
      setToast({
        type: "error",
        message: `Attendees (${draftAttendees ?? selectedRequest.attendees}) exceed the capacity (${capacity}) of this facility.`,
      });
      return;
    }

    const effectiveCompanyForEdit =
      draftCompanyName === "All" && draftEmployeeName
        ? (employeeToCompanyMap.get(draftEmployeeName) ?? "")
        : draftCompanyName;
    const updated: Booking = {
      ...selectedRequest,
      facilityName: draftFacilityName,
      facilityType: effectiveType,
      employeeName: draftEmployeeName,
      companyName: effectiveCompanyForEdit,
      date: draftDate,
      time: draftTime,
      attendees: draftAttendees ?? selectedRequest.attendees,
      purpose: draftPurpose,
      status: nextStatus,
    };

    if (hasChanges) {
      // Prefer full booking update when available
      if (typeof onUpdateBooking === "function") {
        onUpdateBooking(updated);
      } else if (nextStatus !== selectedRequest.status) {
        onUpdateStatus(selectedRequest.id, nextStatus);
      }
    }

    closeDetailModal();
  };

  const effectiveCompanyForCreate =
    draftCompanyName === "All" && draftEmployeeName.trim()
      ? (employeeToCompanyMap.get(draftEmployeeName.trim()) ?? "")
      : draftCompanyName.trim();
  const canSaveCreate =
    draftFacilityName.trim().length > 0 &&
    draftEmployeeName.trim().length > 0 &&
    effectiveCompanyForCreate.length > 0 &&
    draftDate.trim().length > 0 &&
    draftTime.trim().length > 0 &&
    !!draftAttendees &&
    draftPurpose.trim().length > 0;

  const handleSaveCreate = () => {
    if (!onCreateBooking || !canSaveCreate) return;

    const effectiveType =
      draftFacilityType === "all"
        ? (facilityTypeMap.get(draftFacilityName) ?? "hut")
        : draftFacilityType;
    const capacity = getCapacityForType(effectiveType);

    if (hasAvailabilityConflict(draftFacilityName, draftDate)) {
      setToast({
        type: "error",
        message: `“${draftFacilityName}” is already booked on ${draftDate}. Please pick another day or facility.`,
      });
      return;
    }

    if ((draftAttendees ?? 1) > capacity) {
      setToast({
        type: "error",
        message: `Attendees (${draftAttendees ?? 1}) exceed the capacity (${capacity}) of this facility.`,
      });
      return;
    }

    const newBooking: Booking = {
      id: getNextBookingId(allBookings),
      facilityName: draftFacilityName.trim(),
      facilityType: effectiveType,
      employeeName: draftEmployeeName.trim(),
      companyName: effectiveCompanyForCreate,
      date: draftDate.trim(),
      time: draftTime.trim(),
      attendees: draftAttendees ?? 1,
      purpose: draftPurpose.trim(),
      status: createBookingDefaults?.defaultStatus ?? draftStatus ?? "pending",
    };

    onCreateBooking(newBooking);
    closeCreateModal();
  };

  return (
    <>
      <section className="flex min-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-[8px] border border-[#F1F5F9] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-200/80 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-[#0F172A] md:text-2xl">
              All Bookings
            </h2>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-end">
              <div className="relative w-full md:w-[200px]">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder="Search bookings…"
                  className="w-full min-h-[42px] rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                />
              </div>

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

              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center">
                <div className="w-full md:w-auto">
                  <FilterDropdown
                    value={requestFilter}
                    onChange={(next) => (
                      setPage(1),
                      onRequestFilterChange(next as "all" | BookingStatus)
                    )}
                    icon={<Filter className="h-4 w-4" />}
                    options={[
                      { label: "All statuses", value: "all" },
                      { label: "Pending only", value: "pending" },
                      { label: "Confirmed", value: "confirmed" },
                      { label: "Completed", value: "completed" },
                      { label: "Cancelled", value: "cancelled" },
                    ]}
                  />
                </div>

                <div className="w-full md:w-auto">
                  <FilterDropdown
                    value={facilityFilter}
                    onChange={(next) => {
                      setPage(1);
                      onFacilityFilterChange(next);
                    }}
                    icon={<Building2 className="h-4 w-4" />}
                    options={[
                      { label: "All facilities", value: "all" },
                      ...facilities.map((facility) => ({
                        label: facility,
                        value: facility,
                      })),
                    ]}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(4,120,87,0.18)] transition-all duration-200 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                <Plus className="h-4 w-4 mr-2" /> New Booking
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-[13px] uppercase tracking-[0.05em] text-slate-500">
                <th className="px-5 py-3.5 font-semibold md:px-6">Request</th>
                <th className="w-[110px] lg:w-[130px] px-5 py-3.5 font-semibold md:px-6">
                  ID
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
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((booking) => {
                  const isSelected = booking.id === selectedRequestId;

                  return (
                    <tr
                      key={booking.id}
                      className={cn(
                        "cursor-pointer border-t border-slate-100 transition-colors duration-200 hover:bg-slate-50/70",
                        isSelected ? "bg-slate-50" : "hover:bg-slate-50/60",
                      )}
                      onClick={() => openDetailModal(booking.id)}
                    >
                      <td className="px-5 py-4 md:px-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(booking.id);
                          }}
                          className="group w-full cursor-pointer rounded-lg text-left focus-visible:outline-none"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#208D261A] text-sm text-[#208D26]">
                              {renderFacilityIcon(booking.facilityType)}
                            </div>

                            <div className="min-w-0">
                              <p
                                className={cn(
                                  "truncate text-md font-medium transition-colors",
                                  isSelected
                                    ? "text-slate-900"
                                    : "text-slate-800 group-hover:text-slate-900",
                                )}
                              >
                                {booking.facilityName}
                              </p>
                              <p className="mt-0.5 truncate text-md text-[#64748B]">
                                {booking.companyName}
                              </p>
                            </div>
                          </div>
                        </button>
                      </td>
                      <td className="w-[110px] lg:w-[130px] px-5 py-4 text-sm font-semibold text-slate-600 md:px-6">
                        {booking.id}
                      </td>
                      <td className="w-[220px] lg:w-[250px] px-5 py-4 text-md text-[#475569] md:px-6">
                        {booking.employeeName}
                      </td>

                      <td className="w-[190px] lg:w-[180px] px-5 py-4 text-md text-[#64748B] md:px-6 whitespace-nowrap">
                        {booking.date}, {booking.time}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 md:px-6">
                    <div className="w-full rounded-lg bg-white px-5 py-6">
                      <p className="text-md font-semibold text-slate-900 text-center">
                        No matching requests
                      </p>
                      <p className="mt-1.5 text-md text-slate-500 text-center">
                        Please try to adjust the filters to see more requests.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
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

      <RequestCreateModal
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        draftFacilityName={draftFacilityName}
        setDraftFacilityName={setDraftFacilityName}
        draftFacilityType={draftFacilityType}
        setDraftFacilityType={setDraftFacilityType}
        draftEmployeeName={draftEmployeeName}
        setDraftEmployeeName={setDraftEmployeeName}
        draftCompanyName={draftCompanyName}
        setDraftCompanyName={setDraftCompanyName}
        draftDate={draftDate}
        setDraftDate={setDraftDate}
        draftTime={draftTime}
        setDraftTime={setDraftTime}
        draftAttendees={draftAttendees}
        setDraftAttendees={setDraftAttendees}
        draftPurpose={draftPurpose}
        setDraftPurpose={setDraftPurpose}
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        modalFacilityOptions={modalFacilityOptions}
        modalEmployeeOptions={modalEmployeeOptions}
        modalCompanyOptions={modalCompanyOptions}
        facilityTypeMap={facilityTypeMap}
        facilities={facilities}
        employeeToCompanyMap={employeeToCompanyMap}
        statusOptions={statusOptions}
        canSaveCreate={canSaveCreate}
        onCreateBooking={onCreateBooking}
        onSave={handleSaveCreate}
        renderFacilityIcon={renderFacilityIcon}
        formatStatusLabel={formatStatusLabel}
        renderStatusIcon={renderStatusIcon}
      />

      <RequestEditModal
        open={isModalOpen}
        onClose={closeDetailModal}
        selectedRequest={selectedRequest}
        draftFacilityName={draftFacilityName}
        setDraftFacilityName={setDraftFacilityName}
        draftFacilityType={draftFacilityType}
        setDraftFacilityType={setDraftFacilityType}
        draftEmployeeName={draftEmployeeName}
        setDraftEmployeeName={setDraftEmployeeName}
        draftCompanyName={draftCompanyName}
        setDraftCompanyName={setDraftCompanyName}
        draftDate={draftDate}
        setDraftDate={setDraftDate}
        draftTime={draftTime}
        setDraftTime={setDraftTime}
        draftAttendees={draftAttendees}
        setDraftAttendees={setDraftAttendees}
        draftPurpose={draftPurpose}
        setDraftPurpose={setDraftPurpose}
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        modalFacilityOptions={modalFacilityOptions}
        modalEmployeeOptions={modalEmployeeOptions}
        modalCompanyOptions={modalCompanyOptions}
        facilityTypeMap={facilityTypeMap}
        facilities={facilities}
        employeeToCompanyMap={employeeToCompanyMap}
        statusOptions={statusOptions}
        editStatusOptions={editStatusOptions}
        canChangeStatus={canChangeStatus}
        canEditDetails={canEditDetails}
        hasChanges={hasChanges}
        onSave={handleSaveChanges}
        renderFacilityIcon={renderFacilityIcon}
        formatStatusLabel={formatStatusLabel}
        renderStatusIcon={renderStatusIcon}
      />

      {toast ? (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-lg border border-red-100 bg-white px-4 py-3 shadow-[0_18px_40px_rgba(248,113,113,0.35)]">
          <p className="text-sm font-semibold text-[#B91C1C]">Booking issue</p>
          <p className="mt-1 text-sm text-[#7F1D1D]">{toast.message}</p>
        </div>
      ) : null}
    </>
  );
}
