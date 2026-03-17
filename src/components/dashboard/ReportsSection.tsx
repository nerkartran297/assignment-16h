"use client";

import { useMemo, useState } from "react";
import type { Report, ReportStatus } from "@/features/reports/report.types";
import {
  formatReportStatusLabel,
  getNextReportId,
} from "@/features/reports/report.utils";
import { cn } from "@/lib/cn";
import { DatePicker } from "@/components/UI/DatePicker";
import { FormField } from "@/components/UI/FormField";
import { FilterDropdown } from "./FilterDropdown";
import {
  FileText,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
  Wrench,
  Plus,
  ArrowLeft,
  X,
  Building2,
  Calendar,
} from "lucide-react";

export interface ReportsSectionProps {
  reports: Report[];
  facilityNames: string[];
  onCreateReport: (report: Report) => void;
  onUpdateReport: (report: Report) => void;
  canChangeStatus?: boolean;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </p>
  );
}

function ModalShell({
  children,
  onClose,
  maxWidth = "max-w-2xl",
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-xs"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-[#F8FAFC] shadow-[0_24px_80px_rgba(15,23,42,0.20)]",
          maxWidth,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  title,
  subtitle,
  onBack,
  onClose,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-b border-slate-200 bg-[#F8FAFC] px-6 py-5">
        <SectionLabel>Report workflow</SectionLabel>
        <h3 className="mt-1.5 text-[24px] font-semibold tracking-tight text-slate-900">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>
    </>
  );
}

function renderStatusIcon(status: ReportStatus) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-amber-600" aria-hidden />;
    case "received":
      return <AlertCircle className="h-4 w-4 text-blue-600" aria-hidden />;
    case "in_progress":
      return <Wrench className="h-4 w-4 text-sky-600" aria-hidden />;
    case "resolved":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />;
    default:
      return <Clock className="h-4 w-4 text-slate-400" aria-hidden />;
  }
}

