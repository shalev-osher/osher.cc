import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) return json({ error: "Authentication required" }, 401);

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await authClient.auth.getUser(token);

    if (userError || !userData.user) return json({ error: "Invalid session" }, 401);

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: adminRole, error: roleError } = await adminClient
      .from("user_roles")
      .select("id")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) throw roleError;
    if (!adminRole) return json({ error: "Admin access required" }, 403);

    const [downloadsRes, contactsRes] = await Promise.all([
      adminClient
        .from("cv_downloads")
        .select("id, language, country, user_agent, referrer, created_at")
        .order("created_at", { ascending: false })
        .limit(500),
      adminClient
        .from("contact_submissions")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    if (downloadsRes.error) throw downloadsRes.error;
    if (contactsRes.error) throw contactsRes.error;

    const downloads = downloadsRes.data ?? [];
    const contacts = contactsRes.data ?? [];
    const dailyMap = new Map<string, number>();
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < 30; i++) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      dailyMap.set(d.toISOString().slice(0, 10), 0);
    }

    for (const dl of downloads) {
      const ts = new Date(dl.created_at).getTime();
      if (ts >= thirtyDaysAgo) {
        const day = new Date(dl.created_at).toISOString().slice(0, 10);
        dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
      }
    }

    const langMap = new Map<string, number>();
    for (const dl of downloads) {
      const key = dl.language || "unknown";
      langMap.set(key, (langMap.get(key) ?? 0) + 1);
    }

    const deviceMap = new Map<string, number>();
    for (const dl of downloads) {
      const ua = (dl.user_agent || "").toLowerCase();
      let device = "Desktop";
      if (/mobile|iphone|android.*mobile/.test(ua)) device = "Mobile";
      else if (/ipad|tablet/.test(ua)) device = "Tablet";
      else if (/bot|crawler|spider/.test(ua)) device = "Bot";
      deviceMap.set(device, (deviceMap.get(device) ?? 0) + 1);
    }

    const refMap = new Map<string, number>();
    for (const dl of downloads) {
      let ref = dl.referrer || "Direct";
      try {
        if (ref !== "Direct") ref = new URL(ref).hostname;
      } catch {
        // keep raw referrer
      }
      refMap.set(ref, (refMap.get(ref) ?? 0) + 1);
    }

    return json({
      summary: {
        totalDownloads: downloads.length,
        totalContacts: contacts.length,
        last7DaysDownloads: downloads.filter((d) => now - new Date(d.created_at).getTime() < 7 * 86400000).length,
        last7DaysContacts: contacts.filter((c) => now - new Date(c.created_at).getTime() < 7 * 86400000).length,
      },
      dailyDownloads: Array.from(dailyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count })),
      byLanguage: Array.from(langMap.entries()).map(([name, value]) => ({ name, value })),
      byDevice: Array.from(deviceMap.entries()).map(([name, value]) => ({ name, value })),
      topReferrers: Array.from(refMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value })),
      recentDownloads: downloads.slice(0, 50),
      recentContacts: contacts.slice(0, 50),
    });
  } catch (err) {
    console.error("admin-stats error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ error: message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
