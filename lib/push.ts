import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/admin";

function configureVapid() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@spine.app";

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; url: string },
) {
  configureVapid();
  const admin = createServiceClient();

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (!subs?.length) return;

  const message = JSON.stringify(payload);

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          message,
        );
      } catch {
        await admin
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", sub.endpoint);
      }
    }),
  );
}

export function getVapidPublicKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
    process.env.VAPID_PUBLIC_KEY ??
    null
  );
}
