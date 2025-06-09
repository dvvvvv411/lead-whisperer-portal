
-- Add invitation_code field to leads table for affiliate tracking
ALTER TABLE public.leads 
ADD COLUMN invitation_code TEXT;

-- Create index for faster lookups on invitation codes
CREATE INDEX idx_leads_invitation_code ON public.leads(invitation_code);

-- Update the process_affiliate_bonus_on_payment function to handle the new 200€ threshold
CREATE OR REPLACE FUNCTION public.process_affiliate_bonus_on_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Only process for completed payments that are not bot trades
  IF NEW.status = 'completed' AND (NEW.notes IS NULL OR NEW.notes NOT LIKE 'KI-Bot:%') THEN
    -- Check if this is the user's first successful payment
    IF NOT EXISTS (
      SELECT 1 FROM public.payments 
      WHERE user_id = NEW.user_id 
        AND status = 'completed' 
        AND id != NEW.id
        AND (notes IS NULL OR notes NOT LIKE 'KI-Bot:%')
    ) THEN
      -- This is the first payment, pay affiliate bonus to inviter
      PERFORM public.pay_affiliate_bonus_to_inviter(NEW.user_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create function to get user's invitation status and required activation amount
CREATE OR REPLACE FUNCTION public.get_user_activation_info(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  has_invitation BOOLEAN;
  current_credit INTEGER;
  required_amount INTEGER;
BEGIN
  -- Check if user has an affiliate invitation (got the 50€ bonus)
  SELECT EXISTS(
    SELECT 1 FROM public.affiliate_invitations 
    WHERE invited_user_id = user_id_param 
    AND bonus_paid_to_invited = true
  ) INTO has_invitation;
  
  -- Get current credit
  SELECT COALESCE(amount, 0) INTO current_credit
  FROM public.user_credits
  WHERE user_id = user_id_param;
  
  -- If user has invitation bonus, they need 200€ total (already have 50€)
  -- If no invitation bonus, they need 250€ total
  IF has_invitation THEN
    required_amount := 20000; -- 200€ in cents
  ELSE
    required_amount := 25000; -- 250€ in cents
  END IF;
  
  RETURN jsonb_build_object(
    'has_invitation_bonus', has_invitation,
    'current_credit', current_credit,
    'required_amount', required_amount,
    'is_activated', current_credit >= required_amount
  );
END;
$function$;
