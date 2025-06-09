
-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS auto_create_affiliate_code_trigger ON public.user_roles;
DROP TRIGGER IF EXISTS on_user_role_created ON public.user_roles;

-- Create the function (replace existing one)
CREATE OR REPLACE FUNCTION public.auto_create_affiliate_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create affiliate code for 'user' role, not 'admin' or 'leads_only'
  IF NEW.role = 'user' THEN
    PERFORM public.create_affiliate_code_for_user(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger with the correct name
CREATE TRIGGER on_user_role_created
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_affiliate_code();

-- Create affiliate codes for existing users with 'user' role who don't have one
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT ur.user_id 
    FROM public.user_roles ur
    LEFT JOIN public.affiliate_codes ac ON ur.user_id = ac.user_id
    WHERE ur.role = 'user' AND ac.user_id IS NULL
  LOOP
    PERFORM public.create_affiliate_code_for_user(user_record.user_id);
  END LOOP;
END;
$$;
