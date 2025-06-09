
-- Fix the generate_affiliate_code function to resolve column ambiguity
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    new_code := upper(substr(md5(random()::text), 1, 8));
    
    -- Check if code already exists (with explicit table reference)
    SELECT EXISTS(SELECT 1 FROM public.affiliate_codes WHERE affiliate_codes.code = new_code) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$$;
