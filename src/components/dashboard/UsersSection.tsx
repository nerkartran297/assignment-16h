"use client";

import { useMemo, useState } from "react";
import type { AppUser, UserRole } from "@/features/users/user.types";
import { cn } from "@/lib/cn";
import { FilterDropdown } from "./FilterDropdown";
import { UserCreateModal } from "./modals/UserCreateModal";
import { UserEditModal } from "./modals/UserEditModal";
import {
  SearchIcon,
  Filter,
  ShieldCheck,
  User2,
  BriefcaseBusiness,
  Building2,
  Mail,
  CircleUserRound,
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";

export interface UsersSectionProps {
  users: AppUser[];
  allUsers: AppUser[];
  selectedUser: AppUser | null;
  onSelectUser: (id: string | null) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (value: "all" | "active" | "inactive") => void;
  roleFilter: "all" | UserRole;
  onRoleFilterChange: (value: "all" | UserRole) => void;
  onCreateUser: (user: AppUser) => void;
  onUpdateUser: (user: AppUser) => void;
  onDeleteUser: (id: string) => void;
}

function renderRoleIcon(role: UserRole) {
  switch (role) {
    case "super_admin":
      return <ShieldCheck className="h-5 w-5 text-amber-600" aria-hidden />;
    case "admin":
      return <ShieldCheck className="h-5 w-5" aria-hidden />;
    case "manager":
      return <BriefcaseBusiness className="h-5 w-5" aria-hidden />;
    case "staff":
      return <User2 className="h-5 w-5" aria-hidden />;
    case "guest":
    default:
      return <CircleUserRound className="h-5 w-5" aria-hidden />;
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

function getRoleBadgeClasses(role: UserRole) {
  switch (role) {
    case "super_admin":
      return "bg-amber-50 text-amber-800";
    case "admin":
      return "bg-violet-50 text-violet-700";
    case "manager":
      return "bg-sky-50 text-sky-700";
    case "staff":
      return "bg-emerald-50 text-emerald-700";
    case "guest":
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getStatusClasses(status: "active" | "inactive") {
  return status === "active"
    ? "bg-[#DCFCE7] text-[#166534]"
    : "bg-slate-100 text-slate-600";
}

function formatRoleLabel(role: UserRole) {
  switch (role) {
    case "super_admin":
      return "S.Admin";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "staff":
      return "Staff";
    case "guest":
    default:
      return "Guest";
  }
}

export function UsersSection({
  users,
  selectedUser,
  onSelectUser,
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  onCreateUser,
  onUpdateUser,
}: UsersSectionProps) {
  const pageSize = 8;
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editing, setEditing] = useState<AppUser | null>(null);

  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftCompany, setDraftCompany] = useState("");
  const [draftRole, setDraftRole] = useState<UserRole>("staff");
  const [draftStatus, setDraftStatus] = useState<"active" | "inactive">(
    "active",
  );

  const resetCreateDraft = () => {
    setDraftName("");
    setDraftEmail("");
    setDraftCompany("");
    setDraftRole("staff");
    setDraftStatus("active");
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

  const openDetailModal = (user: AppUser) => {
    setEditing(user);
    setDraftName(user.name);
    setDraftEmail(user.email);
    setDraftCompany(user.company);
    setDraftRole(user.role);
    setDraftStatus(user.status);
    onSelectUser(user.id);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
  };

  const total = users.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, safePage]);

  const canSaveCreate =
    draftName.trim().length > 0 &&
    draftEmail.trim().length > 0 &&
    draftCompany.trim().length > 0;

  const hasChanges =
    editing !== null &&
    (draftName !== editing.name ||
      draftEmail !== editing.email ||
      draftCompany !== editing.company ||
      draftRole !== editing.role ||
      draftStatus !== editing.status);

  const handleSaveCreate = () => {
    if (!canSaveCreate) return;

    const nextId = `USR-${String(Date.now()).slice(-4)}`;

    onCreateUser({
      id: nextId,
      name: draftName.trim(),
      email: draftEmail.trim(),
      company: draftCompany.trim(),
      role: draftRole,
      status: draftStatus,
    });

    closeCreateModal();
  };

  const handleSaveChanges = () => {
    if (!editing || !hasChanges) return;

    onUpdateUser({
      ...editing,
      name: draftName.trim(),
      email: draftEmail.trim(),
      company: draftCompany.trim(),
      role: draftRole,
      status: draftStatus,
    });

    closeDetailModal();
  };

  return (
    <>
      <section className="flex min-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-[8px] border border-[#F1F5F9] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-200/80 px-5 py-5 md:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-[#0F172A] md:text-2xl">
              All Users
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
                  placeholder="Search users…"
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
                    value={roleFilter}
                    onChange={(next) => {
                      setPage(1);
                      onRoleFilterChange(next as "all" | UserRole);
                    }}
                    icon={<User2 className="h-4 w-4" />}
                    options={[
                      { label: "All roles", value: "all" },
                      { label: "Super Admin", value: "super_admin" },
                      { label: "Admin", value: "admin" },
                      { label: "Manager", value: "manager" },
                      { label: "Staff", value: "staff" },
                      { label: "Guest", value: "guest" },
                    ]}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(4,120,87,0.18)] transition-all duration-200 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              >
                New User
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-[13px] uppercase tracking-[0.05em] text-slate-500">
                <th className="px-5 py-3.5 font-semibold md:px-6">User</th>
                <th className="w-[120px] px-5 py-3.5 font-semibold md:px-6">
                  ID
                </th>
                <th className="w-[240px] px-5 py-3.5 font-semibold md:px-6">
                  Email
                </th>
                <th className="w-[200px] px-5 py-3.5 font-semibold md:px-6">
                  Company
                </th>
                <th className="w-[140px] px-5 py-3.5 font-semibold md:px-6">
                  Role
                </th>
                <th className="w-[140px] px-5 py-3.5 font-semibold md:px-6">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => {
                  const isSelected = user.id === selectedUser?.id;

                  return (
                    <tr
                      key={user.id}
                      className={cn(
                        "cursor-pointer border-t border-slate-100 transition-colors duration-200 hover:bg-slate-50/70",
                        isSelected ? "bg-slate-50" : "hover:bg-slate-50/60",
                      )}
                      onClick={() => openDetailModal(user)}
                    >
                      <td className="px-5 py-4 md:px-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailModal(user);
                          }}
                          className="group w-full cursor-pointer rounded-lg text-left focus-visible:outline-none"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#208D261A] text-sm text-[#208D26]">
                              {renderRoleIcon(user.role)}
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
                                {user.name}
                              </p>
                              <p className="mt-0.5 truncate text-md text-[#64748B]">
                                {formatRoleLabel(user.role)}
                              </p>
                            </div>
                          </div>
                        </button>
                      </td>

                      <td className="w-[120px] px-5 py-4 text-sm font-semibold text-slate-600 md:px-6">
                        {user.id}
                      </td>

                      <td className="w-[240px] px-5 py-4 text-md text-[#475569] md:px-6">
                        <div className="flex min-w-0 items-center gap-2">
                          <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </td>

                      <td className="w-[200px] px-5 py-4 text-md text-[#64748B] md:px-6">
                        <div className="flex min-w-0 items-center gap-2">
                          <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                          <span className="truncate">{user.company}</span>
                        </div>
                      </td>

                      <td className="w-[140px] px-5 py-4 md:px-6">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold tracking-[0.02em]",
                            getRoleBadgeClasses(user.role),
                          )}
                        >
                          {formatRoleLabel(user.role)}
                        </span>
                      </td>

                      <td className="w-[140px] px-5 py-4 md:px-6">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold tracking-[0.02em]",
                            getStatusClasses(user.status),
                          )}
                        >
                          {user.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 md:px-6">
                    <div className="w-full rounded-lg bg-white px-5 py-6">
                      <p className="text-lg text-center font-semibold text-slate-900">
                        No matching users
                      </p>
                      <p className="mt-1.5 text-md text-center text-slate-500">
                        Please try to adjust the filters to see more users.
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
                ? "No users to display."
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

      <UserCreateModal
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        draftName={draftName}
        setDraftName={setDraftName}
        draftEmail={draftEmail}
        setDraftEmail={setDraftEmail}
        draftCompany={draftCompany}
        setDraftCompany={setDraftCompany}
        draftRole={draftRole}
        setDraftRole={setDraftRole}
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        canSave={canSaveCreate}
        onSave={handleSaveCreate}
        renderRoleIcon={renderRoleIcon}
        renderStatusIcon={renderStatusIcon}
        formatRoleLabel={formatRoleLabel}
      />

      <UserEditModal
        open={isModalOpen}
        onClose={closeDetailModal}
        editing={editing}
        draftName={draftName}
        setDraftName={setDraftName}
        draftEmail={draftEmail}
        setDraftEmail={setDraftEmail}
        draftCompany={draftCompany}
        setDraftCompany={setDraftCompany}
        draftRole={draftRole}
        setDraftRole={setDraftRole}
        draftStatus={draftStatus}
        setDraftStatus={setDraftStatus}
        hasChanges={hasChanges}
        onSave={handleSaveChanges}
        renderRoleIcon={renderRoleIcon}
        renderStatusIcon={renderStatusIcon}
        formatRoleLabel={formatRoleLabel}
      />
    </>
  );
}
