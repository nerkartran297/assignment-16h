"use client";

import { useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { UsersSection } from "@/components/dashboard/UsersSection";
import type { AppUser, UserRole } from "@/features/users/user.types";

export function UsersPageClient() {
  const { currentUser } = useCurrentUser();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/users");
        if (!isMounted) return;
        if (!res.ok) {
          setIsLoading(false);
          return;
        }
        const data = (await res.json()) as AppUser[];
        if (isMounted) setUsers(data);
      } catch {
        // ignore; tables render empty state
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const usersVisibleByRole = useMemo(() => {
    if (!currentUser) return users;
    if (currentUser.role === "super_admin") return users;
    if (currentUser.role === "admin")
      return users.filter((u) => u.company === currentUser.company);
    if (currentUser.role === "staff" || currentUser.role === "guest")
      return users.filter((u) => u.id === currentUser.id);
    return users;
  }, [users, currentUser]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return usersVisibleByRole.filter((u) => {
      const matchStatus =
        statusFilter === "all" ? true : u.status === statusFilter;
      const matchRole = roleFilter === "all" ? true : u.role === roleFilter;
      const matchQuery =
        q.length === 0
          ? true
          : u.id.toLowerCase().includes(q) ||
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.company.toLowerCase().includes(q);
      return matchStatus && matchRole && matchQuery;
    });
  }, [usersVisibleByRole, search, statusFilter, roleFilter]);

  const selected = usersVisibleByRole.find((u) => u.id === selectedId) ?? null;

  const handleCreate = async (next: AppUser) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = (await res.json()) as AppUser;
      setUsers((prev) => [created, ...prev]);
    } catch {
      setUsers((prev) => [next, ...prev]);
    }
  };

  const handleUpdate = async (next: AppUser) => {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(next.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = (await res.json()) as AppUser | null;
      if (data) {
        setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      } else {
        setUsers((prev) => prev.map((u) => (u.id === next.id ? next : u)));
      }
    } catch {
      setUsers((prev) => prev.map((u) => (u.id === next.id ? next : u)));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  };

  return (
    <div className="space-y-6">
      <UsersSection
        isLoading={isLoading}
        users={filtered}
        allUsers={users}
        selectedUser={selected}
        onSelectUser={setSelectedId}
        searchQuery={search}
        onSearchQueryChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        onCreateUser={handleCreate}
        onUpdateUser={handleUpdate}
        onDeleteUser={handleDelete}
      />
    </div>
  );
}
