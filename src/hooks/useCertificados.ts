import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Certificado {
  id: string;
  ejId: string;
  eventoId: string;
  indicador: string;
  textoCertificado: string | null;
  configEditor: CertificadoConfig | null;
  emitidoEm: string;
  ejNome?: string;
}

export interface CertificadoConfig {
  tamanhoFonteNome: number;
  tamanhoFonteTexto: number;
  rotacaoAssinatura1: number;
  rotacaoAssinatura2: number;
  tamanhoAssinatura: number;
}

export const CONFIG_PADRAO: CertificadoConfig = {
  tamanhoFonteNome: 40,
  tamanhoFonteTexto: 16,
  rotacaoAssinatura1: 0,
  rotacaoAssinatura2: 0,
  tamanhoAssinatura: 120,
};

export interface Assinatura {
  id: string;
  cargo: string;
  nome: string | null;
  pngUrl: string | null;
  /** URL assinada temporária para exibição (bucket privado) */
  signedUrl?: string | null;
}

export const CARGOS_ASSINATURA = ['Presidente Executivo', 'Diretor de Desenvolvimento da Rede'] as const;

async function assinarUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from('assinaturas').createSignedUrl(path, 3600);
  if (error) {
    console.error('Erro ao assinar URL:', error);
    return null;
  }
  return data.signedUrl;
}

export function useCertificados() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDados = useCallback(async () => {
    try {
      const [{ data: certData, error: certErr }, { data: assData, error: assErr }] = await Promise.all([
        supabase
          .from('certificados')
          .select('*, ejs!certificados_ej_id_fkey(nome)')
          .order('emitido_em', { ascending: false }),
        supabase.from('assinaturas_certificado').select('*').order('cargo'),
      ]);
      if (certErr) throw certErr;
      if (assErr) throw assErr;

      setCertificados(
        (certData || []).map((c: any) => ({
          id: c.id,
          ejId: c.ej_id,
          eventoId: c.evento_id,
          indicador: c.indicador,
          textoCertificado: c.texto_certificado,
          configEditor: c.config_editor as CertificadoConfig | null,
          emitidoEm: c.emitido_em,
          ejNome: c.ejs?.nome,
        }))
      );

      const assinaturasComUrl = await Promise.all(
        (assData || []).map(async (a: any) => ({
          id: a.id,
          cargo: a.cargo,
          nome: a.nome,
          pngUrl: a.png_url,
          signedUrl: await assinarUrl(a.png_url),
        }))
      );
      setAssinaturas(assinaturasComUrl);
    } catch (error) {
      console.error('Erro ao carregar certificados:', error);
      toast({ title: 'Erro ao carregar certificados', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const emitirCertificado = async (cert: {
    ejId: string;
    eventoId: string;
    indicador: string;
    textoCertificado?: string;
    configEditor?: CertificadoConfig;
  }) => {
    try {
      const { error } = await supabase.from('certificados').upsert(
        {
          ej_id: cert.ejId,
          evento_id: cert.eventoId,
          indicador: cert.indicador,
          texto_certificado: cert.textoCertificado || null,
          config_editor: (cert.configEditor || CONFIG_PADRAO) as any,
        },
        { onConflict: 'ej_id,evento_id,indicador' }
      );
      if (error) throw error;
      await fetchDados();
      toast({ title: 'Certificado emitido!' });
    } catch (error) {
      console.error('Erro ao emitir certificado:', error);
      toast({ title: 'Erro ao emitir certificado', variant: 'destructive' });
      throw error;
    }
  };

  const atualizarCertificado = async (
    id: string,
    campos: { textoCertificado?: string; configEditor?: CertificadoConfig }
  ) => {
    try {
      const updateData: any = {};
      if (campos.textoCertificado !== undefined) updateData.texto_certificado = campos.textoCertificado;
      if (campos.configEditor !== undefined) updateData.config_editor = campos.configEditor as any;
      const { error } = await supabase.from('certificados').update(updateData).eq('id', id);
      if (error) throw error;
      await fetchDados();
    } catch (error) {
      console.error('Erro ao atualizar certificado:', error);
      toast({ title: 'Erro ao atualizar certificado', variant: 'destructive' });
      throw error;
    }
  };

  const excluirCertificado = async (id: string) => {
    try {
      const { error } = await supabase.from('certificados').delete().eq('id', id);
      if (error) throw error;
      await fetchDados();
      toast({ title: 'Certificado excluído!' });
    } catch (error) {
      console.error('Erro ao excluir certificado:', error);
      toast({ title: 'Erro ao excluir certificado', variant: 'destructive' });
      throw error;
    }
  };

  const salvarAssinatura = async (cargo: string, nome: string, arquivo?: File) => {
    try {
      let pngUrl: string | null = assinaturas.find((a) => a.cargo === cargo)?.pngUrl ?? null;

      if (arquivo) {
        const path = `${cargo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}.png`;
        const { error: upErr } = await supabase.storage.from('assinaturas').upload(path, arquivo, {
          contentType: 'image/png',
          upsert: true,
        });
        if (upErr) throw upErr;
        pngUrl = path;
      }

      const { error } = await supabase
        .from('assinaturas_certificado')
        .upsert({ cargo, nome: nome || null, png_url: pngUrl }, { onConflict: 'cargo' });
      if (error) throw error;
      await fetchDados();
      toast({ title: 'Assinatura salva!' });
    } catch (error) {
      console.error('Erro ao salvar assinatura:', error);
      toast({ title: 'Erro ao salvar assinatura', variant: 'destructive' });
      throw error;
    }
  };

  return {
    certificados,
    assinaturas,
    loading,
    emitirCertificado,
    atualizarCertificado,
    excluirCertificado,
    salvarAssinatura,
    refetch: fetchDados,
  };
}
