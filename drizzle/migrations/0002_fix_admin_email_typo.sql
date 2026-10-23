CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, tipo_solicitado, ej_id, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name'),
    NEW.raw_user_meta_data->>'tipo_solicitado',
    NULLIF(NEW.raw_user_meta_data->>'ej_id', '')::uuid,
    CASE WHEN lower(NEW.email) = 'presidencia@riojunior.com.br' THEN 'aprovado' ELSE 'pendente' END
  );
  IF lower(NEW.email) = 'presidencia@riojunior.com.br' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Retroactive fix: approve and grant admin to the correct presidencia@ account if it already signed up
UPDATE public.profiles p
SET status = 'aprovado'
FROM auth.users u
WHERE p.id = u.id AND lower(u.email) = 'presidencia@riojunior.com.br';

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM auth.users u
WHERE lower(u.email) = 'presidencia@riojunior.com.br'
ON CONFLICT DO NOTHING;