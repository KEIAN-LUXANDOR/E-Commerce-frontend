"use client";

import { useSyncExternalStore } from "react";

// Safe notification store (Single Toast)
type ToastTone = "default" | "error" | "success";
let activeToast: { id: number; message: string; tone?: ToastTone } | null = null;
const toastListeners = new Set<() => void>();
let toastCounter = 0;
let toastTimeout: NodeJS.Timeout | null = null;

function notifyToast() {
  toastListeners.forEach((l) => l());
}

export function showToast(message: string, options?: { tone?: ToastTone }) {
  const id = ++toastCounter;
  activeToast = { id, message, tone: options?.tone || "default" };
  notifyToast();
  
  if (toastTimeout) clearTimeout(toastTimeout);
  
  toastTimeout = setTimeout(() => {
    // Only clear if the active toast is still the one we just showed
    if (activeToast?.id === id) {
      activeToast = null;
      notifyToast();
    }
  }, 3000);
}

export function dismissToast() {
  activeToast = null;
  if (toastTimeout) clearTimeout(toastTimeout);
  notifyToast();
}

export const toastStore = {
  useToast: () => {
    return useSyncExternalStore(
      (listener) => {
        toastListeners.add(listener);
        return () => toastListeners.delete(listener);
      },
      () => activeToast,
      () => null
    );
  }
};

// Isolated Mini Cart Store
let isMiniCartOpen = false;
const miniCartListeners = new Set<() => void>();

function notifyMiniCart() {
  miniCartListeners.forEach((l) => l());
}

export const miniCartOpenStore = {
  open: () => {
    isMiniCartOpen = true;
    notifyMiniCart();
  },
  close: () => {
    isMiniCartOpen = false;
    notifyMiniCart();
  },
  set: (val: boolean) => {
    isMiniCartOpen = val;
    notifyMiniCart();
  },
  useValue: () => {
    return useSyncExternalStore(
      (listener) => {
        miniCartListeners.add(listener);
        return () => miniCartListeners.delete(listener);
      },
      () => isMiniCartOpen,
      () => false
    );
  }
};

// Alias for legacy component support
export const setMiniCartOpen = miniCartOpenStore.set;