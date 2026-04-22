// Admin stats endpoint - returns aggregated CV downloads & contact submissions.
// Protected by ADMIN_PASSWORD secret. No JWT required.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const adminPwd = Deno.env.get("ADMIN_PASSWORD");
    if (!adminPwd) {
      return json({ error: "Server not configured" }, 500);
    }

    let provided: string | null = req.headers.get("x-admin-password");
    if (!provided) {
      try {
        const body = await req.json();
        provided = body?.password ?? null;
      } catch {
        // ignore
      }
    }

    if (!provided || provided !== adminPwd) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const [downloadsRes, contactsRes] = await Promise.all([
      supabase
        .from("cv_downloads")
        .select("id, language, country, user_agent, referrer, created_at")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("contact_submissions")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    if (downloadsRes.error) throw downloadsRes.error;
    if (contactsRes.error) throw contactsRes.error;

    const downloads = downloadsRes.data ?? [];
    const contacts = contactsRes.data ?? [];

    // Aggregate downloads by day (last 30 days)
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
    const dailyDownloads = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    // Languages
    const langMap = new Map<string, number>();
    for (const dl of downloads) {
      const k = dl.language || "unknown";
      langMap.set(k, (langMap.get(k) ?? 0) + 1);
    }
    const byLanguage = Array.from(langMap.entries()).map(([name, value]) => ({ name, value }));

    // Devices (parsed from user agent)
    const deviceMap = new Map<string, number>();
    for (const dl of downloads) {
      const ua = (dl.user_agent || "").toLowerCase();
      let dev = "Desktop";
      if (/mobile|iphone|android.*mobile/.test(ua)) dev = "Mobile";
      else if (/ipad|tablet/.test(ua)) dev = "Tablet";
      else if (/bot|crawler|spider/.test(ua)) dev = "Bot";
      deviceMap.set(dev, (deviceMap.get(dev) ?? 0) + 1);
    }
    const byDevice = Array.from(deviceMap.entries()).map(([name, value]) => ({ name, value }));

    // Top referrers
    const refMap = new Map<string, number>();
    for (const dl of downloads) {
      let ref = dl.referrer || "Direct";
      try {
        if (ref !== "Direct") ref = new URL(ref).hostname;
      } catch {
        // keep raw
      }
      refMap.set(ref, (refMap.get(ref) ?? 0) + 1);
    }
    const topReferrers = Array.from(refMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    return json({
      summary: {
        totalDownloads: downloads.length,
        totalContacts: contacts.length,
        last7DaysDownloads: downloads.filter(
          (d) => Date.now() - new Date(d.created_at).getTime() < 7 * 86400000
        ).length,
        last7DaysContacts: contacts.filter(
          (c) => Date.now() - new Date(c.created_at).getTime() < 7 * 86400000
        ).length,
      },
      dailyDownloads,
      byLanguage,
      byDevice,
      topReferrers,
      recentDownloads: downloads.slice(0, 50),
      recentContacts: contacts.slice(0, 50),
    });
  } catch (err) {
    console.error("admin-stats error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return json({ error: msg }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
