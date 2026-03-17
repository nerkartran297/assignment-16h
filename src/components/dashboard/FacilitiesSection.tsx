"use client";

import { useEffect, useMemo, useState } from "react";
import type { Booking } from "@/features/bookings/booking.types";
import { parseBookingDate } from "@/features/bookings/booking.utils";
import type { Facility } from "@/features/facilities/facility.types";
import { cn } from "@/lib/cn";
import { DatePicker } from "@/components/UI/DatePicker";
import { FilterDropdown } from "./FilterDropdown";
import { FacilityCreateModal } from "./modals/FacilityCreateModal";
import { FacilityEditModal } from "./modals/FacilityEditModal";
import {
  Building2,
  Filter,
  MapPin,
  Plus,
  HomeIcon,
  ShowerHeadIcon,
  TreesIcon,
  FlowerIcon,
  PodcastIcon,
  CheckCircle2Icon,
  XCircleIcon,
  SearchIcon,
  Users2,
} from "lucide-react";

export interface FacilitiesSectionProps {
  facilities: Facility[];
  allFacilities: Facility[];
  bookings?: Booking[];
  selectedFacility: Facility | null;
  onSelectFacility: (id: string | null) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
  typeFilter: "all" | Facility["type"];
  onTypeFilterChange: (value: "all" | Facility["type"]) => void;
  onCreateFacility: (facility: Facility) => void;
  onUpdateFacility: (facility: Facility) => void;
  onDeleteFacility: (id: string) => void;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isFacilityBookedOnDate(
  facilityName: string,
  dateStr: string,
  bookings: Booking[],
): boolean {
  if (!dateStr.trim()) return false;
  const filterDate = parseBookingDate(dateStr.trim());
  if (!filterDate) return false;
  return bookings.some((b) => {
    if (b.status === "cancelled") return false;
    if (b.facilityName !== facilityName) return false;
    const bookingDate = parseBookingDate(b.date);
    return isSameDay(bookingDate, filterDate);
  });
}

function renderFacilityIcon(type: Facility["type"]) {
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
      return <Building2 className="h-5 w-5" aria-hidden />;
  }
}

function renderStatusIcon(status: "active" | "inactive") {
  switch (status) {
    case "active":
      return (
        <CheckCircle2Icon className="h-4 w-4 text-[#166534]" aria-hidden />
      );
    case "inactive":
    default:
      return <XCircleIcon className="h-4 w-4 text-slate-500" aria-hidden />;
  }
}

function getStatusClasses(status: "active" | "inactive") {
  return status === "active"
    ? "bg-[#DCFCE7] text-[#166534]"
    : "bg-slate-100 text-slate-600";
}

function formatTypeLabel(type: Facility["type"]) {
  switch (type) {
    case "hut":
      return "Hut";
    case "bath":
      return "Bath";
    case "trail":
      return "Trail";
    case "deck":
      return "Deck";
    case "pod":
      return "Pod";
    default:
      return type;
  }
}

