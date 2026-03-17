import { MongoClient } from "mongodb";
import { initialBookings } from "../src/features/bookings/booking.data";
import type { Booking } from "../src/features/bookings/booking.types";
import type { Facility } from "../src/features/facilities/facility.types";
import type { Report } from "../src/features/reports/report.types";
import type { AppUser } from "../src/features/users/user.types";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const uri = "mongodb+srv://22520584:qQtKwGGgipWrwkVz@forum.78aewus.mongodb.net/?retryWrites=true&w=majority&appName=16h-test";
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db();
  const bookingsCol = db.collection<Booking>("bookings");
  const facilitiesCol = db.collection<Facility>("facilities");
  const usersCol = db.collection<AppUser>("users");
  const reportsCol = db.collection<Report>("reports");

  // Clear existing data so the seed is deterministic.
  await Promise.all([
    bookingsCol.deleteMany({}),
    facilitiesCol.deleteMany({}),
    usersCol.deleteMany({}),
    reportsCol.deleteMany({}),
  ]);

  // --- Derive facilities from bookings ---
  const facilityByName = new Map<string, Facility>();
  let facilityIndex = 1;

  for (const booking of initialBookings) {
    if (!facilityByName.has(booking.facilityName)) {
      const id = `FAC-${facilityIndex.toString().padStart(3, "0")}`;
      facilityIndex += 1;

      const baseLocation =
        booking.facilityType === "trail"
          ? "Forest Ridge"
          : booking.facilityType === "deck"
            ? "Zen Garden Terrace"
            : booking.facilityType === "hut"
              ? "North Grove Cluster"
              : booking.facilityType === "bath"
                ? "Spring Pavilion"
                : "Quiet Pod Lane";

      const capacity =
        booking.facilityType === "trail"
          ? 20
          : booking.facilityType === "deck"
            ? 12
            : booking.facilityType === "hut"
              ? 8
              : booking.facilityType === "bath"
                ? 6
                : 2;

      facilityByName.set(booking.facilityName, {
        id,
        name: booking.facilityName,
        type: booking.facilityType,
        capacity,
        status: "active",
        location: baseLocation,
      });
    }
  }

  // Enrich with additional facilities so we reach ~25 total.
  const extraFacilities: Omit<Facility, "id">[] = [
    {
      name: "Cedar Focus Hut",
      type: "hut",
      capacity: 6,
      status: "active",
      location: "North Grove Cluster",
    },
    {
      name: "Pine Reflection Hut",
      type: "hut",
      capacity: 8,
      status: "active",
      location: "North Grove Cluster",
    },
    {
      name: "Lakeview Strategy Deck",
      type: "deck",
      capacity: 14,
      status: "active",
      location: "Zen Garden Terrace",
    },
    {
      name: "Sunrise Outlook Deck",
      type: "deck",
      capacity: 10,
      status: "active",
      location: "Zen Garden Terrace",
    },
    {
      name: "Mossy Creek Trail",
      type: "trail",
      capacity: 18,
      status: "active",
      location: "Forest Ridge",
    },
    {
      name: "Ridgecrest Panorama Trail",
      type: "trail",
      capacity: 22,
      status: "active",
      location: "Forest Ridge",
    },
    {
      name: "Willow Grove Bath",
      type: "bath",
      capacity: 6,
      status: "active",
      location: "Spring Pavilion",
    },
    {
      name: "Mineral Stone Bath",
      type: "bath",
      capacity: 4,
      status: "active",
      location: "Spring Pavilion",
    },
    {
      name: "Studio Pod A",
      type: "pod",
      capacity: 2,
      status: "active",
      location: "Quiet Pod Lane",
    },
    {
      name: "Studio Pod B",
      type: "pod",
      capacity: 2,
      status: "active",
      location: "Quiet Pod Lane",
    },
    {
      name: "Studio Pod C",
      type: "pod",
      capacity: 2,
      status: "active",
      location: "Quiet Pod Lane",
    },
    {
      name: "Forest Circle Hut",
      type: "hut",
      capacity: 10,
      status: "active",
      location: "North Grove Cluster",
    },
    {
      name: "Summit View Deck",
      type: "deck",
      capacity: 16,
      status: "active",
      location: "Zen Garden Terrace",
    },
    {
      name: "Evergreen Retreat Hut",
      type: "hut",
      capacity: 8,
      status: "active",
      location: "North Grove Cluster",
    },
    {
      name: "Valley Overlook Trail",
      type: "trail",
      capacity: 20,
      status: "active",
      location: "Forest Ridge",
    },
    {
      name: "Stone Lantern Deck",
      type: "deck",
      capacity: 12,
      status: "active",
      location: "Zen Garden Terrace",
    },
    {
      name: "Glade Immersion Trail",
      type: "trail",
      capacity: 18,
      status: "active",
      location: "Forest Ridge",
    },
    {
      name: "Riverbend Bath",
      type: "bath",
      capacity: 5,
      status: "active",
      location: "Spring Pavilion",
    },
    {
      name: "Focus Pod North",
      type: "pod",
      capacity: 1,
      status: "active",
      location: "Quiet Pod Lane",
    },
    {
      name: "Focus Pod South",
      type: "pod",
      capacity: 1,
      status: "active",
      location: "Quiet Pod Lane",
    },
  ];

  for (const extra of extraFacilities) {
    if (!facilityByName.has(extra.name)) {
      const id = `FAC-${facilityIndex.toString().padStart(3, "0")}`;
      facilityIndex += 1;
      facilityByName.set(extra.name, { id, ...extra });
    }
  }

  const facilities: Facility[] = Array.from(facilityByName.values())
    .sort((a, b) => a.id.localeCompare(b.id))
    .slice(0, 25);

  // --- Derive users from bookings (if any) and ensure at least 15 users ---
  interface UserKey {
    name: string;
    company: string;
  }

  const userByKey = new Map<string, AppUser>();
  let userIndex = 1;

  const companyHasAdmin = new Set<string>();

  for (const booking of initialBookings) {
    const keyObj: UserKey = {
      name: booking.employeeName,
      company: booking.companyName,
    };
    const key = JSON.stringify(keyObj);

    if (!userByKey.has(key)) {
      const id = `USR-${userIndex.toString().padStart(3, "0")}`;
      userIndex += 1;

      const companySlug = slugify(booking.companyName).replace(/-+co$/, "");
      const nameSlug = slugify(booking.employeeName).replace(/-/g, ".");
      const email = `${nameSlug}@${companySlug || "campus"}.com`;

      let role: AppUser["role"];
      if (!companyHasAdmin.has(booking.companyName)) {
        role = "admin";
        companyHasAdmin.add(booking.companyName);
      } else if (booking.purpose.toLowerCase().includes("leadership")) {
        role = "manager";
      } else if (booking.purpose.toLowerCase().includes("workshop")) {
        role = "manager";
      } else {
        role = "staff";
      }

      userByKey.set(key, {
        id,
        name: booking.employeeName,
        email,
        company: booking.companyName,
        role,
        status: "active",
      });
    }
  }

  // Seed at least 15 users (name, company, role) when initialBookings is empty or yields few users
  const seedUserSpecs: { name: string; company: string; role: AppUser["role"] }[] = [
    { name: "Marcus Chen", company: "Acme Corp", role: "admin" },
    { name: "Sarah Mitchell", company: "Acme Corp", role: "manager" },
    { name: "James Wilson", company: "Acme Corp", role: "staff" },
    { name: "Emma Davis", company: "Acme Corp", role: "staff" },
    { name: "Oliver Brown", company: "Beta Industries", role: "admin" },
    { name: "Sophie Taylor", company: "Beta Industries", role: "staff" },
    { name: "Liam Anderson", company: "Beta Industries", role: "staff" },
    { name: "Ava Thomas", company: "Gamma LLC", role: "admin" },
    { name: "Noah Jackson", company: "Gamma LLC", role: "manager" },
    { name: "Isabella White", company: "Gamma LLC", role: "staff" },
    { name: "Lucas Harris", company: "Delta Co", role: "admin" },
    { name: "Mia Martin", company: "Delta Co", role: "staff" },
    { name: "Ethan Garcia", company: "Epsilon Group", role: "admin" },
    { name: "Charlotte Lee", company: "Epsilon Group", role: "staff" },
    { name: "Alexander Clark", company: "Epsilon Group", role: "guest" },
  ];

  for (const spec of seedUserSpecs) {
    const key = JSON.stringify({ name: spec.name, company: spec.company });
    if (userByKey.has(key)) continue;
    const id = `USR-${userIndex.toString().padStart(3, "0")}`;
    userIndex += 1;
    const companySlug = slugify(spec.company).replace(/-+co$/, "");
    const nameSlug = slugify(spec.name).replace(/-/g, ".");
    const email = `${nameSlug}@${companySlug || "campus"}.com`;
    if (spec.role === "admin") companyHasAdmin.add(spec.company);
    userByKey.set(key, {
      id,
      name: spec.name,
      email,
      company: spec.company,
      role: spec.role,
      status: "active",
    });
  }

  const baseUsers: AppUser[] = Array.from(userByKey.values()).sort((a, b) =>
    a.id.localeCompare(b.id),
  );

  const superAdmin: AppUser = {
    id: "USR-000",
    name: "Elena Wood",
    email: "elena.wood@forestince.com",
    company: "Forestince",
    role: "super_admin",
    status: "active",
  };

  const users: AppUser[] = [superAdmin, ...baseUsers];

  // --- Generate additional bookings to reach ~80 ---
  const targetBookingsCount = 80;
  const extraBookingsCount = Math.max(
    0,
    targetBookingsCount - initialBookings.length,
  );

  const statusCycle: Booking["status"][] = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ];
  const timeSlots = [
    "08:00 AM",
    "09:30 AM",
    "11:00 AM",
    "01:30 PM",
    "03:00 PM",
    "04:30 PM",
  ];
  const purposes = [
    "Leadership offsite",
    "Quarterly business review",
    "Product design sprint",
    "Client immersion workshop",
    "Mindfulness & focus block",
    "Strategy deep dive",
  ];

  const extraBookings: Booking[] = [];
  const baseIdNumber = initialBookings.length;

  for (let i = 0; i < extraBookingsCount; i += 1) {
    const bookingNumber = baseIdNumber + i + 1;
    const id = `BK-${bookingNumber.toString().padStart(3, "0")}`;

    const facility = facilities[i % facilities.length];
    const user = users[i % users.length];

    const dayOffset = i; // spread across future days
    const baseDate = new Date("2026-11-06T08:00:00Z");
    baseDate.setDate(baseDate.getDate() + dayOffset);

    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const date = formatter.format(baseDate); // e.g. "Nov 06, 2026"

    const time = timeSlots[i % timeSlots.length];
    const status = statusCycle[i % statusCycle.length];
    const purpose = purposes[i % purposes.length];
    const attendees =
      facility.capacity <= 2
        ? 1
        : Math.max(1, Math.min(facility.capacity, 4 + (i % 8)));

    extraBookings.push({
      id,
      facilityName: facility.name,
      facilityType: facility.type,
      employeeName: user.name,
      companyName: user.company,
      date,
      time,
      status,
      attendees,
      purpose,
    });
  }

  const allBookings: Booking[] = [...initialBookings, ...extraBookings];

  const reportDescriptions = [
    "Door hinge stuck, needs maintenance",
    "AC not working in meeting room A",
    "Light flickering in lobby area",
    "Water tap leaking in 2nd floor restroom",
    "Conference TV screen no signal",
    "Carpet corner peeling, trip hazard",
  ];
  const reportStatuses: Report["status"][] = [
    "pending",
    "received",
    "in_progress",
    "resolved",
  ];
  const reports: Report[] = facilities.slice(0, 6).map((fac, i) => {
    const date = new Date("2026-11-01");
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().slice(0, 10);
    return {
      id: `RPT-${(i + 1).toString().padStart(3, "0")}`,
      date: dateStr,
      facilityName: fac.name,
      description: reportDescriptions[i] ?? "Issue requires inspection",
      status: reportStatuses[i % reportStatuses.length],
      createdAt: new Date(date.getTime() + i * 3600000).toISOString(),
    };
  });

  await facilitiesCol.insertMany(facilities);
  await usersCol.insertMany(users);
  await bookingsCol.insertMany(allBookings);
  await reportsCol.insertMany(reports);

  console.log(
    `Seed complete: ${facilities.length} facilities, ${users.length} users, ${allBookings.length} bookings, ${reports.length} reports.`,
  );

  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

