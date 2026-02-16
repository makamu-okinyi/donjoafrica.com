-- Create consultations table for booking form submissions
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  brief TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a consultation (public contact form)
CREATE POLICY "Anyone can submit a consultation"
ON public.consultations
FOR INSERT
WITH CHECK (true);

-- Only allow reading via service role (edge functions) - no public reads
CREATE POLICY "No public reads"
ON public.consultations
FOR SELECT
USING (false);