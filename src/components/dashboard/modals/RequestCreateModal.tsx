"use client";

import type {
  Booking,
  BookingStatus,
  FacilityType,
} from "@/features/bookings/booking.types";
import { cn } from "@/lib/cn";
import { FormField } from "@/components/UI/FormField";
import { DatePicker } from "@/components/UI/DatePicker";
import { TimeInput } from "@/components/UI/TimeInput";
import { FilterDropdown } from "../FilterDropdown";
import { ArrowLeft, Building2, X } from "lucide-react";

export interface RequestCreateModalProps {
  open: boolean;
  onClose: () => void;
  draftFacilityName: string;
  setDraftFacilityName: (v: string) => void;
  draftFacilityType: "all" | Booking["facilityType"];
  setDraftFacilityType: (v: "all" | Booking["facilityType"]) => void;
  draftEmployeeName: string;
  setDraftEmployeeName: (v: string) => void;
  draftCompanyName: string;
  setDraftCompanyName: (v: string) => void;
  draftDate: string;
  setDraftDate: (v: string) => void;
  draftTime: string;
  setDraftTime: (v: string) => void;
  draftAttendees: number | undefined;
  setDraftAttendees: (v: number | undefined) => void;
  draftPurpose: string;
  setDraftPurpose: (v: string) => void;
  draftStatus: BookingStatus | null;
  setDraftStatus: (v: BookingStatus | null) => void;
  modalFacilityOptions: { label: string; value: string }[];
  modalEmployeeOptions: { label: string; value: string }[];
  modalCompanyOptions: { label: string; value: string }[];
  facilityTypeMap: Map<string, FacilityType>;
  facilities: string[];
  employeeToCompanyMap: Map<string, string>;
  statusOptions: BookingStatus[];
  canSaveCreate: boolean;
  onCreateBooking?: (booking: Booking) => void;
  onSave: () => void;
  renderFacilityIcon: (type: FacilityType | "all") => React.ReactNode;
  formatStatusLabel: (status: BookingStatus) => string;
  renderStatusIcon: (status: BookingStatus) => React.ReactNode;
}

export function RequestCreateModal({
  open,
  onClose,
  draftFacilityName,
  setDraftFacilityName,
  draftFacilityType,
  setDraftFacilityType,
  draftEmployeeName,
  setDraftEmployeeName,
  draftCompanyName,
  setDraftCompanyName,
  draftDate,
  setDraftDate,
  draftTime,
  setDraftTime,
  draftAttendees,
  setDraftAttendees,
  draftPurpose,
  setDraftPurpose,
  draftStatus,
  setDraftStatus,
  modalFacilityOptions,
  modalEmployeeOptions,
  modalCompanyOptions,
  facilityTypeMap,
  facilities,
  employeeToCompanyMap,
  statusOptions,
  canSaveCreate,
  onCreateBooking,
  onSave,
  renderFacilityIcon,
  formatStatusLabel,
  renderStatusIcon,
}: RequestCreateModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/28 px-4 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[20px] border border-slate-200 bg-[#F8FAFC] shadow-[0_24px_80px_rgba(15,23,42,0.20)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-900">
            New Booking
          </h3>

          <button
            type="button"
            onClick={onClose}
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
                        if (nextType) setDraftFacilityType(nextType);
                      }}
                      options={modalFacilityOptions}
                      placeholder="Select facility"
                      icon={<Building2 className="h-4 w-4" />}
                      className="min-w-0"
                    />
                  </FormField>

                  <FormField label="Facility Type">
                    <FilterDropdown
                      value={draftFacilityType}
                      onChange={(next) => {
                        const nextType = next as "all" | Booking["facilityType"];
                        setDraftFacilityType(nextType);
                        const firstOfType =
                          nextType === "all"
                            ? undefined
                            : facilities.find(
                                (name) =>
                                  facilityTypeMap.get(name) === nextType,
                              );
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
                      options={modalEmployeeOptions}
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
                      options={modalCompanyOptions}
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
                    <DatePicker
                      value={draftDate}
                      onChange={setDraftDate}
                      placeholder="Select booking date"
                      placement="top"
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
                      value={draftAttendees ?? ""}
                      onChange={(e) =>
                        setDraftAttendees(
                          e.target.value
                            ? Number.parseInt(e.target.value, 10)
                            : undefined,
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                    />
                  </FormField>

                  <FormField label="Purpose">
                    <input
                      value={draftPurpose}
                      onChange={(e) => setDraftPurpose(e.target.value)}
                      placeholder="e.g. Team retreat"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
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
                    value={draftStatus ?? "pending"}
                    onChange={(next) => setDraftStatus(next as BookingStatus)}
                    options={statusOptions.map((status) => ({
                      label: formatStatusLabel(status),
                      value: status,
                    }))}
                    icon={renderStatusIcon(draftStatus ?? "pending")}
                    className="min-w-0"
                  />
                </div>
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
                    <span className="text-slate-500">Duration</span>
                    <span className="text-right font-medium text-slate-800">
                      {"Full day"}
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
              {canSaveCreate
                ? "Ready to create booking."
                : "Fill required fields to save."}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={!canSaveCreate || !onCreateBooking}
                className={cn(
                  "inline-flex min-h-[42px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors",
                  canSaveCreate && onCreateBooking
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
  );
}
