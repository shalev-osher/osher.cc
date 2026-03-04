-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert
CREATE POLICY "Service role can insert contact submissions"
  ON public.contact_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to select
CREATE POLICY "Service role can select contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO service_role
  USING (true);