export function FacilitiesSection({
  facilities,
  allFacilities,
  bookings = [],
  selectedFacility,
  onSelectFacility,
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onCreateFacility,
  onUpdateFacility,
  onDeleteFacility,
}: FacilitiesSectionProps) {
  void allFacilities;
  void onDeleteFacility;
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const [availabilityDate, setAvailabilityDate] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editing, setEditing] = useState<Facility | null>(null);

  const [draftName, setDraftName] = useState("");
  const [draftType, setDraftType] = useState<Facility["type"]>("hut");
  const [draftCapacity, setDraftCapacity] = useState<number | "">("");
  const [draftStatus, setDraftStatus] = useState<"active" | "inactive">(
    "active",
  );
  const [draftLocation, setDraftLocation] = useState("");

  const resetCreateDraft = () => {
    setDraftName("");
    setDraftType("hut");
    setDraftCapacity("");
    setDraftStatus("active");
    setDraftLocation("");
  };

  const openCreateModal = () => {
    setEditing(null);
    resetCreateDraft();
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    resetCreateDraft();
  };

  const openDetailModal = (facility: Facility) => {
    setEditing(facility);
    setDraftName(facility.name);
    setDraftType(facility.type);
    setDraftCapacity(facility.capacity);
    setDraftStatus(facility.status);
    setDraftLocation(facility.location);
    onSelectFacility(facility.id);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen && !isCreateModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setIsCreateModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, isCreateModalOpen]);

  const total = facilities.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedFacilities = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return facilities.slice(start, start + pageSize);
  }, [facilities, safePage]);

  const canSave =
    draftName.trim().length > 0 &&
    draftLocation.trim().length > 0 &&
    draftCapacity !== "" &&
    Number(draftCapacity) > 0;

  const hasChanges =
    editing !== null &&
    (draftName !== editing.name ||
      draftType !== editing.type ||
      draftCapacity !== editing.capacity ||
      draftStatus !== editing.status ||
      draftLocation !== editing.location);

  const handleSaveCreate = () => {
    if (!canSave) return;

    const nextId = `FAC-${String(Date.now()).slice(-4)}`;

    onCreateFacility({
      id: nextId,
      name: draftName.trim(),
      type: draftType,
      capacity: Number(draftCapacity),
      status: draftStatus,
      location: draftLocation.trim(),
    });

    closeCreateModal();
  };

  const handleSaveChanges = () => {
    if (!editing || !hasChanges || !canSave) return;

    onUpdateFacility({
      ...editing,
      name: draftName.trim(),
      type: draftType,
      capacity: Number(draftCapacity),
      status: draftStatus,
      location: draftLocation.trim(),
    });

    closeDetailModal();
  };

  return (
    <>
      <section className="flex min-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-[8px] border border-[#F1F5F9] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-200/80 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-[#0F172A] md:text-2xl">
              All Facilities
            </h2>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-end">
              <div className="relative w-full md:w-[220px]">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    onSearchQueryChange(e.target.value);
                  }}
                  placeholder="Search facilities…"
                  className="w-full min-h-[42px] rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                />
              </div>

              <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center">
                <div className="w-full md:w-auto">
                  <FilterDropdown
                    value={statusFilter}
                    onChange={(next) => {
                      setPage(1);
                      onStatusFilterChange(
                        next as "all" | "active" | "inactive",
                      );
                    }}
                    icon={<Filter className="h-4 w-4" />}
                    options={[
                      { label: "All statuses", value: "all" },
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                    ]}
                  />
                </div>

                <div className="w-full md:w-auto">
                  <FilterDropdown
                    value={typeFilter}
                    onChange={(next) => {
                      setPage(1);
                      onTypeFilterChange(next as "all" | Facility["type"]);
                    }}
                    icon={<Building2 className="h-4 w-4" />}
                    options={[
                      { label: "All types", value: "all" },
                      { label: "Hut", value: "hut" },
                      { label: "Bath", value: "bath" },
                      { label: "Trail", value: "trail" },
                      { label: "Deck", value: "deck" },
                      { label: "Pod", value: "pod" },
                    ]}
                  />
                </div>

                <div className="w-full md:w-[200px]">
                  <DatePicker
                    value={availabilityDate}
                    onChange={(value) => {
                      setPage(1);
                      setAvailabilityDate(value ?? "");
                    }}
                    placeholder="Check availability on date"
                    placement="bottom"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(4,120,87,0.18)] transition-all duration-200 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Facility
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-[13px] uppercase tracking-[0.05em] text-slate-500">
                <th className="px-5 py-3.5 font-semibold md:px-6 w-full">
                  Facility
                </th>
                <th className="w-[120px] px-5 py-3.5 font-semibold md:px-6">
                  ID
                </th>
                <th className="w-[140px] px-5 py-3.5 font-semibold md:px-6">
                  Capacity
                </th>
                <th className="w-[140px] px-5 py-3.5 font-semibold md:px-6">
                  Status
                </th>
                {availabilityDate.trim() ? (
                  <th className="w-[120px] px-5 py-3.5 font-semibold md:px-6">
                    Availability
                  </th>
                ) : null}
                <th className="w-[240px] px-5 py-3.5 font-semibold md:px-6">
                  Location
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedFacilities.length > 0 ? (
                paginatedFacilities.map((facility) => {
                  const isSelected = facility.id === selectedFacility?.id;

                  return (
                    <tr
                      key={facility.id}
                      className={cn(
                        "cursor-pointer border-t border-slate-100 transition-colors duration-200 hover:bg-slate-50/70",
                        isSelected ? "bg-slate-50" : "hover:bg-slate-50/60",
                      )}
                      onClick={() => openDetailModal(facility)}
                    >
                      <td className="px-5 py-4 md:px-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(facility);
                          }}
                          className="group w-full cursor-pointer rounded-lg text-left focus-visible:outline-none"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#208D261A] text-sm text-[#208D26]">
                              {renderFacilityIcon(facility.type)}
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
                                {facility.name}
                              </p>
                              <p className="mt-0.5 truncate text-md text-[#64748B]">
                                {formatTypeLabel(facility.type)}
                              </p>
                            </div>
                          </div>
                        </button>
                      </td>

                      <td className="w-[120px] px-5 py-4 text-sm font-semibold text-slate-600 md:px-6">
                        {facility.id}
                      </td>

                      <td className="w-[140px] px-5 py-4 text-md text-[#475569] md:px-6">
                        <div className="flex items-center gap-2">
                          <Users2 className="h-4 w-4 text-slate-400" />
                          <span>{facility.capacity}</span>
                        </div>
                      </td>

                      <td className="w-[140px] px-5 py-4 md:px-6">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold tracking-[0.02em]",
                            getStatusClasses(facility.status),
                          )}
                        >
                          {facility.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {availabilityDate.trim() ? (
                        <td className="w-[120px] px-5 py-4 md:px-6">
                          {isFacilityBookedOnDate(
                            facility.name,
                            availabilityDate,
                            bookings,
                          ) ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-sm font-semibold text-amber-800">
                              <XCircleIcon className="h-3.5 w-3.5" />
                              Booked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-semibold text-emerald-800">
                              <CheckCircle2Icon className="h-3.5 w-3.5" />
                              Available
                            </span>
                          )}
                        </td>
                      ) : null}

                      <td className="w-[240px] px-5 py-4 text-md text-[#64748B] md:px-6">
                        <div className="flex min-w-0 items-center gap-2">
                          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="truncate">{facility.location}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={availabilityDate.trim() ? 7 : 6}
                    className="px-5 py-12 md:px-6"
                  >
                    <div className="w-full rounded-lg bg-white px-5 py-6">
                      <p className="text-center text-lg font-semibold text-slate-900">
                        No matching facilities
                      </p>
                      <p className="mt-1.5 text-center text-md text-slate-500">
                        Please try to adjust the filters to see more facilities.
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
                ? "No facilities to display."
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

      <FacilityCreateModal
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        draftName={draftName}
        setDraftName={setDraftName}
        draftType={draftType}
        setDraftType={setDraftType}
        draftCapacity={draftCapacity}
        setDraftCapacity={setDraftCapacity}
        draftLocation={draftLocation}
        setDraftLocation={setDraftLocation}
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        canSave={canSave}
        onSave={handleSaveCreate}
        renderFacilityIcon={renderFacilityIcon}
        renderStatusIcon={renderStatusIcon}
        formatTypeLabel={formatTypeLabel}
      />

      <FacilityEditModal
        open={isModalOpen}
        onClose={closeDetailModal}
        editing={editing}
        draftName={draftName}
        setDraftName={setDraftName}
        draftType={draftType}
        setDraftType={setDraftType}
        draftCapacity={draftCapacity}
        setDraftCapacity={setDraftCapacity}
        draftLocation={draftLocation}
        setDraftLocation={setDraftLocation}
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        hasChanges={hasChanges}
        canSave={canSave}
        onSave={handleSaveChanges}
        renderFacilityIcon={renderFacilityIcon}
        renderStatusIcon={renderStatusIcon}
        formatTypeLabel={formatTypeLabel}
      />
    </>
  );
}
