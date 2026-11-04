"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_MARKET_COUNTRY_CODE,
  MARKET_COOKIE_MAX_AGE,
  MARKET_COOKIE_NAME,
  MARKET_CURRENCY,
  getMarketCountry,
  isMarketCountryCode,
  type MarketCountry,
  type MarketCountryCode,
} from "@/lib/market/countries";

interface MarketContextValue {
  countryCode: MarketCountryCode;
  country: MarketCountry;
  currency: typeof MARKET_CURRENCY;
  hydrated: boolean;
  setCountryCode: (countryCode: string) => void;
}

const MarketContext = createContext<MarketContextValue | null>(null);
const MARKET_CHANGE_EVENT = "keian-market-change";

function readMarketCookie(): MarketCountryCode {
  if (typeof document === "undefined") return DEFAULT_MARKET_COUNTRY_CODE;

  const prefix = `${MARKET_COOKIE_NAME}=`;
  const entry = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));

  if (!entry) return DEFAULT_MARKET_COUNTRY_CODE;

  try {
    const savedCountry = decodeURIComponent(entry.slice(prefix.length)).toUpperCase();
    return isMarketCountryCode(savedCountry)
      ? savedCountry as MarketCountryCode
      : DEFAULT_MARKET_COUNTRY_CODE;
  } catch {
    return DEFAULT_MARKET_COUNTRY_CODE;
  }
}

function subscribeToMarket(callback: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(MARKET_CHANGE_EVENT, callback);
  return () => window.removeEventListener(MARKET_CHANGE_EVENT, callback);
}

function getServerMarketSnapshot(): MarketCountryCode {
  return DEFAULT_MARKET_COUNTRY_CODE;
}

function subscribeToHydration(): () => void {
  return () => undefined;
}

function getClientHydrationSnapshot(): boolean {
  return true;
}

function getServerHydrationSnapshot(): boolean {
  return false;
}

function writeMarketCookie(countryCode: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = [
    `${MARKET_COOKIE_NAME}=${encodeURIComponent(countryCode)}`,
    "Path=/",
    `Max-Age=${MARKET_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ].join("; ") + secure;
}

export function MarketProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore keeps the server snapshot deterministic, then reads
  // the saved cookie after hydration without synchronously setting state in an effect.
  const countryCode = useSyncExternalStore(
    subscribeToMarket,
    readMarketCookie,
    getServerMarketSnapshot,
  );
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  const setCountryCode = useCallback((nextCountryCode: string) => {
    const normalized = nextCountryCode.toUpperCase();
    if (!isMarketCountryCode(normalized)) return;

    writeMarketCookie(normalized);
    window.dispatchEvent(new Event(MARKET_CHANGE_EVENT));
  }, []);

  const value = useMemo<MarketContextValue>(() => ({
    countryCode,
    country: getMarketCountry(countryCode),
    currency: MARKET_CURRENCY,
    hydrated,
    setCountryCode,
  }), [countryCode, hydrated, setCountryCode]);

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket(): MarketContextValue {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useMarket must be used within a MarketProvider");
  }
  return context;
}
