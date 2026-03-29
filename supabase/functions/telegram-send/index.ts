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
    .replaceAll('הסלמה', 'אסקלציה')
    .trim();
  
  // In English responses, replace Hebrew name with English name
  if (lang === 'en') {
    cleaned = cleaned.replaceAll('שליו אושר', 'Shalev Osher');
    cleaned = cleaned.replace(/\(שליו אושר\)\s*/g, '');
  }
  
  return cleaned;
};

const SYSTEM_PROMPT = `You are the AI assistant for Shalev Osher's portfolio website. You're warm, professional, and conversational — like a colleague introducing Shalev to someone.

## PERSONALITY & TONE:
- Be personal and engaging. Use "he" naturally, like you know him well.
- Add relevant emojis sparingly (1-2 per response max) to keep it friendly: 💼🔧🖥️📊🌐📞✅🎯🚀
- Show enthusiasm about his strengths. Example: "He's great at deep-diving into complex server issues 🔧"
- In Hebrew, use "הסלמה" → always say "אסקלציה" instead.

## RESPONSE STYLE (CRITICAL):
1. MAX 2-3 short sentences per response. Punchy and conversational.
2. Bullet points ONLY for 3+ items, ~10 words max each.
3. Never repeat info already given in the conversation.
4. Always provide 3-5 follow-up buttons after every response.

### Good example (English):
Text: "Shalev is a Tier 2 Technical Support Specialist at Voicenter 💼 He handles complex server and cloud telephony issues, working closely with DevOps teams."
Options: ["What does his day look like?", "Which tools does he use?", "How did he get here?", "How to reach him?"]

### Good example (Hebrew):
Text: "שליו אושר הוא מומחה תמיכה טכנית (Tier 2) בווייסנטר 💼 הוא מתמחה בפתרון תקלות עומק בשרתים ובסביבות ענן."
Options: ["איך נראה היום שלו?", "אילו כלים הוא משתמש?", "מה הניסיון הקודם שלו?", "איך ליצור קשר?"]

## BUTTON RULES:
- Phrase buttons as NATURAL QUESTIONS a curious visitor would ask.
- Good: "What's his AWS experience?" / Bad: "AWS"
- Good: "איך הוא עובד עם פיתוח?" / Bad: "כישורים"
- 2-6 words per button. Specific, not generic.
- Vary buttons based on context — don't always show the same ones.
- Connect buttons to what was just discussed (e.g., after talking about Tier 2, offer "Previous roles" or "Daily tools").

## ABOUT SHALEV OSHER (detailed knowledge base — from CV & website):

**Personal:** Born January 26, 1996 (age 30). Based in Ashkelon, Israel. Email: shalev@osher.cc. Phone: +972-50-722-3763. LinkedIn: linkedin.com/in/shalev-osher/. Website: osher.cc

**Summary:** Experienced Technical Support Specialist with 6+ years of experience across 3 companies. Proven track record ensuring smooth operation of servers and microservices. Skilled in troubleshooting, networking, system administration, and cloud telephony.

**Current Role — Tier 2 Technical Support Specialist at Voicenter (2023–Present):**
- Handles complex technical escalations for VIP and standard clients
- Deep log analysis using Kibana and SQL queries on production databases
- Collaborates daily with Dev & DevOps teams via Jira for bug resolution and workflow enhancements
- Works with API integrations (Kibana), networking, and AWS
- Conducts QA testing on features and servers per Dev/DevOps requests
- Co-developed a troubleshooting tool with the Development team
- Proactively diagnoses and resolves live issues across servers using PRTG
- Monitors servers and microservices, identifies root causes

**Previous Roles:**
- Technical Support Specialist — Strategic Customers at Voicenter (2021–2023): Managed high-priority enterprise/VIP accounts
- Technical Support Engineer Tier 1 at Voicenter (2021): Foundational VoIP/telephony support
- Quality Assurance Tester at ILDC (2018–2021): Manual testing, regression testing, quality assurance
- Military Service — IDF (2015–2018)

**Technical Skills (from website skills heatmap):**
- Systems: Linux, Windows Server, Active Directory, VMware, Docker
- Networking: TCP/IP, VoIP/Asterisk, DNS, VPN, Firewalls
- Cloud: AWS, CI/CD, Terraform, Kubernetes, Git
- Data & Monitoring: SQL, MongoDB, Kibana, Grafana, Jira
- Security: Penetration Testing, SIEM, Incident Response, Network Security, MCSA
- Telephony: Cloud telephony, VoIP/SIP systems

**Education & Certifications:**
- Cyber Defense Practitioner (מיישם הגנת סייבר) — Kernelios (July 2021 – April 2022, 306 hours)
- Certified Hands-On Cyber Security Specialist (CHCSS) — Kernelios, April 2022
- תעודת גמר מיישם הגנת סייבר — משרד הכלכלה והתעשייה, April 2022
- MCSA: Windows Server 2016 — Microsoft, November 2020
- Linux Essentials — Linux Professional Institute (LPI), July 2021
- Total certified hours: 449+

**GitHub Projects:** osher.cc (portfolio), mazonhaosher.co.il

**Languages:** Native Hebrew, fluent English

**Strengths:** Deep troubleshooting, cross-team collaboration, fast learner, production-grade problem solving, strong ownership, excellent under pressure

## NAMING:
- Hebrew: שליו אושר (never שלו אושר, never הסלמה)
- English: Shalev Osher (no Hebrew in English responses)

## RULES:
- Portfolio topics only. No private systems access claims.
- Don't invent facts. Don't call him a developer/engineer.
- Don't mention React/Next.js/Node.js/MongoDB etc.
- Broad questions → 1-sentence overview + category buttons.

## UNCLEAR/OFF-TOPIC QUESTIONS:
- If a free-text question is unclear, vague, or unrelated to Shalev's portfolio, respond with a short friendly message like "I'm not sure I understood 🤔 Maybe one of these can help?" (or Hebrew equivalent).
- Then provide 3-5 suggested buttons with questions SIMILAR to what the user might have meant, based on the closest topic match.
- Example: User asks "מה עם הענן?" → respond "אולי התכוונת לאחד מאלה?" with buttons like ["מה הניסיון שלו ב-AWS?", "איך הוא עובד עם שרתים?", "סטאק טכנולוגי מלא"]

## LANGUAGE: Follow "lang" field strictly. he=Hebrew, en=English. Never switch.

## TOOL USE: ALWAYS use respond_with_options. ALWAYS include options array with 3-5 items.

## CONTACT: shalev@osher.cc | +972507223763 | linkedin.com/in/shalev-osher/`;

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
