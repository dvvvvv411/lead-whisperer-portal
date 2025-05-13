
-- Create a SQL function that allows admins to delete users
CREATE OR REPLACE FUNCTION public.delete_user_as_admin(user_id_to_delete UUID)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER -- This makes the function run with the privileges of the creator
AS $$
DECLARE
  caller_is_admin BOOLEAN;
BEGIN
  -- Check if the calling user is an admin
  SELECT public.has_role(auth.uid(), 'admin') INTO caller_is_admin;
  
  IF NOT caller_is_admin THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;
  
  -- Delete user from auth.users which will cascade to all related data
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.delete_user_as_admin(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_user_as_admin(UUID) TO authenticated;
