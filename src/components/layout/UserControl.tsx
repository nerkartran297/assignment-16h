"use client";

import { useRef, useState } from "react";
import { LogOutIcon, UserIcon, UserRoundCogIcon, X } from "lucide-react";
import { useCurrentUser, formatRoleLabel } from "@/contexts/CurrentUserContext";
import type { AppUser } from "@/features/users/user.types";
import { cn } from "@/lib/cn";

export interface UserControlProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  name: string;
  role: string;
  initials: string;
  onMyProfile?: () => void;
  onLogout?: () => void;
}

export function UserControl({
  isOpen,
  onToggle,
  onClose,
  name,
  role,
  initials,
  onMyProfile,
  onLogout,
}: UserControlProps) {
  const { currentUser, setCurrentUser, users, isLoadingUsers } =
    useCurrentUser();
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const openSwitchModal = () => {
    onClose();
    setIsSwitchModalOpen(true);
  };

  const handleSelectUser = (user: AppUser) => {
    setCurrentUser(user);
    setIsSwitchModalOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={onToggle}
          className="flex h-[50px] w-[200px] items-center justify-end gap-3 rounded-[8px] border border-transparent px-3 py-1 text-left transition-all duration-150 hover:border-[#e5e7eb] hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bbf7d0]"
        >
          <div className="min-w-0 text-right">
            <p className="text-[14px] font-semibold leading-5 text-[#0f172a]">
              {name}
            </p>
            <p className="text-sm text-[#64748b]">{role}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6c28b] text-sm font-semibold text-[#7c2d12]">
            {initials}
          </div>
        </button>

        {isOpen ? (
          <div
            role="menu"
            className="absolute right-0 top-[56px] z-50 w-[240px] overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          >
            <div className="py-2">
              <button
                type="button"
                role="menuitem"
                onClick={openSwitchModal}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#0f172a] transition-colors hover:bg-[#f8fafc] focus:outline-none"
              >
                <UserRoundCogIcon className="h-4 w-4 text-[#64748b]" />
                Switch account
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onMyProfile?.();
                  onClose();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#0f172a] transition-colors hover:bg-[#f8fafc] focus:outline-none"
              >
                <UserIcon className="h-4 w-4 text-[#64748b]" />
                My profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#991b1b] transition-colors hover:bg-[#fef2f2] focus:outline-none"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {isSwitchModalOpen ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSwitchModalOpen(false);
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="switch-account-title"
            className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-[#e5e7eb] bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
              <h2
                id="switch-account-title"
                className="text-lg font-semibold text-[#0f172a]"
              >
                Switch account
              </h2>
              <button
                type="button"
                onClick={() => setIsSwitchModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              {isLoadingUsers ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Loading users…
                </p>
              ) : users.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  No users found.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {users.map((user) => {
                    const isActive = currentUser?.id === user.id;
                    const uInitials = user.name
                      .split(/\s+/)
                      .map((p) => p[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectUser(user)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors",
                          isActive
                            ? "border-[#208D26] bg-[#208D2614] ring-1 ring-[#208D26]"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold",
                            isActive
                              ? "bg-[#208D26] text-white"
                              : "bg-slate-200 text-slate-700",
                          )}
                        >
                          {uInitials}
                        </div>
                        <span className="truncate text-sm font-medium text-[#0f172a] w-full">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatRoleLabel(user.role)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
