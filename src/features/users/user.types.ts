export type UserRole = "super_admin" | "admin" | "manager" | "staff" | "guest";

export type UserStatus = "active" | "inactive";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  status: UserStatus;
}

