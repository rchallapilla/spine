"use client";

type QueuedMutation = {
  id: string;
  type: "toggleHabit" | "upsertDailyScores";
  payload: Record<string, unknown>;
  createdAt: number;
};

const DB_NAME = "spine-offline";
const STORE = "mutations";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function enqueueMutation(
  type: QueuedMutation["type"],
  payload: Record<string, unknown>,
) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  const item: QueuedMutation = {
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: Date.now(),
  };
  tx.objectStore(STORE).put(item);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function flushQueue(
  handlers: {
    toggleHabit: (payload: Record<string, unknown>) => Promise<unknown>;
    upsertDailyScores: (payload: Record<string, unknown>) => Promise<unknown>;
  },
) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const items = await new Promise<QueuedMutation[]>((resolve, reject) => {
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as QueuedMutation[]);
    req.onerror = () => reject(req.error);
  });

  for (const item of items.sort((a, b) => a.createdAt - b.createdAt)) {
    await handlers[item.type](item.payload);
    const delTx = db.transaction(STORE, "readwrite");
    delTx.objectStore(STORE).delete(item.id);
    await new Promise<void>((resolve, reject) => {
      delTx.oncomplete = () => resolve();
      delTx.onerror = () => reject(delTx.error);
    });
  }
}

let syncRegistered = false;

export function setupOfflineSync() {
  if (typeof window === "undefined" || syncRegistered) return;
  syncRegistered = true;

  window.addEventListener("online", async () => {
    const { toggleHabit, upsertDailyScores } = await import("@/app/actions/logging");
    await flushQueue({
      toggleHabit: (p) =>
        toggleHabit(
          p.date as string,
          p.habitId as string,
          p.value as number,
        ),
      upsertDailyScores: (p) =>
        upsertDailyScores(p.date as string, p.scores as {
          back: number | null;
          stress: number | null;
          sleep: number | null;
        }),
    });
  });
}
