-- Update the existing function to not automatically approve fee payments
DROP FUNCTION IF EXISTS public.update_total_payout_status(uuid, text, text);

-- Create new function that sets status to pending confirmation instead of approved
CREATE OR REPLACE FUNCTION public.update_total_payout_status(
  payout_id UUID,
  fee_payment_currency_param TEXT,
  fee_payment_wallet_param TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the payout status to mark fee as claimed but pending admin confirmation
  UPDATE public.total_payouts
  SET 
    fee_payment_currency = fee_payment_currency_param,
    fee_payment_wallet = fee_payment_wallet_param,
    status = 'fee_pending_confirmation',
    updated_at = now()
  WHERE id = payout_id;
  
  -- Check if update was successful
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Payout request not found'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Fee payment submitted for admin confirmation'
  );
END;
$$;

-- Create new function for admin to confirm fee payment
CREATE OR REPLACE FUNCTION public.confirm_total_payout_fee(
  payout_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Only administrators can confirm fee payments'
    );
  END IF;
  
  -- Update the payout to mark fee as confirmed
  UPDATE public.total_payouts
  SET 
    fee_paid = true,
    status = 'fee_paid',
    updated_at = now()
  WHERE id = payout_id AND status = 'fee_pending_confirmation';
  
  -- Check if update was successful
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Payout request not found or not in pending confirmation status'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Fee payment confirmed successfully'
  );
END;
$$;