"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const ListingContext = createContext<any>(null);

export function useListingContext() {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error("useListingContext must be used within a ListingProvider");
  }
  return context;
}

export function ListingProvider({ children, initialParams = {} }: { children: ReactNode; initialParams?: any }) {
  const [params, setParams] = useState(initialParams);

  const updateParams = (updates: any) => {
    setParams((prev: any) => ({ ...prev, ...updates }));
  };

  const clearAll = () => {
    setParams({});
  };

  return (
    <ListingContext.Provider value={{ params, updateParams, clearAll }}>
      {children}
    </ListingContext.Provider>
  );
}

export default ListingProvider;