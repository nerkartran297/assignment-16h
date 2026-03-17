# Forestince – Nature Campus Admin

A full-stack web app for managing facilities, users, bookings, and damage/maintenance reports. Built with Next.js, React, MongoDB, and Tailwind, with a focus on clear structure, maintainable UI, and realistic product flows.

---

## Overview

**Forestince** is a facility management dashboard where:

- **Admins** can:
  - Manage **facilities** (create, edit, set active/inactive)
  - Manage **users** (create, edit, assign role and company)
  - View and manage **all bookings** (create, edit, update status: Pending → Confirmed / Cancelled / Completed)
  - Track **reports** (damage/maintenance issues with status: Pending → Received → In progress → Resolved)

- **Role-based visibility**: A simulated current user (via `CurrentUserContext`) drives what each role sees—e.g. staff see their own bookings, admins see their company’s, super admins see everything.

- **Backend**: Next.js API routes (`/api/bookings`, `/api/facilities`, `/api/users`, `/api/reports`) with **MongoDB** for persistence. Data is real, not mocked.

---

## UI Implementation

### 1. Component structure

- **Pages** (`/app/*`)
  - Compose high-level clients/sections and handle routing only.

- **Dashboard sections**
  - `RequestsSection` – All Bookings (filters, table, create/edit modals)
  - `FacilitiesSection` – Facilities (table, create/edit modals)
  - `UsersSection` – Users (table, create/edit modals)
  - `ReportsSection` – Reports (table, create/detail modals)
  - `RecentBookingsTable` – Recent bookings on the home page
  - `FacilityUsageCard`, `CampusMapCard`, `StatCard` – Dashboard widgets

- **Modals** (`/components/dashboard/modals/`)
  - Extracted by area: `FacilityCreateModal`, `FacilityEditModal`, `UserCreateModal`, `UserEditModal`, `RequestCreateModal`, `RequestEditModal`. Section pages stay thin and pass props.

- **Reusable UI**
  - `FilterDropdown`, `DatePicker`, `TimeInput`, `FormField`
  - Shared modal patterns (overlay, header, form, footer)

Goal: avoid large “god components”; keep each unit focused.

---

### 2. Layout

- **Sidebar** (fixed) – Nav: Dashboard, All Bookings, Facilities, Booking Rules, GeoJSON Layers, Users, Reports, Settings.
- **Main content** – Table-based management plus filters and actions.
- **Modals** for create, edit, and detail (no separate detail pages for list items).
- **Design** – Soft surfaces (`bg-slate-50`, `bg-white`), consistent spacing, card grouping inside modals.

---

### 3. Responsive behavior

- Mobile: stacked filters, flexible grids.
- Desktop: split layouts (main + sidebar/modals).
- Tables scroll horizontally when needed.

---

### 4. State

State is **React local state** (and one context):

- **CurrentUserContext** – Simulated current user (name, company, role) for role-based UI. No full auth (no login/logout).
- **Local state** in sections: filters, pagination, modal open/closed, form drafts, selected row.

No Redux/Zustand; scope kept minimal and FE-first.

---

### 5. UI choices

- Custom `FilterDropdown` instead of native `<select>` for consistent look.
- Custom `DatePicker` and `TimeInput` for consistent behavior.
- Modal workflows for create/edit for speed and clarity.
- Status changes via dropdown (e.g. booking status, report status) instead of fixed Approve/Reject only.

---

## Architecture and data flow

### 1. Project structure

```
src/
  app/
    api/              # Next.js API routes (bookings, facilities, users, reports)
    booking-rules/    # Booking rules & workflows help page
    facilities/       # Facilities page
    reports/          # Reports page
    requests/         # All Bookings page
    users/            # Users page
    page.tsx          # Dashboard home
    layout.tsx
  components/
    layout/           # AppShell, Sidebar, Topbar, UserControl, NotificationMenu
    dashboard/        # Sections, StatCard, FacilityUsageCard, CampusMapCard, etc.
    dashboard/modals/ # Create/Edit modals per area
    UI/               # FormField, DatePicker, TimeInput
  features/
    bookings/         # types, utils, repository, data
    facilities/       # types, repository
    reports/          # types, utils, repository
    users/            # types, repository
  lib/
    mongodb.ts        # MongoDB client and getDb()
    cn.ts             # className helper
  contexts/
    CurrentUserContext.tsx
```

