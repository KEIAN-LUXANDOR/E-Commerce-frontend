"use client";

import { useEffect } from "react";
import { fetchCurrentUser } from "@/lib/api/auth";
import { createMemoryStore } from "@/lib/local-store";
import type { User } from "@/lib/types/auth";

/**
 * Who is logged in, shared by the header and account pages.
 * Asks the backend (GET /auth/me) once per page load; login and logout update it directly.
 */

export type Session = { status: "loading" } | { status: "guest" } | { status: "user"; user: User };

const store = createMemoryStore<Session>({ status: "loading" });
let loading: Promise<void> | null = null;

/** Fetch the current user again from the backend. */
export function refreshSession(): Promise<void> {
  loading = fetchCurrentUser()
    .then((user) => store.set(user ? { status: "user", user } : { status: "guest" }))
    // Backend unreachable: treat as logged out rather than spinning forever
    .catch(() => store.set({ status: "guest" }));
  return loading;
}

export function setSessionUser(user: User | null) {
  store.set(user ? { status: "user", user } : { status: "guest" });
}

export function useSession(): Session {
  const session = store.useValue();
  useEffect(() => {
    if (!loading) void refreshSession();
  }, []);
  return session;
}
