DROP POLICY IF EXISTS "Service role can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can insert cv downloads" ON public.cv_downloads;
DROP POLICY IF EXISTS "Service role only" ON public.telegram_bot_state;
DROP POLICY IF EXISTS "Service role full access" ON public.telegram_messages;

CREATE POLICY "Backend can insert contact submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Backend can insert cv downloads"
ON public.cv_downloads
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Backend can manage telegram bot state"
ON public.telegram_bot_state
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Backend can manage telegram messages"
ON public.telegram_messages
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');