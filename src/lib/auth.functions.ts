import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getMyContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, email, full_name, avatar_url").eq("id", userId).maybeSingle(),
      supabaseAdmin.from("user_roles").select("role").eq("user_id", userId),
    ]);
    return {
      profile,
      roles: (roles ?? []).map((r) => r.role),
      isAdmin: (roles ?? []).some((r) => r.role === "admin"),
    };
  });