"use client";

import { useSyncExternalStore } from "react";
import { getMe } from "@/lib/api/auth";
import type { User } from "@/lib/types/auth";

interface SessionState {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const SERVER_SNAPSHOT: SessionState = { user: null, status: "loading" };

let state: SessionState = { user: null, status: "loading" };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

async function initSession() {
  let user: User | null = null;
  try {
    user = await getMe();
  } catch {
    // Network or unauthenticated
  }
  if (state.status !== "loading") return;
  state = user
    ? { user, status: "authenticated" }
    : { user: null, status: "unauthenticated" };
  notify();

  if (user) {
    import("@/lib/shop/cart").then((m) => m.fetchServerCart()).catch(() => {});
    import("@/lib/shop/wishlist").then((m) => m.fetchServerWishlistIds()).catch(() => {});
  }
}

// Initialize once on the client
if (typeof window !== "undefined") {
  initSession();
}

export const sessionStore = {
  get: () => state,
  setAuthenticated: (user: User) => {
    state = { user, status: "authenticated" };
    notify();
    import("@/lib/shop/cart").then((m) => m.fetchServerCart()).catch(() => {});
    import("@/lib/shop/wishlist").then((m) => m.fetchServerWishlistIds()).catch(() => {});
  },
  logout: async () => {
    try {
      const { logout: apiLogout } = await import("@/lib/api/auth");
      await apiLogout();
    } catch {}
    state = { user: null, status: "unauthenticated" };
    notify();
  },
  useSession: () => {
    return useSyncExternalStore(
      (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      () => state,
      // Server render and hydration always start from "loading", so the first browser render matches the HTML
      () => SERVER_SNAPSHOT
    );
  },
};