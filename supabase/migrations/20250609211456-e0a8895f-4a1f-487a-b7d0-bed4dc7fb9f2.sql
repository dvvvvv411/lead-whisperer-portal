
-- Create affiliate_codes table to store unique invitation codes for users
CREATE TABLE public.affiliate_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create affiliate_invitations table to track invitations and bonuses
CREATE TABLE public.affiliate_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  bonus_paid_to_inviter BOOLEAN NOT NULL DEFAULT FALSE,
  bonus_paid_to_invited BOOLEAN NOT NULL DEFAULT FALSE,
  bonus_paid_at TIMESTAMP WITH TIME ZONE NULL,
  UNIQUE(invited_user_id) -- Each user can only be invited once
);

-- Add affiliate_code column to leads table for tracking lead sources
ALTER TABLE public.leads ADD COLUMN affiliate_code TEXT NULL;

-- Enable RLS on new tables
ALTER TABLE public.affiliate_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for affiliate_codes
CREATE POLICY "Users can view their own affiliate code" 
  ON public.affiliate_codes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own affiliate code" 
  ON public.affiliate_codes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all affiliate codes" 
  ON public.affiliate_codes 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for affiliate_invitations
CREATE POLICY "Users can view their own invitations (as inviter)" 
  ON public.affiliate_invitations 
  FOR SELECT 
  USING (auth.uid() = inviter_id);

CREATE POLICY "Users can view their own invitations (as invited)" 
  ON public.affiliate_invitations 
  FOR SELECT 
  USING (auth.uid() = invited_user_id);

CREATE POLICY "System can create invitations" 
  ON public.affiliate_invitations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can view all invitations" 
  ON public.affiliate_invitations 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update invitations" 
  ON public.affiliate_invitations 
  FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to generate unique affiliate code
CREATE OR REPLACE FUNCTION public.generate_affiliate_code()
RETURNS TEXT
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

-- Function to create affiliate code for user
CREATE OR REPLACE FUNCTION public.create_affiliate_code_for_user(user_id_param UUID)
RETURNS TEXT
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

-- Function to process affiliate invitation
CREATE OR REPLACE FUNCTION public.process_affiliate_invitation(
  invited_user_id_param UUID,
  affiliate_code_param TEXT
)
RETURNS JSONB
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

-- Function to pay affiliate bonus to inviter (called when invited user makes first deposit)
CREATE OR REPLACE FUNCTION public.pay_affiliate_bonus_to_inviter(invited_user_id_param UUID)
RETURNS JSONB
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

-- Function to get affiliate statistics (for admin)
CREATE OR REPLACE FUNCTION public.get_affiliate_statistics()
RETURNS TABLE(
  inviter_email TEXT,
  inviter_id UUID,
  affiliate_code TEXT,
  total_invitations BIGINT,
  total_bonuses_paid BIGINT,
  total_bonus_amount INTEGER
)
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

-- Trigger to automatically create affiliate code when user gets a role
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

-- Create trigger on user_roles table
CREATE TRIGGER auto_create_affiliate_code_trigger
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_affiliate_code();

-- Trigger to pay affiliate bonus when user makes first successful payment
CREATE OR REPLACE FUNCTION public.process_affiliate_bonus_on_payment()
RETURNS TRIGGER
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

-- Create trigger on payments table
CREATE TRIGGER process_affiliate_bonus_trigger
  AFTER INSERT OR UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.process_affiliate_bonus_on_payment();
