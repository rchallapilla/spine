"use client";

import { useEffect, useState } from "react";
import { setupOfflineSync } from "@/lib/offlineQueue";

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setupOfflineSync();
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <>
      {offline && (
        <div className="bg-surface px-4 py-2 text-center text-xs text-text-dim">
          Offline. Changes will sync when you reconnect.
        </div>
      )}
      {children}
    </>
  );
}
