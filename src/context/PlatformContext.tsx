"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Platform = "discord" | "telegram";

interface PlatformContextType {
  platform: Platform;
  setPlatform: (p: Platform) => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatform] = useState<Platform>("discord");

  // Optional: save to local storage
  useEffect(() => {
    const saved = localStorage.getItem("highcore_platform") as Platform;
    if (saved === "discord" || saved === "telegram") {
      setPlatform(saved);
    }
  }, []);

  const handleSetPlatform = (p: Platform) => {
    setPlatform(p);
    localStorage.setItem("highcore_platform", p);
  };

  return (
    <PlatformContext.Provider value={{ platform, setPlatform: handleSetPlatform }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return context;
}
