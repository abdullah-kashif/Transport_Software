import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.replace(/^Bearer\s+/i, "");
  if (!supabaseUrl || !serviceRoleKey || !accessToken) {
    return json({ error: "Missing server configuration or authentication." }, 401);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: callerData, error: callerError } = await admin.auth.getUser(accessToken);
  if (callerError || !callerData.user) return json({ error: "Invalid session." }, 401);

  const caller = createClient(supabaseUrl, serviceRoleKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: hasSuperAdminAccess, error: accessError } = await caller.rpc("is_super_admin");
  if (accessError) {
    return json({ error: `Unable to verify Super Admin access: ${accessError.message}` }, 403);
  }
  if (!hasSuperAdminAccess) {
    return json({ error: "Super Admin access is required." }, 403);
  }

  try {
    const payload = await request.json();
    const action = String(payload.action || "");
    const name = String(payload.name || "").trim();
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "");
    const role = payload.role === "super_admin" ? "super_admin" : "admin";
    const status = payload.status === "inactive" ? "inactive" : "active";
    const accessModules = Array.isArray(payload.access_modules)
      ? payload.access_modules.map(String)
      : [];

    if (action === "create") {
      if (!name || !email || password.length < 6) {
        return json({ error: "Name, email and a password of at least 6 characters are required." }, 400);
      }

      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });
      if (createError) return json({ error: createError.message }, 400);

      const { error: profileError } = await caller.from("profiles").update({
        name,
        email,
        role,
        status,
        access_modules: role === "super_admin" ? [] : accessModules,
      }).eq("id", created.user.id);
      if (profileError) {
        await admin.auth.admin.deleteUser(created.user.id);
        return json({ error: profileError.message }, 400);
      }
      return json({ user_id: created.user.id });
    }

    const userId = String(payload.user_id || "");
    if (!userId) return json({ error: "User ID is required." }, 400);

    if (action === "update") {
      const authChanges: Record<string, string> = { email };
      if (password) authChanges.password = password;
      const { error: authError } = await admin.auth.admin.updateUserById(userId, authChanges);
      if (authError) return json({ error: authError.message }, 400);

      const { error: profileError } = await caller.from("profiles").update({
        name,
        email,
        role,
        status,
        access_modules: role === "super_admin" ? [] : accessModules,
      }).eq("id", userId);
      if (profileError) return json({ error: profileError.message }, 400);
      return json({ user_id: userId });
    }

    if (action === "delete") {
      if (userId === callerData.user.id) return json({ error: "You cannot delete your own account." }, 400);
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) return json({ error: error.message }, 400);
      return json({ user_id: userId });
    }

    return json({ error: "Unsupported action." }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected server error." }, 500);
  }
});
