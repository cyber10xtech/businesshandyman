
-- Create profiles_private table for sensitive contact info
CREATE TABLE public.profiles_private (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone_number CHARACTER VARYING,
  whatsapp_number CHARACTER VARYING,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles_private ENABLE ROW LEVEL SECURITY;

-- Owner-only SELECT
CREATE POLICY "Users can view their own private profile"
ON public.profiles_private FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Owner-only INSERT
CREATE POLICY "Users can insert their own private profile"
ON public.profiles_private FOR INSERT
WITH CHECK (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Owner-only UPDATE
CREATE POLICY "Users can update their own private profile"
ON public.profiles_private FOR UPDATE
USING (
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Auto-update timestamp trigger
CREATE TRIGGER update_profiles_private_updated_at
BEFORE UPDATE ON public.profiles_private
FOR EACH ROW
EXECUTE FUNCTION public.update_profiles_updated_at();

-- Migrate existing contact data from profiles to profiles_private
INSERT INTO public.profiles_private (profile_id, phone_number, whatsapp_number)
SELECT id, phone_number, whatsapp_number
FROM public.profiles
WHERE phone_number IS NOT NULL OR whatsapp_number IS NOT NULL;

-- Drop contact columns from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone_number;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS whatsapp_number;
