CREATE OR REPLACE FUNCTION public.approve_initial_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles p
  SET status = 'aprovado'
  FROM auth.users u
  WHERE p.id = u.id AND lower(u.email) = 'presidencia@riojunior.com.br';
  INSERT INTO public.user_roles (user_id, role)
  SELECT u.id, 'admin'
  FROM auth.users u
  WHERE lower(u.email) = 'presidencia@riojunior.com.br'
  ON CONFLICT DO NOTHING;
END;
$$;

SELECT public.approve_initial_admin();

DROP FUNCTION public.approve_initial_admin();