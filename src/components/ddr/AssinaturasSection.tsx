import { useRef, useState } from 'react';
import { Loader2, Upload, PenLine } from 'lucide-react';
import { Assinatura, CARGOS_ASSINATURA } from '@/hooks/useCertificados';

interface AssinaturasSectionProps {
  assinaturas: Assinatura[];
  onSalvar: (cargo: string, nome: string, arquivo?: File) => Promise<void>;
}

const AssinaturasSection = ({ assinaturas, onSalvar }: AssinaturasSectionProps) => {
  const [nomes, setNomes] = useState<Record<string, string>>({});
  const [arquivos, setArquivos] = useState<Record<string, File | undefined>>({});
  const [salvandoCargo, setSalvandoCargo] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleSalvar = async (cargo: string) => {
    setSalvandoCargo(cargo);
    try {
      await onSalvar(cargo, nomes[cargo] ?? assinaturas.find((a) => a.cargo === cargo)?.nome ?? '', arquivos[cargo]);
      setArquivos((prev) => ({ ...prev, [cargo]: undefined }));
    } finally {
      setSalvandoCargo(null);
    }
  };

  return (
    <div className="card-elevated p-5 space-y-4">
      <h4 className="font-bold text-foreground flex items-center gap-2">
        <PenLine size={16} className="text-primary" /> Assinaturas dos certificados
      </h4>
      <p className="text-xs text-muted-foreground">
        Envie a assinatura em PNG (fundo transparente de preferência). Elas aparecem em todos os certificados emitidos.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARGOS_ASSINATURA.map((cargo) => {
          const ass = assinaturas.find((a) => a.cargo === cargo);
          return (
            <div key={cargo} className="border border-border rounded-xl p-4 space-y-3">
              <p className="text-sm font-bold text-foreground">{cargo}</p>
              <div className="h-16 flex items-center justify-center bg-secondary/40 rounded-lg overflow-hidden">
                {ass?.signedUrl ? (
                  <img src={ass.signedUrl} alt={`Assinatura ${cargo}`} className="max-h-14 object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground italic">Nenhuma assinatura enviada</span>
                )}
              </div>
              <input
                type="text"
                placeholder="Nome do signatário"
                value={nomes[cargo] ?? ass?.nome ?? ''}
                onChange={(e) => setNomes((prev) => ({ ...prev, [cargo]: e.target.value }))}
                className="input-field"
              />
              <input
                ref={(el) => (fileRefs.current[cargo] = el)}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={(e) => setArquivos((prev) => ({ ...prev, [cargo]: e.target.files?.[0] }))}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => fileRefs.current[cargo]?.click()}
                  className="btn-secondary text-xs py-2 flex items-center gap-1.5"
                >
                  <Upload size={13} /> {arquivos[cargo] ? arquivos[cargo]!.name : 'Escolher PNG'}
                </button>
                <button
                  onClick={() => handleSalvar(cargo)}
                  disabled={salvandoCargo === cargo}
                  className="btn-primary text-xs py-2 flex items-center gap-1.5"
                >
                  {salvandoCargo === cargo && <Loader2 size={13} className="animate-spin" />}
                  Salvar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssinaturasSection;
