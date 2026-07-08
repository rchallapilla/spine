"use client";

import { useEffect } from "react";
import { updateTimezone } from "@/app/actions/auth";

const STORAGE_KEY = "spine-tz-synced";

export function TimezoneSync() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;
    if (sessionStorage.getItem(STORAGE_KEY) === tz) return;
    void updateTimezone(tz).then((result) => {
      if (result.ok) sessionStorage.setItem(STORAGE_KEY, tz);
    });
  }, []);

  return null;
}
