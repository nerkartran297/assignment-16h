"use client";

import {
  LayoutDashboard,
  ClipboardList,
  Map,
  Gavel,
  Layers3,
  Users,
  FileText,
  Settings,
  Trees,
} from "lucide-react";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarProps {
  items: string[];
}

const itemIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Dashboard: LayoutDashboard,
  "All Bookings": ClipboardList,
  Facilities: Map,
  "Booking Rules": Gavel,
  "GeooSON Layers": Layers3,
  "GeoSON Layers": Layers3,
  Users: Users,
  Reports: FileText,
  Settings: Settings,
};

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  const getHref = (item: string) => {
    if (item === "Dashboard") return "/";
    if (item === "All Bookings") return "/requests";
    if (item === "Facilities") return "/facilities";
    if (item === "Booking Rules") return "/booking-rules";
    if (item === "Users") return "/users";
    if (item === "Reports") return "/reports";
    if (item === "Settings") return "/settings";
    return "/coming-soon";
  };

  return (
    <aside className="fixed flex h-screen w-[248px] flex-col border-r border-white/6 bg-[#071735] text-white">
      <div className="px-7 pb-6 pt-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1db954] text-white">
            <Trees className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div className="min-w-0">
            <p className="text-[17px] font-semibold leading-5 text-white">
              Forestince
            </p>
            <p className="mt-0.5 text-[13px] leading-5 text-slate-400">
              Nature Campus Admin
            </p>
          </div>
        </div>
      </div>

      <nav className="px-5">
        <div className="space-y-1.5">
          {items.map((item, index) => {
            const href = getHref(item);
            const active =
              href === "/coming-soon"
                ? index === 0
                : pathname === href || pathname.startsWith(`${href}/`);
            const Icon = itemIconMap[item] ?? FileText;

            return (
              <Link
                key={item}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex h-12 w-full items-center justify-between rounded-xl px-4 text-left transition-colors duration-150",
                  active
                    ? "bg-[linear-gradient(90deg,rgba(18,87,72,0.55),rgba(10,49,73,0.32))] text-[#22c55e]"
                    : "text-slate-300 hover:bg-white/3 hover:text-white",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0",
                      active
                        ? "text-[#22c55e]"
                        : "text-slate-300 transition-colors group-hover:text-white",
                    )}
                  />
                  <span className="text-[15px] font-medium">{item}</span>
                </span>

                {active ? (
                  <span className="h-8 w-1 rounded-full bg-[#22c55e]" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="pointer-events-none absolute inset-x-0 bottom-[86px] h-px bg-white/8" />

      <div className="absolute inset-x-0 bottom-0 px-5 py-4">
        <button
          type="button"
          className="group flex h-12 w-full items-center gap-3 rounded-xl px-4 text-left text-slate-300 transition-colors duration-150 hover:bg-white/3 hover:text-white"
        >
          <Settings
            className="h-[18px] w-[18px] text-slate-300 transition-colors group-hover:text-white"
            strokeWidth={2}
          />
          <span className="text-[15px] font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
