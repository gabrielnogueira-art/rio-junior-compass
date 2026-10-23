import { useEffect, useRef, useState } from 'react';
import { Printer, Loader2, Save } from 'lucide-react';
import { CertificadoConfig, CONFIG_PADRAO, Assinatura } from '@/hooks/useCertificados';

interface CertificadoEditorProps {
  ejNome: string;
  eventoNome: string;
  indicador: string;
  textoInicial?: string | null;
  configInicial?: CertificadoConfig | null;
  assinaturas: Assinatura[];
  onSalvar: (texto: string, config: CertificadoConfig) => Promise<void>;
}

const textoPadrao = (ejNome: string, indicador: string, eventoNome: string) =>
  `Certificamos que a empresa júnior ${ejNome} foi reconhecida pelo indicador "${indicador}" durante o evento ${eventoNome}, por sua dedicação e excelência no Movimento Empresa Júnior do Estado do Rio de Janeiro.`;

const CertificadoEditor = ({
  ejNome,
  eventoNome,
  indicador,
  textoInicial,
  configInicial,
  assinaturas,
  onSalvar,
}: CertificadoEditorProps) => {
  const [texto, setTexto] = useState(textoInicial || textoPadrao(ejNome, indicador, eventoNome));
  const [config, setConfig] = useState<CertificadoConfig>(configInicial || CONFIG_PADRAO);
  const [salvando, setSalvando] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const assinatura1 = assinaturas.find((a) => a.cargo === 'Presidente Executivo');
  const assinatura2 = assinaturas.find((a) => a.cargo === 'Diretor de Desenvolvimento da Rede');

  // Injeta o CSS de impressão uma única vez
  useEffect(() => {
    const styleId = 'certificado-print-style';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @media print {
        @page { size: A4 landscape; margin: 0; }
        body * { visibility: hidden; }
        #certificado-print-area, #certificado-print-area * { visibility: visible; }
        #certificado-print-area {
          position: fixed;
          inset: 0;
          width: 297mm;
          height: 210mm;
          padding: 15mm;
          box-sizing: border-box;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await onSalvar(texto, config);
    } finally {
      setSalvando(false);
    }
  };

  const renderAssinatura = (ass: Assinatura | undefined, rotacao: number) => (
    <div className="flex flex-col items-center gap-1">
      {ass?.signedUrl ? (
        <img
          src={ass.signedUrl}
          alt={`Assinatura ${ass.cargo}`}
          style={{ height: config.tamanhoAssinatura / 2, transform: `rotate(${rotacao}deg)` }}
          className="object-contain"
        />
      ) : (
        <div style={{ height: config.tamanhoAssinatura / 2 }} className="flex items-end">
          <span className="text-xs text-muted-foreground italic">(assinatura não cadastrada)</span>
        </div>
      )}
      <div className="w-48 border-t border-foreground pt-1 text-center">
        <p className="text-xs font-bold text-foreground">{ass?.nome || ass?.cargo || ''}</p>
        <p className="text-[10px] text-muted-foreground">{ass?.cargo || ''}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Controles do mini-editor */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div>
          <label className="label-sm">Fonte do nome</label>
          <input
            type="number"
            min={20}
            max={80}
            value={config.tamanhoFonteNome}
            onChange={(e) => setConfig({ ...config, tamanhoFonteNome: parseInt(e.target.value, 10) || 40 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-sm">Fonte do texto</label>
          <input
            type="number"
            min={10}
            max={32}
            value={config.tamanhoFonteTexto}
            onChange={(e) => setConfig({ ...config, tamanhoFonteTexto: parseInt(e.target.value, 10) || 16 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-sm">Tamanho assinaturas</label>
          <input
            type="number"
            min={60}
            max={240}
            value={config.tamanhoAssinatura}
            onChange={(e) => setConfig({ ...config, tamanhoAssinatura: parseInt(e.target.value, 10) || 120 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-sm">Rotação assin. 1 (°)</label>
          <input
            type="number"
            min={-45}
            max={45}
            value={config.rotacaoAssinatura1}
            onChange={(e) => setConfig({ ...config, rotacaoAssinatura1: parseInt(e.target.value, 10) || 0 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-sm">Rotação assin. 2 (°)</label>
          <input
            type="number"
            min={-45}
            max={45}
            value={config.rotacaoAssinatura2}
            onChange={(e) => setConfig({ ...config, rotacaoAssinatura2: parseInt(e.target.value, 10) || 0 })}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="label-sm">Texto do certificado</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          className="input-field resize-none"
        />
      </div>

      {/* Preview A4 paisagem */}
      <div className="overflow-x-auto">
        <div
          id="certificado-print-area"
          ref={printRef}
          className="bg-card border-2 border-primary/30 rounded-lg mx-auto flex flex-col items-center justify-between text-center shadow-lg"
          style={{ width: 1056, height: 748, padding: 56, maxWidth: '100%' }}
        >
          <div className="space-y-2">
            <p className="text-sm font-bold tracking-[0.3em] text-primary uppercase">RioJunior</p>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">
              Federação das Empresas Juniores do Estado do Rio de Janeiro
            </p>
            <h2 className="text-3xl font-extrabold text-foreground tracking-wide mt-4">CERTIFICADO DE RECONHECIMENTO</h2>
          </div>

          <div className="space-y-6 max-w-3xl">
            <p className="font-extrabold text-foreground" style={{ fontSize: config.tamanhoFonteNome }}>
              {ejNome}
            </p>
            <p className="text-muted-foreground leading-relaxed" style={{ fontSize: config.tamanhoFonteTexto }}>
              {texto}
            </p>
          </div>

          <div className="flex items-end justify-center gap-24">
            {renderAssinatura(assinatura1, config.rotacaoAssinatura1)}
            {renderAssinatura(assinatura2, config.rotacaoAssinatura2)}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={handleSalvar} disabled={salvando} className="btn-secondary flex items-center gap-2">
          {salvando ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Salvar alterações
        </button>
        <button onClick={() => window.print()} className="btn-primary flex items-center gap-2">
          <Printer size={15} /> Imprimir / Baixar PDF
        </button>
      </div>
    </div>
  );
};

export default CertificadoEditor;
