/**
 * AI chat fallback powered by Lovable AI Gateway.
 * Used by the chat widget when the visitor types a free-form question
 * not covered by the canned menu options.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT_EN = `You are an AI assistant on Shalev Osher's professional portfolio website (osher.cc).

ROLE: Answer questions ONLY about Shalev's professional background. Be concise, friendly and confident.
NEVER role-play as Shalev — refer to him in third person.
NEVER claim Shalev is a developer / coder / React engineer. He's Tech Support / DevOps oriented.

ABOUT SHALEV:
- Location: Ashkelon, Israel
- Email: shalev@osher.cc · Phone: +972-50-722-3763
- LinkedIn: shalev-osher · GitHub: Shalev-osher
- Currently: Technical Support Specialist at Voicenter (Strategic Customers Tier 2/1)
- IDF: Combat soldier in the Engineering Corps
- Strong in: System Administration, Linux, Windows Server, Networking, VoIP,
  AWS, Docker basics, SQL, Cyber Security, technical troubleshooting,
  customer-facing technical support, team mentoring.
- Education: Cyber Defense Practitioner (Kernelios), MCSA Windows Server 2016,
  Linux Essentials (LPI), CHCSS.
- Open to: System Admin / DevOps / Tech Lead / Senior Support roles.

STYLE:
- Keep replies short — 2-4 sentences max unless the user asks for detail.
- Use markdown sparingly (bold for key terms, occasional bullet list).
- If asked something completely unrelated to Shalev, politely redirect.
- If asked for contact info, give email + LinkedIn.
- Match the user's language (Hebrew or English).`;

const SYSTEM_PROMPT_HE = SYSTEM_PROMPT_EN + `\n\nIMPORTANT: If the user wrote in Hebrew, reply in Hebrew (RTL friendly).`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, history, lang } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = lang === "he" ? SYSTEM_PROMPT_HE : SYSTEM_PROMPT_EN;

    // Trim history to last 10 turns for cost control
    const trimmedHistory = Array.isArray(history) ? history.slice(-10) : [];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...trimmedHistory,
          { role: "user", content: message.slice(0, 1000) },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({
          reply: lang === "he"
            ? "⏳ הגעתי למגבלת הקצב. נסה שוב בעוד רגע."
            : "⏳ Rate limit reached. Please try again in a moment.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({
          reply: lang === "he"
            ? "⚠️ לא נותר תקציב AI. שליו יקבל התראה."
            : "⚠️ AI credits exhausted. Shalev will be notified.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const reply: string =
      data?.choices?.[0]?.message?.content ||
      (lang === "he" ? "מצטער, לא הצלחתי לענות." : "Sorry, I couldn't generate a reply.");

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("chat-ai error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
