import { cn } from "@/lib/cn";
import {
  CalendarClockIcon,
  CalendarIcon,
  UserRoundCheckIcon,
  TentTreeIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: "book" | "facility" | "user" | "request";
  badge?: string;
  badgeTone?: "green" | "amber";
  href: string;
}

export function StatCard({
  title,
  value,
  badge,
  badgeTone = "green",
  icon,
  href,
}: StatCardProps) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(href)}
      className="rounded-lg border hover:cursor-pointer border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_14px_30px_rgba(15,23,42,0.04)] transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg text-base",
            icon === "request" && "bg-[#FEF3C7] text-[#B45309]",
            icon !== "request" && " bg-[#208D261A] text-[#208D26]",
          )}
        >
          {icon === "book" && <CalendarIcon className="h-6 w-6" />}
          {icon === "facility" && <TentTreeIcon className="h-6 w-6" />}
          {icon === "user" && <UserRoundCheckIcon className="h-6 w-6" />}
          {icon === "request" && <CalendarClockIcon className="h-6 w-6" />}
        </div>
        {badge ? (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-[15px] font-semibold tracking-[0.02em]",
              badgeTone === "green"
                ? " bg-emerald-50 text-emerald-700"
                : " bg-amber-50 text-amber-700",
            )}
          >
            {badge}
          </span>
        ) : null}
      </div>

      <p className="text-[16px] font-medium text-[#64748b]">{title}</p>
      <p
        className={`mt-0 text-[2rem] font-semibold tracking-tight ${icon === "request" ? "text-[#B45309]" : "text-[#0F172A]"} md:text-[2.15rem]`}
      >
        {value}
      </p>
    </div>
  );
}
