
-- Add invitation_code field to leads table if it doesn't exist
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS invitation_code TEXT;

-- Create function to automatically create affiliate code when user gets 'user' role
CREATE OR REPLACE FUNCTION public.auto_create_affiliate_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create affiliate code for 'user' role, not 'admin' or 'leads_only'
  IF NEW.role = 'user' THEN
    PERFORM public.create_affiliate_code_for_user(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create affiliate codes
DROP TRIGGER IF EXISTS trigger_auto_create_affiliate_code ON public.user_roles;
CREATE TRIGGER trigger_auto_create_affiliate_code
  AFTER INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_affiliate_code();

-- Create trigger to pay affiliate bonus when first payment is completed
CREATE OR REPLACE FUNCTION public.process_affiliate_bonus_on_payment()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_process_affiliate_bonus ON public.payments;
CREATE TRIGGER trigger_process_affiliate_bonus
  AFTER UPDATE OF status ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.process_affiliate_bonus_on_payment();