---

### 2. Separation of concerns

- **UI components** – Rendering only; receive props and callbacks.
- **Feature modules** – Types, utils, and **repositories** (MongoDB collection access). No UI.
- **Sections** – Compose UI, hold local state, call APIs (e.g. `fetch('/api/bookings')`), and pass data/handlers to modals.

---

### 3. Example flow: create booking

1. User clicks “New booking” and the create modal opens.
2. User fills facility, employee, company, date, time, attendees, purpose; optionally status.
3. Client builds a `Booking` and calls `POST /api/bookings`.
4. API uses `getBookingsCollection(db).insertOne(...)` and returns the created booking.
5. Client updates local state; table re-renders.

Same pattern for facilities, users, and reports: UI → API route → MongoDB → response → UI update.

---

### 4. Data models (examples)

**Booking**

- `id`, `facilityName`, `facilityType`, `employeeName`, `companyName`, `date`, `time`, `attendees`, `purpose`, `status` (`pending` | `confirmed` | `completed` | `cancelled`).

**Report**

- `id`, `date`, `facilityName`, `description`, `status` (`pending` | `received` | `in_progress` | `resolved`), optional `createdAt`.

**Facility**

- `id`, `name`, `type` (hut | bath | trail | deck | pod), `capacity`, `location`, `status` (active | inactive).

**User (AppUser)**

- `id`, `name`, `email`, `company`, `role`, `status` (active | inactive).

Design: explicit status lifecycles, human-readable fields, easy to extend (e.g. attachments, priority).

---

## Booking rules page

The **Booking Rules** page (`/booking-rules`) documents:

- Overall flow: Facilities → Users → Bookings → Reports.
- How to create and edit facilities, users, bookings, and reports.
- **Rules and why they exist**: facilities first, users/companies/roles, no double-booking, capacity limits, booking status flow, reports separate from bookings.
- Short “Why?” callouts per area so behavior is clear.

---

## Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas). The app expects a connection string in the environment.

### Install and run

```bash
# Install dependencies
npm install

# Optional: set MongoDB connection string (required for API and seed)
# Create .env.local in project root with:
#   MONGODB_URI=mongodb+srv://...   (or mongodb://localhost:27017/...)

# Run development server
npm run dev
```

Then open:

```
http://localhost:3000
```

### Seed the database (optional)

To populate MongoDB with sample facilities, users, bookings, and reports:

```bash
npm run seed
```

The seed script connects to MongoDB using the URI defined in `scripts/seed.ts`. For production or a different database, change that URI or switch the script to use `process.env.MONGODB_URI` and set it in your environment.

### Build and start (production)

```bash
npm run build
npm start
```

---

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start Next.js dev server |
| `npm run build` | Production build         |
| `npm start`     | Start production server  |
| `npm run seed`  | Seed MongoDB (see above) |
| `npm run lint`  | Run ESLint               |

---

## What’s included vs intentionally limited

### Included

- **Backend**: Next.js API routes + MongoDB for bookings, facilities, users, reports.
- **Simulated user/role**: `CurrentUserContext` for role-based visibility (no login UI).
- Clear component/section/modals structure.
- Consistent UI (Tailwind, spacing, modals).
- Realistic flows: create/edit, status lifecycles, validation (e.g. capacity, double-booking).

### Intentionally limited

- **Full authentication**: No sign-in/sign-up; current user is simulated for demo/development.
- **Real-time updates**: No WebSockets or live refresh.
- **Global state library**: No Redux/Zustand; local state + one context.
- **Advanced validation**: Basic required-field and business-rule checks only.

---

## Final notes

This project aims to show:

- A realistic full-stack structure (Next.js + API + MongoDB).
- Thoughtful UI and component boundaries.
- How facilities, users, bookings, and reports fit together and how the Booking Rules page explains the “why” behind the rules.

Thanks for reviewing.
