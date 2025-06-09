
-- Add affiliate_code column to leads table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='affiliate_code') THEN
        ALTER TABLE public.leads ADD COLUMN affiliate_code text;
    END IF;
END $$;

-- Add invitation_code column to leads table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='invitation_code') THEN
        ALTER TABLE public.leads ADD COLUMN invitation_code text;
    END IF;
END $$;

-- Create affiliate_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.affiliate_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate_invitations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.affiliate_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID NOT NULL,
  invited_user_id UUID NOT NULL,
  affiliate_code TEXT NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  bonus_paid_to_inviter BOOLEAN NOT NULL DEFAULT false,
  bonus_paid_to_invited BOOLEAN NOT NULL DEFAULT false,
  bonus_paid_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(invited_user_id)
);

-- Create function to generate unique affiliate codes
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substr(md5(random()::text), 1, 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.affiliate_codes WHERE affiliate_codes.code = code) INTO code_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Create function to create affiliate code for user
CREATE OR REPLACE FUNCTION public.create_affiliate_code_for_user(user_id_param uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_code TEXT;
  existing_code TEXT;
BEGIN
  -- Check if user already has a code
  SELECT code INTO existing_code 
  FROM public.affiliate_codes 
  WHERE user_id = user_id_param;
  
  IF existing_code IS NOT NULL THEN
    RETURN existing_code;
  END IF;
  
  -- Generate new code
  new_code := public.generate_affiliate_code();
  
  -- Insert new affiliate code
  INSERT INTO public.affiliate_codes (user_id, code)
  VALUES (user_id_param, new_code);
  
  RETURN new_code;
END;
$$;

-- Create function to process affiliate invitation
CREATE OR REPLACE FUNCTION public.process_affiliate_invitation(invited_user_id_param uuid, affiliate_code_param text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inviter_user_id UUID;
  invitation_exists BOOLEAN;
BEGIN
  -- Check if affiliate code exists and get inviter
  SELECT user_id INTO inviter_user_id
  FROM public.affiliate_codes
  WHERE code = affiliate_code_param;
  
  IF inviter_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Invalid affiliate code'
    );
  END IF;
  
  -- Check if user is trying to invite themselves
  IF inviter_user_id = invited_user_id_param THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Cannot use your own affiliate code'
    );
  END IF;
  
  -- Check if invitation already exists
  SELECT EXISTS(
    SELECT 1 FROM public.affiliate_invitations 
    WHERE invited_user_id = invited_user_id_param
  ) INTO invitation_exists;
  
  IF invitation_exists THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'User already has an affiliate invitation'
    );
  END IF;
  
  -- Create invitation
  INSERT INTO public.affiliate_invitations (
    inviter_id,
    invited_user_id,
    affiliate_code
  ) VALUES (
    inviter_user_id,
    invited_user_id_param,
    affiliate_code_param
  );
  
  -- Give immediate bonus to invited user (50€)
  INSERT INTO public.user_credits (user_id, amount)
  VALUES (invited_user_id_param, 5000) -- 50€ in cents
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    amount = user_credits.amount + 5000,
    last_updated = now();
  
  -- Mark bonus as paid to invited user
  UPDATE public.affiliate_invitations
  SET bonus_paid_to_invited = true
  WHERE invited_user_id = invited_user_id_param;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Affiliate invitation processed successfully'
  );
END;
$$;

-- Create function to pay affiliate bonus to inviter
CREATE OR REPLACE FUNCTION public.pay_affiliate_bonus_to_inviter(invited_user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inviter_user_id UUID;
  bonus_already_paid BOOLEAN;
BEGIN
  -- Get inviter and check if bonus already paid
  SELECT inviter_id, bonus_paid_to_inviter 
  INTO inviter_user_id, bonus_already_paid
  FROM public.affiliate_invitations
  WHERE invited_user_id = invited_user_id_param;
  
  IF inviter_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'No affiliate invitation found'
    );
  END IF;
  
  IF bonus_already_paid THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Bonus already paid to inviter'
    );
  END IF;
  
  -- Give bonus to inviter (50€)
  INSERT INTO public.user_credits (user_id, amount)
  VALUES (inviter_user_id, 5000) -- 50€ in cents
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    amount = user_credits.amount + 5000,
    last_updated = now();
  
  -- Mark bonus as paid
  UPDATE public.affiliate_invitations
  SET 
    bonus_paid_to_inviter = true,
    bonus_paid_at = now()
  WHERE invited_user_id = invited_user_id_param;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Affiliate bonus paid to inviter'
  );
END;
$$;

-- Create function to get affiliate statistics for admin
CREATE OR REPLACE FUNCTION public.get_affiliate_statistics()
RETURNS TABLE(inviter_email text, inviter_id uuid, affiliate_code text, total_invitations bigint, total_bonuses_paid bigint, total_bonus_amount integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can view affiliate statistics';
  END IF;

  RETURN QUERY
  SELECT 
    au.email::TEXT as inviter_email,
    ac.user_id as inviter_id,
    ac.code as affiliate_code,
    COUNT(ai.id) as total_invitations,
    COUNT(CASE WHEN ai.bonus_paid_to_inviter THEN 1 END) as total_bonuses_paid,
    (COUNT(CASE WHEN ai.bonus_paid_to_inviter THEN 1 END) * 5000)::INTEGER as total_bonus_amount
  FROM public.affiliate_codes ac
  JOIN auth.users au ON ac.user_id = au.id
  LEFT JOIN public.affiliate_invitations ai ON ac.user_id = ai.inviter_id
  GROUP BY ac.user_id, ac.code, au.email
  HAVING COUNT(ai.id) > 0
  ORDER BY total_invitations DESC, total_bonuses_paid DESC;
END;
$$;

-- Create function to get user activation info with affiliate consideration
CREATE OR REPLACE FUNCTION public.get_user_activation_info(user_id_param uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create trigger to automatically create affiliate codes for new users
CREATE OR REPLACE FUNCTION public.auto_create_affiliate_code()
RETURNS trigger
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

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_user_role_created ON public.user_roles;
CREATE TRIGGER on_user_role_created
  AFTER INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_affiliate_code();

-- Create trigger to process affiliate bonus on first successful payment
CREATE OR REPLACE FUNCTION public.process_affiliate_bonus_on_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_payment_completed ON public.payments;
CREATE TRIGGER on_payment_completed
  AFTER UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.process_affiliate_bonus_on_payment();
