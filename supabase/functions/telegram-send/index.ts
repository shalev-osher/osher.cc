import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

const SAFE_FALLBACK_REPLY = `שלום! אני העוזר הדיגיטלי של שליו אושר (Shalev Osher).

אני יכול לעזור במידע על:
1. הניסיון המקצועי שלו
2. הכישורים והטכנולוגיות שלו
3. התפקיד הנוכחי והניסיון הקודם
4. פרטי התקשרות

על מה תרצה/י שאפרט?`;

const FORBIDDEN_PATTERNS = [
  /שלו אושר/g,
  /שלו\b/g,
  /Pixel Perfect Developer/gi,
  /Full-?Stack/gi,
  /developer/gi,
  /מפתח/gi,
  /פיתוח/gi,
  /Frontend/gi,
  /Backend/gi,
  /UI\/UX/gi,
  /Next\.js/gi,
  /React/gi,
  /Node\.js/gi,
  /MongoDB/gi,
  /PostgreSQL/gi,
  /Tailwind/gi,
  /Vercel/gi,
  /Docker/gi,
];

const SYSTEM_PROMPT = `You are the AI assistant for Shalev Osher's portfolio website.

Important naming rules:
- In Hebrew, always write: שליו אושר
- Never write: שלו אושר
- In English, always write: Shalev Osher

Your job is to help visitors understand who Shalev Osher is, what experience he has, what technologies he works with, what his strengths are, and how to contact him.

About Shalev Osher:
- Shalev Osher is an experienced Technical Support Specialist with strong expertise in servers, microservices, networking, system administration, SQL, Kibana, AWS, troubleshooting, and technical operations.
- He has hands-on experience supporting complex cloud telephony and VoIP environments.
- He currently works at Voicenter as a Tier 2 Technical Support Specialist.
- His work includes collaborating closely with Development and DevOps teams using Jira, supporting VIP and standard customers, troubleshooting live issues, performing QA testing, improving workflows, and helping Tier 1 support handle complex issues.
- He has previous experience as a Strategic Customers Technical Support Specialist and Tier 1 Technical Support Engineer at Voicenter.
- He also has previous experience as a QA Tester at ILDC.
- He studied cyber security, computer forensics, Linux, and Microsoft systems administration at Kernelios.
- He is fluent in English and a native Hebrew speaker.

Core strengths:
- Troubleshooting complex technical issues
- Server and service monitoring
- Networking and system administration
- SQL and database-related work
- Log analysis with Kibana
- AWS-related troubleshooting
- Working across support, DevOps, engineering, and development teams
- Supporting production systems and high-priority customers
- Training users and assisting internal technical teams
- Strong ownership, fast learning, and practical problem solving

Rules:
- Be professional, clear, concise, and friendly.
- Focus only on portfolio-related topics: background, experience, skills, technologies, strengths, and contact details.
- Do not claim access to private systems, emails, calendars, reminders, or tasks.
- Do not invent facts, projects, certifications, or achievements that were not explicitly provided.
- Never describe Shalev Osher as a Full-Stack developer, frontend developer, UI/UX expert, Pixel Perfect Developer, or software developer unless that exact information was explicitly provided.
- Never mention React, Next.js, Node.js, MongoDB, PostgreSQL, Tailwind, Vercel, Docker, or similar software-stack claims unless they were explicitly provided.
- If asked about projects or technologies that were not explicitly provided, say that the verified public information currently focuses on technical support, systems, networking, cloud telephony, SQL, Kibana, AWS, troubleshooting, and technical operations.
- If the user asks broad questions like "everything", "tell me everything", "הכל", or "ספר לי הכל", do not dump too much at once. Instead, guide them with a short clarifying question and offer options such as experience, skills, technologies, current role, previous work, or contact details.
- If the user asks something unclear, still return a helpful answer instead of staying silent.
- Always answer in plain text.
- If the user writes in Hebrew, answer in Hebrew.
- If the user writes in English, answer in English.

Contact details:
- Email: shalev@osher.cc
- Phone: +972507223763
- LinkedIn: linkedin.com/in/shalev-osher/

If unsure, provide a short professional summary of Shalev Osher and ask what the visitor would like to know next.`;

const sanitizeReply = (reply: string): string => {
  return reply
    .replaceAll('שלו אושר', 'שליו אושר')
    .replace(/\bשלו\b(?=\s+אושר)/g, 'שליו')
    .trim();
};

const containsForbiddenContent = (reply: string): boolean => {
  return FORBIDDEN_PATTERNS.some((pattern) => pattern.test(reply));
};

async function getAIReply(userMessage: string): Promise<string> {
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) {
    console.error('LOVABLE_API_KEY not configured for AI fallback');
    return '';
  }

  try {
    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI fallback error:', response.status);
      return '';
    }

    const data = await response.json();
    const rawReply = data.choices?.[0]?.message?.content?.trim() || '';
    const cleanReply = sanitizeReply(rawReply);

    if (!cleanReply || containsForbiddenContent(cleanReply)) {
      return SAFE_FALLBACK_REPLY;
    }

    return cleanReply;
  } catch (err) {
    console.error('AI fallback fetch error:', err);
    return '';
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON input' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const text = typeof (requestBody as { text?: unknown })?.text === 'string'
      ? (requestBody as { text: string }).text.trim()
      : '';

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: visitorInsertError } = await supabase.from('telegram_messages').insert({
      chat_id: 0,
      sender: 'visitor',
      text,
    });

    if (visitorInsertError) {
      throw new Error(`Failed to store visitor message: ${visitorInsertError.message}`);
    }

    let botReply = await getAIReply(text);

    if (!botReply) {
      botReply = 'מצטער, לא הצלחתי לעבד את הבקשה כרגע. נסה שוב בבקשה 🙏';
    }

    const { error: botInsertError } = await supabase.from('telegram_messages').insert({
      chat_id: 0,
      sender: 'bot',
      text: botReply,
    });

    if (botInsertError) {
      throw new Error(`Failed to store bot reply: ${botInsertError.message}`);
    }

    return new Response(JSON.stringify({ ok: true, reply: botReply }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending message:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
