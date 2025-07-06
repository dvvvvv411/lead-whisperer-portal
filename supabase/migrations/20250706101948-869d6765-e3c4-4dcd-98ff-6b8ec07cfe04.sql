-- Function to update total payout status when fee is paid
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
  -- Update the payout status to mark fee as paid
  UPDATE public.total_payouts
  SET 
    fee_paid = true,
    fee_payment_currency = fee_payment_currency_param,
    fee_payment_wallet = fee_payment_wallet_param,
    status = 'fee_paid',
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
    'message', 'Fee payment confirmed successfully'
  );
END;
$$;