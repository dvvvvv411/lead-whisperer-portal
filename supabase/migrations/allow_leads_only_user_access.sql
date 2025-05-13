
-- Modifizieren der get_all_users-Funktion, um dem Leads-Only-Benutzer Zugriff zu gewähren
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE(id uuid, email text, created_at timestamp with time zone, last_sign_in_at timestamp with time zone, role text, activated boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Überprüfen, ob der aufrufende Benutzer ein Admin ist oder die spezielle ID hat
  IF NOT (
      public.has_role(auth.uid(), 'admin') OR 
      auth.uid() = '7eccf781-5911-4d90-a683-1df251069a2f'
    ) THEN
    RAISE EXCEPTION 'Nur Administratoren können diese Funktion aufrufen.';
  END IF;

  RETURN QUERY
  SELECT 
    au.id,
    au.email::text,
    au.created_at,
    au.last_sign_in_at,
    COALESCE(ur.role::text, 'user') as role,
    COALESCE(
      (SELECT TRUE FROM public.user_roles WHERE user_id = au.id), 
      FALSE
    ) as activated
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  ORDER BY au.created_at DESC;
END;
$$;