function getStatusBadgeClasses(status: ReportStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "received":
      return "bg-blue-50 text-blue-700";
    case "in_progress":
      return "bg-sky-50 text-sky-700";
    case "resolved":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

const STATUS_OPTIONS: ReportStatus[] = [
  "pending",
  "received",
  "in_progress",
  "resolved",
];

export function ReportsSection({
  reports,
  facilityNames,
  onCreateReport,
  onUpdateReport,
  canChangeStatus = true,
}: ReportsSectionProps) {
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [draftDate, setDraftDate] = useState("");
  const [draftFacilityName, setDraftFacilityName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftStatus, setDraftStatus] = useState<ReportStatus | null>(null);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchStatus =
        statusFilter === "all" ? true : report.status === statusFilter;

      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        query.length === 0
          ? true
          : report.id.toLowerCase().includes(query) ||
            report.facilityName.toLowerCase().includes(query) ||
            report.description.toLowerCase().includes(query);

      return matchStatus && matchQuery;
    });
  }, [reports, statusFilter, searchQuery]);

  const total = filteredReports.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedReports = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, safePage]);

  const facilityOptions = useMemo(
    () => facilityNames.map((name) => ({ label: name, value: name })),
    [facilityNames],
  );

  const openCreateModal = () => {
    setDraftDate("");
    setDraftFacilityName("");
    setDraftDescription("");
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openDetailModal = (report: Report) => {
    setSelectedReport(report);
    setDraftStatus(report.status);
  };

  const closeDetailModal = () => {
    setSelectedReport(null);
    setDraftStatus(null);
  };

  const canSaveCreate =
    draftDate.trim().length > 0 &&
    draftFacilityName.trim().length > 0 &&
    draftDescription.trim().length > 0;

  const handleSaveCreate = () => {
    if (!canSaveCreate) return;

    const newReport: Report = {
      id: getNextReportId(reports),
      date: draftDate.trim(),
      facilityName: draftFacilityName.trim(),
      description: draftDescription.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    onCreateReport(newReport);
    closeCreateModal();
  };

  const hasStatusChange =
    selectedReport != null &&
    draftStatus != null &&
    draftStatus !== selectedReport.status;

  const handleSaveStatus = () => {
    if (!selectedReport || !draftStatus || !hasStatusChange) return;
    onUpdateReport({ ...selectedReport, status: draftStatus });
    closeDetailModal();
  };

  return (
    <>
      <section className="flex min-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-[8px] border border-[#F1F5F9] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <SectionLabel>Reporting</SectionLabel>
              <h2 className="mt-1.5 text-[22px] font-semibold tracking-tight text-slate-900">
                Damage / Issue Reports
              </h2>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-end">
              <div className="relative">
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1);
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Search by ID, facility, description..."
                  className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-slate-300 md:w-[240px]"
                />
              </div>

              <FilterDropdown
                value={statusFilter}
                onChange={(next) => {
                  setPage(1);
                  setStatusFilter(next as "all" | ReportStatus);
                }}
                icon={<Filter className="h-4 w-4" />}
                options={[
                  { label: "All statuses", value: "all" },
                  ...STATUS_OPTIONS.map((status) => ({
                    label: formatReportStatusLabel(status),
                    value: status,
                  })),
                ]}
              />

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#208D26] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1b7a21]"
              >
                <Plus className="mr-2 h-4 w-4" />
                New report
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <thead className="bg-slate-50/70">
              <tr className="text-sm uppercase tracking-[0.05em] text-slate-500">
                <th className="min-w-[160px] px-6 py-3.5 font-semibold">
                  Facility
                </th>
                <th className="w-[130px] px-6 py-3.5 font-semibold">ID</th>
                <th className="w-[150px] px-6 py-3.5 font-semibold">Date</th>
                <th className="min-w-0 px-6 py-3.5 font-semibold">
                  Description
                </th>
                <th className="w-[160px] px-6 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <tr
                    key={report.id}
                    className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50/70"
                    onClick={() => openDetailModal(report)}
                  >
                    <td className="min-w-[160px] px-6 py-4 text-md text-slate-800">
                      <span className="truncate">{report.facilityName}</span>
                    </td>

                    <td className="w-[130px] px-6 py-4 text-sm font-semibold text-slate-700">
                      {report.id}
                    </td>

                    <td className="w-[150px] px-6 py-4 text-md text-slate-600">
                      {report.date}
                    </td>

                    <td className="min-w-0 px-6 py-4 text-md text-slate-600">
                      <span className="line-clamp-2">{report.description}</span>
                    </td>

                    <td className="w-[160px] px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold tracking-[0.02em]",
                          getStatusBadgeClasses(report.status),
                        )}
                      >
                        {/* {renderStatusIcon(report.status)} */}
                        {formatReportStatusLabel(report.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500">
                      No reports yet. Create a new report or try changing the
                      current filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              {total === 0
                ? "No reports"
                : `Showing ${(safePage - 1) * pageSize + 1}-${Math.min(safePage * pageSize, total)} of ${total}`}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage <= 1}
                className={cn(
                  "min-h-[38px] rounded-lg border px-3.5 text-sm font-semibold transition-colors",
                  safePage <= 1
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                Previous
              </button>

              <span className="min-w-[80px] text-center text-sm font-semibold text-slate-700">
                {safePage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={safePage >= totalPages}
                className={cn(
                  "min-h-[38px] rounded-lg border px-3.5 text-sm font-semibold transition-colors",
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

      {isCreateModalOpen ? (
        <ModalShell
          onClose={closeCreateModal}
          maxWidth="max-w-3xl min-h-[600px]"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-4">
                <section className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                  <div className="mb-3">
                    <SectionLabel>Report info</SectionLabel>
                    <h4 className="mt-1 text-base font-semibold text-slate-900">
                      Core Details
                    </h4>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField label="Date of issue">
                      <DatePicker
                        value={draftDate}
                        onChange={setDraftDate}
                        placeholder="Select date"
                        placement="bottom"
                      />
                    </FormField>

                    <FormField label="Facility">
                      <FilterDropdown
                        value={draftFacilityName}
                        onChange={setDraftFacilityName}
                        options={facilityOptions}
                        placeholder="Select facility"
                        icon={<Building2 className="h-4 w-4" />}
                        className="min-w-0"
                      />
                    </FormField>
                  </div>

                  <div className="mt-3">
                    <FormField label="Issue description">
                      <textarea
                        value={draftDescription}
                        onChange={(e) => setDraftDescription(e.target.value)}
                        placeholder="Describe the damage or issue..."
                        rows={5}
                        className="h-[350px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                      />
                    </FormField>
                  </div>
                </section>
              </div>

              <aside className="space-y-4">
                <section className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <SectionLabel>Default status</SectionLabel>
                  <h4 className="mt-1 text-base font-semibold text-slate-900">
                    Initial State
                  </h4>

                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-amber-700">
                      {renderStatusIcon("pending")}
                      {formatReportStatusLabel("pending")}
                    </span>
                  </div>
                </section>

                <section className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <SectionLabel>Summary</SectionLabel>
                  <h4 className="mt-1 text-base font-semibold text-slate-900">
                    Report Overview
                  </h4>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-500">Date</span>
                      <span className="text-right font-medium text-slate-800">
                        {draftDate || "—"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-500">Facility</span>
                      <span className="text-right font-medium text-slate-800">
                        {draftFacilityName || "—"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-500">Description</span>
                      <span className="line-clamp-3 max-w-[150px] text-right font-medium text-slate-800">
                        {draftDescription || "—"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-500">Status</span>
                      <span className="line-clamp-3 max-w-[150px] text-right font-medium text-slate-800">
                        {formatReportStatusLabel("pending")}
                      </span>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {canSaveCreate
                  ? "Ready to create report."
                  : "Fill all required fields to continue."}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveCreate}
                  disabled={!canSaveCreate}
                  className={cn(
                    "inline-flex min-h-[42px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors",
                    canSaveCreate
                      ? "bg-[#208D26] hover:bg-[#1b7a21]"
                      : "cursor-not-allowed bg-slate-200 text-slate-500",
                  )}
                >
                  Create report
                </button>
              </div>
            </div>
          </div>
        </ModalShell>
      ) : null}

      {selectedReport ? (
        <ModalShell onClose={closeDetailModal} maxWidth="max-w-2xl">
          <ModalHeader
            title="Report Details"
            subtitle="Review report information and update its current workflow status."
            onBack={closeDetailModal}
            onClose={closeDetailModal}
          />

          <div className="max-h-[calc(90vh-190px)] overflow-y-auto px-6 py-6">
            <div className="space-y-4">
              <section className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <SectionLabel>Report ID</SectionLabel>
                    <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <FileText className="h-4 w-4 text-slate-400" />
                      {selectedReport.id}
                    </div>
                  </div>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em]",
                      getStatusBadgeClasses(
                        draftStatus ?? selectedReport.status,
                      ),
                    )}
                  >
                    {renderStatusIcon(draftStatus ?? selectedReport.status)}
                    {formatReportStatusLabel(
                      draftStatus ?? selectedReport.status,
                    )}
                  </span>
                </div>
              </section>

              <section className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-3">
                  <SectionLabel>Report info</SectionLabel>
                  <h4 className="mt-1 text-base font-semibold text-slate-900">
                    Incident Details
                  </h4>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField label="Date">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {selectedReport.date}
                    </div>
                  </FormField>

                  <FormField label="Facility">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="truncate">
                        {selectedReport.facilityName}
                      </span>
                    </div>
                  </FormField>
                </div>

                <div className="mt-3">
                  <FormField label="Issue description">
                    <p className="text-sm leading-6 text-slate-800">
                      {selectedReport.description}
                    </p>
                  </FormField>
                </div>
              </section>

              {canChangeStatus ? (
                <section className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <div className="mb-3">
                    <SectionLabel>Workflow</SectionLabel>
                    <h4 className="mt-1 text-base font-semibold text-slate-900">
                      Update Status
                    </h4>
                  </div>

                  <FormField label="Current status">
                    <FilterDropdown
                      value={draftStatus ?? selectedReport.status}
                      onChange={(next) => setDraftStatus(next as ReportStatus)}
                      options={STATUS_OPTIONS.map((status) => ({
                        label: formatReportStatusLabel(status),
                        value: status,
                      }))}
                      icon={renderStatusIcon(
                        draftStatus ?? selectedReport.status,
                      )}
                      className="min-w-0"
                    />
                  </FormField>
                </section>
              ) : null}
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                {hasStatusChange
                  ? "Status changes are ready to save."
                  : "No unsaved changes."}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDetailModal}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Close
                </button>

                {canChangeStatus ? (
                  <button
                    type="button"
                    onClick={handleSaveStatus}
                    disabled={!hasStatusChange}
                    className={cn(
                      "inline-flex min-h-[42px] items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors",
                      hasStatusChange
                        ? "bg-[#208D26] hover:bg-[#1b7a21]"
                        : "cursor-not-allowed bg-slate-200 text-slate-500",
                    )}
                  >
                    Save status
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </ModalShell>
      ) : null}
    </>
  );
}
