import Link from "next/link";
import {
  Gavel,
  Map,
  Users,
  ClipboardList,
  FileText,
  ArrowRight,
  Building2,
  UserPlus,
  CalendarPlus,
  AlertCircle,
  Info,
} from "lucide-react";

export const metadata = {
  title: "Booking Rules | Forestince",
  description:
    "How to create and manage facilities, bookings, users, and reports on Forestince.",
};

export default function BookingRulesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#208D26]/10 text-[#208D26]">
            <Gavel className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Booking Rules & Workflows
            </h1>
            <p className="mt-1 text-slate-600">
              How to set up and manage facilities, users, bookings, and reports
              on the Nature Campus.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-8 space-y-10">
        {/* Flow overview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Overall flow
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Set up facilities and users first, then create and manage bookings.
            Use reports to track issues and maintenance.
          </p>
          <ol className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-stretch">
            {[
              {
                step: 1,
                label: "Facilities",
                desc: "Add and manage venues (huts, baths, trails, decks, pods).",
                href: "/facilities",
                icon: Map,
              },
              {
                step: 2,
                label: "Users",
                desc: "Register staff, managers, and admins with roles and companies.",
                href: "/users",
                icon: Users,
              },
              {
                step: 3,
                label: "Bookings",
                desc: "Create and manage reservation requests and status.",
                href: "/requests",
                icon: ClipboardList,
              },
              {
                step: 4,
                label: "Reports",
                desc: "Log facility issues and track workflow (e.g. pending → resolved).",
                href: "/reports",
                icon: FileText,
              },
            ].map(({ step, label, desc, href, icon: Icon }) => (
              <li key={step} className="flex flex-1 min-w-[200px]">
                <Link
                  href={href}
                  className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-colors hover:border-[#208D26]/40 hover:bg-emerald-50/30"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#208D26]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#208D26]/15 text-xs">
                      {step}
                    </span>
                    {label}
                  </span>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#208D26]">
                    Open <Icon className="h-3.5 w-3.5" />
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* Rules — why things work this way */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Rules & why they exist
              </h2>
              <p className="text-sm text-slate-600">
                These rules keep the campus fair, safe, and easy to manage.
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-semibold text-amber-700">1.</span>
              <span>
                <strong>Facilities first.</strong> You must create facilities
                before anyone can book them. Only <strong>active</strong> facilities
                show in booking dropdowns—so you can temporarily hide a venue
                (e.g. under repair) without losing its data.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-semibold text-amber-700">2.</span>
              <span>
                <strong>Users and companies.</strong> Every booking is tied to an
                employee and a company. Roles (Super Admin, Admin, Manager,
                Staff, Guest) control who can see and change what: e.g. admins
                see only their company’s bookings; staff see only their own. This
                keeps data visible only to the right people.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-semibold text-amber-700">3.</span>
              <span>
                <strong>No overbooking.</strong> The same facility cannot be
                booked twice on the same date (cancelled bookings don’t block).
                This avoids double reservations and conflicts.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-semibold text-amber-700">4.</span>
              <span>
                <strong>Capacity limits.</strong> Each facility has a maximum
                capacity. The number of attendees on a booking cannot exceed
                that capacity—so you don’t exceed fire or safety limits.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-semibold text-amber-700">5.</span>
              <span>
                <strong>Booking status flow.</strong> New bookings start as
                <strong> Pending</strong>. They can move to Confirmed, Cancelled,
                or Completed. Who can change status depends on role (e.g.
                admins/managers often confirm; staff may only request). This
                keeps approval and tracking clear.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 font-semibold text-amber-700">6.</span>
              <span>
                <strong>Reports are separate from bookings.</strong> Reports
                record damage or issues at a facility (date, description,
                status). They don’t create or cancel bookings—they help
                maintenance and safety so issues get fixed and tracked.
              </span>
            </li>
          </ul>
        </section>

        {/* Facilities */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Managing facilities
              </h2>
              <p className="text-sm text-slate-600">
                Facilities are the bookable venues (huts, baths, trails, decks,
                pods).
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                <strong>Create:</strong> Go to Facilities → &quot;New facility&quot; →
                enter name, type, capacity, location, and status (active /
                inactive).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                <strong>Edit:</strong> Click a facility row to open the detail
                modal, then change fields and &quot;Save changes&quot;.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                Only <strong>active</strong> facilities appear for booking;
                set status to inactive to hide without deleting.
              </span>
            </li>
          </ul>
          <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
              Why
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Facilities must exist before they can be chosen in a booking. Keeping
              inactive facilities hidden (instead of deleting) preserves history and
              lets you re-open a venue later without re-entering everything.
            </p>
          </div>
          <Link
            href="/facilities"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Open Facilities <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Users */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Managing users
              </h2>
              <p className="text-sm text-slate-600">
                Users have roles (e.g. Super Admin, Admin, Manager, Staff,
                Guest) and belong to a company.
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                <strong>Create:</strong> Users → &quot;New user&quot; → enter name,
                email, company, role, and status.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                <strong>Edit:</strong> Click a user row to open the detail modal
                and update details or status.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                Role and company determine what bookings and data each user can
                see (e.g. admins by company, staff by their own bookings).
              </span>
            </li>
          </ul>
          <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
              Why
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Bookings are linked to an employee name and company. The system uses
              your role and company to filter what you see—so staff only see their
              own requests, admins see their company’s, and super admins see all.
              This protects privacy and keeps responsibilities clear.
            </p>
          </div>
          <Link
            href="/users"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Open Users <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Bookings */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Managing bookings
              </h2>
              <p className="text-sm text-slate-600">
                Bookings link a facility, employee, company, date, time, and
                purpose. Status: Pending → Confirmed / Cancelled / Completed.
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                <strong>Create:</strong> All Bookings (or Dashboard) →
                &quot;New booking&quot; → choose facility, employee, company, date,
                time, attendees, purpose. New requests start as Pending.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                <strong>Edit / status:</strong> Click a booking to open the
                detail modal. Change details (if allowed) or update status to
                Confirmed, Cancelled, or Completed.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                Capacity and double-booking checks apply: attendees cannot
                exceed facility capacity, and the same facility cannot be
                double-booked on the same date (except cancelled).
              </span>
            </li>
          </ul>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Why
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <strong>No double-booking:</strong> one facility, one date—one booking
              (cancelled ones don’t block). <strong>Capacity:</strong> attendees cannot
              exceed the facility’s max capacity, so we stay within safety and
              fire rules. New bookings start as Pending so someone with the right
              role can confirm or cancel.
            </p>
          </div>
          <Link
            href="/requests"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Open All Bookings <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Reports */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Managing reports
              </h2>
              <p className="text-sm text-slate-600">
                Reports log facility issues (damage, maintenance). Each report
                has a date, facility, description, and status.
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                <strong>Create:</strong> Reports → &quot;New report&quot; → set date
                of issue, facility, and description. New reports start as
                Pending.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                <strong>Update status:</strong> Open a report to move it to In
                progress or Resolved as maintenance is done.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              <span>
                Use filters and search to find reports by facility, date, or
                status.
              </span>
            </li>
          </ul>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Why
            </p>
            <p className="mt-1 text-sm text-slate-700">
              Reports are for damage and maintenance—not for creating or changing
              bookings. Tracking status (Pending → In progress → Resolved) makes
              it clear what’s been fixed and what still needs attention, so
              facilities stay safe and usable.
            </p>
          </div>
          <Link
            href="/reports"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Open Reports <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
