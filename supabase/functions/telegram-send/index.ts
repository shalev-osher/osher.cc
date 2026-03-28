import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const N8N_WEBHOOK_URL = 'https://n8n.osher.cc/webhook/website-chat-jackie';

const extractBotReply = (payload: unknown): string => {
  if (typeof payload === 'string') return payload.trim();

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidate =
      record.reply ??
      record.output ??
      record.text ??
      record.message ??
      record.response ??
      record.answer ??
      record.content;

    if (typeof candidate === 'string') return candidate.trim();
    if (candidate && typeof candidate === 'object') return JSON.stringify(candidate);
  }

  return '';
};

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

    const sessionId = typeof (requestBody as { sessionId?: unknown })?.sessionId === 'string'
      ? (requestBody as { sessionId: string }).sessionId
      : `web-${Date.now()}`;

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        text,
        chatInput: text,
        sessionId,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`N8N webhook failed [${response.status}]: ${responseText || response.statusText}`);
    }

    let botReply = '';

    if (responseText.trim()) {
      let parsedResponse: unknown = responseText;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = responseText;
      }
      botReply = extractBotReply(parsedResponse);
    }

    if (!botReply) {
      botReply = 'ההודעה התקבלה, אחזור אליך בהקדם 👋';
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
