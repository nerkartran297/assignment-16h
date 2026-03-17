# 🌲 Forestince – Nature Campus Admin

A full-stack web application for managing facilities, users, bookings, and operational reports (damage, maintenance), built with **Next.js, React, MongoDB, and Tailwind**.

The project focuses on:

- clean UI implementation
- maintainable architecture
- realistic product flows
- practical use of AI in development

---

## 🚀 Overview

**Forestince** simulates a real-world **facility management system** where:

### Admins can:

- Manage **facilities** (create, edit, activate/deactivate)
- Manage **users** (roles, companies)
- Manage **bookings** (status lifecycle: Pending → Confirmed / Cancelled / Completed)
- Track **reports** (damage/issues lifecycle: Pending → Received → In progress → Resolved)

### Users / Companies:

- Request facilities based on their needs

### Role-based visibility:

A simulated user (`CurrentUserContext`) controls what data is visible:

- Staff → own bookings
- Admin → company scope
- Super Admin → global view

---

# 🎨 UI Implementation Approach

## 1. Component Structure

The UI is built with **clear separation of concerns**:

- **Pages (`/app`)**
  - Handle routing + orchestration only

- **Sections (feature-level)**
  - `RequestsSection`
  - `FacilitiesSection`
  - `UsersSection`
  - `ReportsSection`

- **Reusable components**
  - `FilterDropdown`, `DatePicker`, `TimeInput`, `FormField`
  - Shared modal patterns (`ModalShell`, `ModalHeader`)

- **Modals extracted**
  - Create/Edit modals are separated into dedicated components
  - Keeps sections clean and readable

👉 Avoids “god components” and keeps files maintainable.

---

## 2. Layout Decisions

- Sidebar + main content layout (dashboard pattern)
- Table-based UI for management clarity
- Modal-based flows for:
  - create
  - edit
  - detail view

Design system:

- soft surfaces (`bg-slate-50`, `bg-white`)
- consistent spacing system
- card grouping inside modals

---

## 3. Responsive Behavior

- Mobile:
  - stacked filters
  - flexible grids

- Desktop:
  - split layout (main + sidebar/modal)

- Tables:
  - horizontal scroll when needed

---

## 4. State Handling

- Local React state for:
  - filters
  - pagination
  - modals
  - form drafts
  - selection

- One shared context:
  - `CurrentUserContext` → simulate role-based UI

👉 No Redux/Zustand → intentional decision to avoid over-engineering.

---

## 5. Practical UI Tradeoffs

- Replaced native `<select>` → `FilterDropdown` (design consistency)
- Built custom `DatePicker` (browser default inconsistent)
- Used modal flows instead of navigation (faster UX)
- Status editing uses dropdown (flexible lifecycle instead of rigid buttons)

---

# 🏗️ Architecture & Data Flow

## 1. Project Structure

```
src/
  app/
    api/
  components/
  features/
  lib/
  contexts/
```

---

## 2. Separation of Concerns

- **UI layer** → rendering only
- **Feature layer** → types, utils, repositories
- **API layer** → handles DB interaction
- **Sections** → orchestrate state + API calls

---

## 3. Example Flow (End-to-End)

**Create Booking Flow:**

1. User opens modal
2. Inputs booking data
3. UI builds `Booking` object
4. Calls `POST /api/bookings`
5. API writes to MongoDB
6. UI updates state and re-renders

👉 Simulates real FE → BE → DB → UI loop

---

## 4. Data Modeling

Example:

```ts
type Report = {
  id: string;
  date: string;
  facilityName: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
};
```

Design decisions:

- explicit status lifecycle
- human-readable fields
- easily extendable

---

# ⚖️ Priorities & Tradeoffs

## Prioritized

- Clean and scalable architecture
- Consistent UI system
- Realistic product flows
- Maintainability over speed
- Clear separation of concerns

## Intentionally Left Out

- Authentication system (simulated user instead)
- Real-time updates (WebSocket)
- Global state library
- Advanced validation logic

👉 Goal: focus on **core engineering thinking**, not system completeness

---

# 🤖 AI-Supported Workflow

AI was actively used throughout development.

## How AI was used

- Generate initial UI scaffolding
- Suggest component breakdown
- Refactor large components into smaller units
- Improve spacing, typography, and layout consistency
- Suggest better UX flows (status lifecycle, modal structure)

---

## Where AI helped

- Speeding up repetitive UI work
- Providing alternative architectural approaches
- Identifying refactor opportunities
- Generating base implementations for components

---

## Where AI did NOT help

- Raw UI output was often:
  - visually unbalanced
  - inconsistent spacing
  - overly generic

- Some suggestions:
  - over-engineered
  - introduced unnecessary abstraction

---

## How output was validated

- Manual UI review (visual balance, spacing)
- Refactoring AI-generated code
- Enforcing consistency:
  - naming
  - spacing
  - component boundaries

- Ensuring no unnecessary dependencies
  => No warning was found while building the project to deploy on production

---

## Key insight

AI was used as a **co-pilot, not a decision-maker**.

All final decisions were:

- manually reviewed
- aligned with product thinking

---

# 🛠️ Setup Instructions

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

---

## Install & Run

```bash
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Environment

Create `.env.local`:

```bash
MONGODB_URI=your_connection_string
```

---

## Seed database

```bash
npm run seed
```

---

## Production

```bash
npm run build
npm start
```

---

# 🎯 What This Project Demonstrates

- Realistic full-stack thinking
- Clean UI architecture
- Thoughtful component design
- Practical use of AI in development
- Strong focus on maintainability

---

Thanks for reviewing 🙌
