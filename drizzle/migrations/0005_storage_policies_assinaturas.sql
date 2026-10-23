CREATE POLICY "Aprovados leem assinaturas storage"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'assinaturas' AND public.is_approved(auth.uid()));

CREATE POLICY "Time envia assinaturas storage"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'assinaturas' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior')));

CREATE POLICY "Time atualiza assinaturas storage"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'assinaturas' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior')));

CREATE POLICY "Time exclui assinaturas storage"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'assinaturas' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'time_riojunior')));