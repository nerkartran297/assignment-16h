"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCurrentUser, formatRoleLabel } from "@/contexts/CurrentUserContext";
import { NotificationMenu } from "@/components/layout/NotificationMenu";
import { UserControl } from "@/components/layout/UserControl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Topbar() {
  const { currentUser } = useCurrentUser();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const displayName = currentUser?.name ?? "Guest";
  const displayRole = currentUser ? formatRoleLabel(currentUser.role) : "No account";
  const initials = currentUser
    ? currentUser.name
        .split(/\s+/)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "—";

  const setQuery = (next: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.trim().length === 0) params.delete("q");
    else params.set("q", next);
    const qs = params.toString();
    router.replace(qs.length ? `${pathname}?${qs}` : pathname);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsUserOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (event.target instanceof Node && root.contains(event.target)) return;
      setIsNotificationsOpen(false);
      setIsUserOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const notificationItems = useMemo(
    () => [
      {
        id: "n1",
        title: "New booking request",
        description: "Birch Meditation Hut · Marcus Arvidson",
        time: "2m ago",
        unread: true,
      },
      {
        id: "n2",
        title: "Booking updated",
        description: "Old Oak Forest Trail moved to 01:30 PM",
        time: "1h ago",
        unread: false,
      },
      {
        id: "n3",
        title: "Capacity alert",
        description: "Zen Garden Deck reached 72% weekly usage",
        time: "Yesterday",
        unread: true,
      },
    ],
    [],
  );

  return (
    <header
      ref={rootRef}
      className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:items-center">
        <div className="group flex h-[50px] flex-1 items-center rounded-[8px] border border-[#dbe1e8] bg-white px-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-150 hover:border-[#cbd5e1] hover:bg-[#fcfdff] focus-within:border-[#cbd5e1] focus-within:bg-[#fcfdff]">
          <span className="mr-3 text-[#94a3b8] transition-colors duration-150 group-hover:text-[#64748b] group-focus-within:text-[#64748b]">
            <SearchIcon className="h-5 w-5" />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search facilities, users, or bookings..."
            className="w-full bg-transparent text-[15px] text-[#334155] outline-none placeholder:text-[#94a3b8]"
          />
        </div>

        <Link
          href="/reports"
          className="inline-flex h-[50px] items-center justify-center rounded-[8px] border border-[#dbe1e8] bg-white px-6 text-[15px] font-semibold text-[#334155] shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-150 hover:border-[#cbd5e1] hover:bg-[#fcfdff] hover:text-[#0f172a] active:bg-[#f8fafc] focus:outline-none"
        >
          View Reports
        </Link>
      </div>

      <div className="flex items-center justify-end gap-4">
        <NotificationMenu
          isOpen={isNotificationsOpen}
          onToggle={() => {
            setIsNotificationsOpen((v) => !v);
            setIsUserOpen(false);
          }}
          onClose={() => setIsNotificationsOpen(false)}
          items={notificationItems}
        />

        <div className="h-8 w-[2px] bg-[#e5e7eb]" />

        <UserControl
          isOpen={isUserOpen}
          onToggle={() => {
            setIsUserOpen((v) => !v);
            setIsNotificationsOpen(false);
          }}
          onClose={() => setIsUserOpen(false)}
          name={displayName}
          role={displayRole}
          initials={initials}
        />
      </div>
    </header>
  );
}
