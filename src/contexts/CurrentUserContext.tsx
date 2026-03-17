"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AppUser } from "@/features/users/user.types";

const STORAGE_KEY = "forestince-current-user-id";

interface CurrentUserContextValue {
  currentUser: AppUser | null;
  setCurrentUser: (user: AppUser | null) => void;
  users: AppUser[];
  isLoadingUsers: boolean;
  refetchUsers: () => Promise<AppUser[] | undefined>;
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) return;
      const data = (await res.json()) as AppUser[];
      setUsers(data);
      return data;
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const data = await fetchUsers();
      if (!isMounted || !data?.length) return;
      const storedId =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      const matched = storedId ? data.find((u) => u.id === storedId) : null;
      if (matched) {
        setCurrentUserState(matched);
      } else {
        setCurrentUserState(data[0] ?? null);
        if (data[0] && typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, data[0].id);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchUsers]);

  const setCurrentUser = useCallback((user: AppUser | null) => {
    setCurrentUserState(user);
    if (typeof window !== "undefined") {
      if (user) localStorage.setItem(STORAGE_KEY, user.id);
      else localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      users,
      isLoadingUsers,
      refetchUsers: fetchUsers,
    }),
    [currentUser, setCurrentUser, users, isLoadingUsers, fetchUsers],
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx)
    throw new Error("useCurrentUser must be used within CurrentUserProvider");
  return ctx;
}

export function formatRoleLabel(role: AppUser["role"]): string {
  switch (role) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "staff":
      return "Staff";
    case "guest":
      return "Guest";
    default:
      return role;
  }
}
