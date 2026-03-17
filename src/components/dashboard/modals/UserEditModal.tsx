"use client";

import type { AppUser, UserRole } from "@/features/users/user.types";
import { cn } from "@/lib/cn";
import { FormField } from "@/components/UI/FormField";
import { FilterDropdown } from "../FilterDropdown";
import { ArrowLeft, X } from "lucide-react";

export interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  editing: AppUser | null;
  draftName: string;
  setDraftName: (v: string) => void;
  draftEmail: string;
  setDraftEmail: (v: string) => void;
  draftCompany: string;
  setDraftCompany: (v: string) => void;
  draftRole: UserRole;
  setDraftRole: (v: UserRole) => void;
  draftStatus: "active" | "inactive";
  setDraftStatus: (v: "active" | "inactive") => void;
  hasChanges: boolean;
  onSave: () => void;
  renderRoleIcon: (role: UserRole) => React.ReactNode;
  renderStatusIcon: (status: "active" | "inactive") => React.ReactNode;
  formatRoleLabel: (role: UserRole) => string;
}

export function UserEditModal({
  open,
  onClose,
  editing,
  draftName,
  setDraftName,
  draftEmail,
  setDraftEmail,
  draftCompany,
  setDraftCompany,
  draftRole,
  setDraftRole,
  draftStatus,
  setDraftStatus,
  hasChanges,
  onSave,
  renderRoleIcon,
  renderStatusIcon,
  formatRoleLabel,
}: UserEditModalProps) {
  if (!open || !editing) return null;

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
            Edit User
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
                  <FormField label="Full Name">
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                    />
                  </FormField>

                  <FormField label="Email">
                    <input
                      type="email"
                      value={draftEmail}
                      onChange={(e) => setDraftEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                    />
                  </FormField>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <FormField label="Company">
                    <input
                      value={draftCompany}
                      onChange={(e) => setDraftCompany(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-slate-300"
                    />
                  </FormField>

                  <FormField label="Role">
                    <FilterDropdown
                      value={draftRole}
                      onChange={(next) => setDraftRole(next as UserRole)}
                      options={[
                        { label: "Super Admin", value: "super_admin" },
                        { label: "Admin", value: "admin" },
                        { label: "Manager", value: "manager" },
                        { label: "Staff", value: "staff" },
                        { label: "Guest", value: "guest" },
                      ]}
                      icon={renderRoleIcon(draftRole)}
                      className="min-w-0"
                    />
                  </FormField>
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <section className="rounded-[22px] border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  User Status
                </p>
                <h4 className="mt-1 text-base font-semibold text-slate-900">
                  Current State
                </h4>

                <div className="mt-4">
                  <FilterDropdown
                    value={draftStatus}
                    onChange={(next) =>
                      setDraftStatus(next as "active" | "inactive")
                    }
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                    ]}
                    icon={renderStatusIcon(draftStatus)}
                    className="min-w-0"
                  />
                </div>
              </section>

              <section className="rounded-[22px] border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Summary
                </p>
                <h4 className="mt-1 text-base font-semibold text-slate-900">
                  User Overview
                </h4>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-500">Name</span>
                    <span className="text-right font-medium text-slate-800">
                      {draftName || "—"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-500">Email</span>
                    <span className="text-right font-medium text-slate-800">
                      {draftEmail || "—"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-500">Company</span>
                    <span className="text-right font-medium text-slate-800">
                      {draftCompany || "—"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-500">Role</span>
                    <span className="text-right font-medium text-slate-800">
                      {formatRoleLabel(draftRole)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-500">User ID</span>
                    <span className="text-right font-medium text-slate-800">
                      {editing.id}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-500">User Status</span>
                    <span className="text-right font-medium text-slate-800">
                      {draftStatus === "active" ? "Active" : "Inactive"}
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
              {hasChanges
                ? "You have unsaved changes."
                : "No changes to save."}
            </p>
            <button
              type="button"
              onClick={onSave}
              disabled={!hasChanges}
              className={cn(
                "inline-flex min-h-[42px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
                hasChanges
                  ? "bg-[#208D26] text-white hover:bg-emerald-800"
                  : "cursor-not-allowed bg-slate-200 text-slate-500",
              )}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
