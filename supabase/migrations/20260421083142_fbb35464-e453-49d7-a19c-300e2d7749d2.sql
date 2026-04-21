CREATE TABLE public.cv_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language text,
  user_agent text,
  referrer text,
  country text,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cv_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert cv downloads"
ON public.cv_downloads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Service role can read"
ON public.cv_downloads
FOR SELECT
TO service_role
USING (true);

CREATE INDEX idx_cv_downloads_created_at ON public.cv_downloads(created_at DESC);