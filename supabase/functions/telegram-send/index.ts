import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

const SAFE_FALLBACK_REPLY_HE = `שלום! אני העוזר הדיגיטלי של שליו אושר (Shalev Osher).

אני יכול לעזור במידע על:
1. הניסיון המקצועי שלו
2. הכישורים והטכנולוגיות שלו
3. התפקיד הנוכחי והניסיון הקודם
4. פרטי התקשרות

על מה תרצה/י שאפרט?`;

const SAFE_FALLBACK_REPLY_EN = `Hi! I'm the digital assistant for Shalev Osher.

I can help with information about:
1. His professional experience
2. His skills and technologies
3. His current and previous roles
4. Contact details

What would you like to know?`;

const FALLBACK_OPTIONS_HE = ['ניסיון', 'כישורים', 'טכנולוגיות', 'תפקיד נוכחי', 'יצירת קשר'];
const FALLBACK_OPTIONS_EN = ['Experience', 'Skills', 'Technologies', 'Current Role', 'Contact'];

// Fix name misspellings and prevent Hebrew name in English responses
const sanitizeReply = (reply: string, lang?: string): string => {
  let cleaned = reply
    .replaceAll('שלו אושר', 'שליו אושר')
    .replace(/שלו(?=\s+אושר)/g, 'שליו')
    .trim();
  
  // In English responses, replace Hebrew name with English name
  if (lang === 'en') {
    cleaned = cleaned.replaceAll('שליו אושר', 'Shalev Osher');
    // Remove any remaining standalone Hebrew name fragments
    cleaned = cleaned.replace(/\(שליו אושר\)\s*/g, '');
  }
  
  return cleaned;
};

const SYSTEM_PROMPT = `You are the AI assistant for Shalev Osher's portfolio website.

Important naming rules:
- In Hebrew responses, write the name as: שליו אושר
- Never write: שלו אושר
- In English responses, ONLY write the name as: Shalev Osher — do NOT mix in Hebrew characters like "שליו אושר" in English text. Keep each response in one language only.

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

CRITICAL LANGUAGE RULE: A "lang" field is provided in the conversation. You MUST respond in the language specified by that field. If lang=he, respond in Hebrew. If lang=en, respond in English. Do NOT switch languages based on conversation history — always follow the lang field.

IMPORTANT: You MUST use the respond_with_options tool for EVERY response. Always include suggested follow-up options that make sense in context. The options MUST be in the same language as your response text.

Contact details:
- Email: shalev@osher.cc
- Phone: +972507223763
- LinkedIn: linkedin.com/in/shalev-osher/

If unsure, provide a short professional summary of Shalev Osher and ask what the visitor would like to know next.`;

interface StructuredReply {
  text: string;
  options?: string[];
}

// Detect if text is primarily Hebrew
function isHebrewText(text: string): boolean {
  const hebrewChars = (text.match(/[\u0590-\u05FF]/g) || []).length;
  return hebrewChars > 2;
}

function getFallback(isHebrew: boolean): StructuredReply {
  return {
    text: isHebrew ? SAFE_FALLBACK_REPLY_HE : SAFE_FALLBACK_REPLY_EN,
    options: isHebrew ? FALLBACK_OPTIONS_HE : FALLBACK_OPTIONS_EN,
  };
}

async function getAIReply(userMessage: string, history?: { role: string; content: string }[], lang?: string): Promise<StructuredReply> {
  const isHebrew = lang === 'he';
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) {
    console.error('LOVABLE_API_KEY not configured');
    return { text: '' };
  }

  try {
    // Inject language instruction as a system-level hint so the AI always follows site language
    const langHint = { role: 'system', content: `The user's interface language is: ${lang === 'he' ? 'Hebrew' : 'English'}. You MUST respond in ${lang === 'he' ? 'Hebrew' : 'English'} regardless of what language appears in the conversation history.` };

    const conversationMessages = history && history.length > 0
      ? [{ role: 'system', content: SYSTEM_PROMPT }, langHint, ...history]
      : [{ role: 'system', content: SYSTEM_PROMPT }, langHint, { role: 'user', content: userMessage }];

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: conversationMessages,
        tools: [
          {
            type: 'function',
            function: {
              name: 'respond_with_options',
              description: 'Send a response to the user with optional follow-up quick-reply buttons.',
              parameters: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string',
                    description: 'The main response text (markdown supported).',
                  },
                  options: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Short follow-up button labels for the user to click. 2-6 items. MUST be in the same language as the text.',
                  },
                },
                required: ['text'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'respond_with_options' } },
      }),
    });

    if (!response.ok) {
      console.error('AI error:', response.status, await response.text());
      return getFallback(isHebrew);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;

    // Try tool call first
    const toolCall = message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments) as StructuredReply;
        const cleanText = sanitizeReply(parsed.text || '', lang === 'he' ? 'he' : 'en');
        if (!cleanText) {
          return getFallback(isHebrew);
        }
        return { text: cleanText, options: parsed.options };
      } catch {
        // fall through to plain text
      }
    }

    // Fallback to plain text content
    const rawReply = message?.content?.trim() || '';
    const cleanReply = sanitizeReply(rawReply, lang === 'he' ? 'he' : 'en');
    if (!cleanReply) {
      return getFallback(isHebrew);
    }
    return { text: cleanReply };
  } catch (err) {
    console.error('AI fetch error:', err);
    return { text: '' };
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

    const history = Array.isArray((requestBody as { history?: unknown })?.history)
      ? (requestBody as { history: { role: string; content: string }[] }).history
      : undefined;

    const lang = typeof (requestBody as { lang?: unknown })?.lang === 'string'
      ? (requestBody as { lang: string }).lang
      : undefined;

    const result = await getAIReply(text, history, lang);
    const isHebrew = lang === 'he' || isHebrewText(text);

    if (!result.text) {
      result.text = isHebrew
        ? 'מצטער, לא הצלחתי לעבד את הבקשה כרגע. נסה שוב בבקשה 🙏'
        : "Sorry, I couldn't process the request right now. Please try again 🙏";
    }

    const { error: botInsertError } = await supabase.from('telegram_messages').insert({
      chat_id: 0,
      sender: 'bot',
      text: result.text,
    });

    if (botInsertError) {
      throw new Error(`Failed to store bot reply: ${botInsertError.message}`);
    }

    return new Response(JSON.stringify({ ok: true, reply: result.text, options: result.options }), {
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
