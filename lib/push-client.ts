"use client";

import type { ActionResult } from "@/lib/schemas";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPush(): Promise<ActionResult<null>> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, error: "Push notifications are not supported in this browser" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, error: "Notification permission was denied" };
  }

  const keyRes = await fetch("/api/push/vapid");
  const { publicKey } = await keyRes.json();
  if (!publicKey) {
    return { ok: false, error: "Push is not configured on the server" };
  }

  // `serviceWorker.ready` hangs forever if no SW is registered (e.g. dev
  // mode, where Serwist is disabled), so check for a registration first.
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    return {
      ok: false,
      error: "Service worker not registered. Reminders require the installed production app.",
    };
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription }),
  });

  if (!res.ok) {
    const data = await res.json();
    return { ok: false, error: data.error ?? "Failed to save subscription" };
  }

  return { ok: true, data: null };
}
