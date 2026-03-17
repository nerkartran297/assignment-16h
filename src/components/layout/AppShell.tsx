"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import { CurrentUserProvider } from "@/contexts/CurrentUserContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { sidebarItems } from "@/features/bookings/booking.data";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CurrentUserProvider>
      <main className="min-h-screen bg-[#f3f5f7] text-[#0F172A]">
        <Sidebar items={sidebarItems} />
        <div className="ml-[248px]">
          <section className="min-w-0 px-4 py-4 md:px-6 md:py-5 xl:px-7 xl:py-6">
            <div className="mx-auto rounded-lg bg-[#f6f7f9]">
              <Suspense
                fallback={
                  <div className="mb-6 h-[50px] rounded-[8px] border border-[#dbe1e8] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]" />
                }
              >
                <Topbar />
              </Suspense>
              {children}
            </div>
          </section>
        </div>
      </main>
    </CurrentUserProvider>
  );
}

