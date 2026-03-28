import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const N8N_WEBHOOK_URL = 'https://n8n.osher.cc/webhook/website-chat-jackie';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { text } = await req.json();
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const trimmedText = text.trim();

    // Store visitor message in DB
    await supabase.from('telegram_messages').insert({
      chat_id: 0,
      sender: 'visitor',
      text: trimmedText,
    });

    // Send to N8N webhook and get response
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmedText }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`N8N webhook failed [${response.status}]: ${responseText}`);
    }

    // Parse response - handle both JSON and plain text
    let botReply: string;
    try {
      const data = JSON.parse(responseText);
      botReply = data.output || data.text || data.message || data.response || responseText;
    } catch {
      botReply = responseText;
    }

    // Store bot reply in DB
    if (botReply && botReply.trim().length > 0) {
      await supabase.from('telegram_messages').insert({
        chat_id: 0,
        sender: 'bot',
        text: botReply.trim(),
      });
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
