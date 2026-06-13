
ALTER PUBLICATION supabase_realtime DROP TABLE public.telegram_messages;
DROP TABLE IF EXISTS public.telegram_messages CASCADE;
DROP TABLE IF EXISTS public.telegram_bot_state CASCADE;
