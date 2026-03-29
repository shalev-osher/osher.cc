
CREATE TABLE telegram_bot_state (
  id int PRIMARY KEY CHECK (id = 1),
  update_offset bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO telegram_bot_state (id, update_offset) VALUES (1, 0);

ALTER TABLE telegram_bot_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON telegram_bot_state
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE telegram_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id bigint UNIQUE,
  chat_id bigint NOT NULL,
  sender text NOT NULL DEFAULT 'user',
  text text,
  raw_update jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_telegram_messages_chat_id ON telegram_messages (chat_id);
CREATE INDEX idx_telegram_messages_created_at ON telegram_messages (created_at);

ALTER TABLE telegram_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages" ON telegram_messages
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Service role full access" ON telegram_messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.telegram_messages;
