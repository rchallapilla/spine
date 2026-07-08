"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isEmailAllowed } from "@/lib/utils";
import type { ActionResult } from "@/lib/schemas";

async function getSiteOrigin(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

export async function signInWithEmail(
  email: string,
): Promise<ActionResult<null>> {
  if (!isEmailAllowed(email)) {
    return { ok: false, error: "This email is not authorized to access Spine." };
  }

  const supabase = await createClient();
  const origin = await getSiteOrigin();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data: null };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function bootstrapProfile(
  userId: string,
  email: string,
  timezone?: string,
): Promise<void> {
  // Allowlist is enforced in middleware; treat this as a no-op guard only.
  if (!isEmailAllowed(email)) return;

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return;

  const tz =
    timezone ??
    Intl.DateTimeFormat().resolvedOptions().timeZone ??
    "America/New_York";

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    email,
    timezone: tz,
  });

  if (profileError) {
    console.error("Failed to create profile:", profileError.message);
    return;
  }

  const { data: templates } = await supabase
    .from("milestones")
    .select("*")
    .is("user_id", null);

  if (templates && templates.length > 0) {
    const userMilestones = templates.map((t) => ({
      user_id: userId,
      title: t.title,
      description: t.description,
      category: t.category,
      criteria_text: t.criteria_text,
      target_date: t.target_date,
      status: "todo" as const,
      sort_order: t.sort_order,
    }));

    await supabase.from("milestones").insert(userMilestones);
  }
}

export async function updateTimezone(timezone: string): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Not signed in" };

  const { error } = await supabase
    .from("profiles")
    .update({ timezone })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}
