-- Create table for total payout requests
CREATE TABLE public.total_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  fee_percentage NUMERIC(5,2) NOT NULL,
  unique_url_token TEXT NOT NULL UNIQUE,
  user_balance INTEGER NOT NULL, -- in cents
  payout_currency TEXT,
  payout_wallet_address TEXT,
  fee_paid BOOLEAN NOT NULL DEFAULT false,
  fee_amount INTEGER, -- in cents
  fee_payment_currency TEXT,
  fee_payment_wallet TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, fee_paid, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_admin UUID NOT NULL
);

-- Enable RLS
ALTER TABLE public.total_payouts ENABLE ROW LEVEL SECURITY;

-- Policies for total_payouts
CREATE POLICY "Admins can manage all total payouts" 
ON public.total_payouts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own total payout via unique token" 
ON public.total_payouts 
FOR SELECT 
USING (true); -- We'll handle access control via the unique token in the application

-- Function to generate unique URL token
CREATE OR REPLACE FUNCTION public.generate_payout_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_token TEXT;
  token_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 32-character random token
    new_token := encode(gen_random_bytes(16), 'hex');
    
    -- Check if token already exists
    SELECT EXISTS(SELECT 1 FROM public.total_payouts WHERE unique_url_token = new_token) INTO token_exists;
    
    -- Exit loop if token is unique
    EXIT WHEN NOT token_exists;
  END LOOP;
  
  RETURN new_token;
END;
$$;

-- Function to create total payout request
CREATE OR REPLACE FUNCTION public.create_total_payout_request(
  target_user_id UUID,
  target_user_email TEXT,
  fee_percentage_param NUMERIC,
  admin_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_credit INTEGER;
  new_token TEXT;
  payout_id UUID;
BEGIN
  -- Check if calling user is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Only administrators can create payout requests'
    );
  END IF;
  
  -- Get user's current credit
  SELECT COALESCE(amount, 0) INTO user_credit
  FROM public.user_credits
  WHERE user_id = target_user_id;
  
  -- Generate unique token
  new_token := public.generate_payout_token();
  
  -- Create payout request
  INSERT INTO public.total_payouts (
    user_id,
    user_email,
    fee_percentage,
    unique_url_token,
    user_balance,
    created_by_admin
  ) VALUES (
    target_user_id,
    target_user_email,
    fee_percentage_param,
    new_token,
    user_credit,
    admin_user_id
  )
  RETURNING id INTO payout_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'payout_id', payout_id,
    'unique_token', new_token,
    'unique_url', '/gesamtauszahlung/' || new_token
  );
END;
$$;