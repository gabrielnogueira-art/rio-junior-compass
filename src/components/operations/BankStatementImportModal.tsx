import { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  Check, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building2, 
  Sparkles,
  ClipboardList,
  CheckCircle2,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { MovimentacaoRioJunior, TaxonomyRioJunior, PlanoContaItem } from '@/types';
import { BankStatementService, RawBankStatementTransaction } from '@/services/bankStatementService';

interface BankStatementImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportConfirmed: (transactionsToImport: Partial<MovimentacaoRioJunior>[]) => Promise<void>;
  existingTransactions: MovimentacaoRioJunior[];
  taxonomy: TaxonomyRioJunior;
  planoContas: PlanoContaItem[];
}

export const BankStatementImportModal = ({
  isOpen,
  onClose,
  onImportConfirmed,
  existingTransactions,
  taxonomy,
  planoContas
}: BankStatementImportModalProps) => {
  const [banco, setBanco] = useState<string>('Banco do Brasil');
  const [importMode, setImportMode] = useState<'file' | 'paste'>('file');
  const [pastedText, setPastedText] = useState('');
  const [parsedList, setParsedList] = useState<RawBankStatementTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileName, setFileName] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    try {
      const lower = file.name.toLowerCase();
      let results: RawBankStatementTransaction[] = [];

      if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        results = BankStatementService.parseExcel(buffer, banco, existingTransactions, taxonomy);
      } else if (lower.endsWith('.ofx')) {
        const text = await file.text();
        results = BankStatementService.parseOFX(text, banco, existingTransactions, taxonomy);
      } else if (lower.endsWith('.csv')) {
        const text = await file.text();
        results = BankStatementService.parseCSV(text, banco, existingTransactions, taxonomy);
      } else {
        alert('Formato de arquivo não suportado. Por favor, envie um arquivo .xlsx, .xls, .ofx ou .csv.');
        setIsProcessing(false);
        return;
      }

      setParsedList(results);
    } catch (err: any) {
      alert('Erro ao processar o extrato: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPastedText = () => {
    if (!pastedText.trim()) {
      alert('Por favor, cole o texto do extrato bancário na caixa.');
      return;
    }
    setIsProcessing(true);
    try {
      const results = BankStatementService.parsePastedText(pastedText, banco, existingTransactions, taxonomy);
      if (results.length === 0) {
        alert('Nenhum lançamento com data e valor válidos foi detectado no texto colado.');
      }
      setParsedList(results);
    } catch (err: any) {
      alert('Erro ao processar o texto: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelectAll = (select: boolean) => {
    setParsedList(prev => prev.map(item => ({
      ...item,
      selected: select && !item.isDuplicate
    })));
  };

  const updateItem = (idTemp: string, field: keyof RawBankStatementTransaction, value: any) => {
    setParsedList(prev => prev.map(item => {
      if (item.idTemp === idTemp) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const selectedCount = parsedList.filter(p => p.selected).length;
  const duplicateCount = parsedList.filter(p => p.isDuplicate).length;

  const totalEntradasSelected = parsedList
    .filter(p => p.selected && p.tipo === 'Receita')
    .reduce((acc, p) => acc + p.valor, 0);

  const totalSaidasSelected = parsedList
    .filter(p => p.selected && p.tipo === 'Despesa')
    .reduce((acc, p) => acc + p.valor, 0);

  const handleConfirm = async () => {
    const toImport = parsedList.filter(p => p.selected);
    if (toImport.length === 0) {
      alert('Selecione pelo menos um lançamento para importar.');
      return;
    }

    setIsSaving(true);
    try {
      const formatted: Partial<MovimentacaoRioJunior>[] = toImport.map(item => {
        const m = new Date(item.data).getMonth();
        const mesComp = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ][m];

        return {
          tipo: item.tipo,
          dataEfetiva: item.data,
          dataCompetencia: item.data,
          valorEfetivo: item.valor,
          descricao: item.descricao,
          conta: item.banco,
          planoConta: item.planoContaSugerido,
          categoria: item.categoriaCaixaMinimoSugerida || item.planoContaSugerido,
          subcategoria: item.planoContaSugerido,
          iniciativa: item.iniciativaSugerida || 'N/A',
          tipoIniciativa: item.tipoIniciativaSugerida || '',
          centroCusto: item.centroCustoSugerido || 'Operações',
          categoriaCaixaMinimo: item.categoriaCaixaMinimoSugerida || '',
          contato: item.contatoSugerido || '',
          documento: item.documento || '',
          mesComp,
          mesNum: m + 1
        };
      });

      await onImportConfirmed(formatted);
      onClose();
    } catch (err: any) {
      alert('Erro ao importar transações: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const bancos = taxonomy?.contas || ['Banco do Brasil', 'Cora', 'Asaas', 'PagBank', 'Bradesco'];
  const contasPlano = planoContas.map(p => p.conta);
  const iniciativas = (taxonomy as any)?.iniciativas || ['N/A', 'EFEJ', 'RJ74', 'ONDE', 'CentralRIO', 'Lojinha', 'Imersão do Time', 'Imersão do Conselho'];
  const centrosCusto = taxonomy?.centrosCusto || ['Operações', 'Formação Empreendedora', 'Diretoria Executiva', 'Presidência Executiva', 'Presidência do Conselho', 'Desenvolvimento da Rede', 'Vice-Presidência de Negócios'];
  const categoriasCM = (taxonomy as any)?.categoriasCaixaMinimo || ['Investimento no membro', 'Taxas e impostos', 'Custo Evento', 'Anuidade', 'Venda de Produto', 'Investimento na organização', 'Investimento na rede', 'Outras Despesas', 'Outras Receitas'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card w-full max-w-5xl rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[92vh] animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                Importador Inteligente de Extratos Bancários
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  OFX • Excel • CSV
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Atualize as movimentações financeiras da RioJunior diretamente a partir dos extratos do seu banco.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Bank & Input Selection */}
          {parsedList.length === 0 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    1. Selecione a Conta Bancária do Extrato *
                  </label>
                  <select
                    value={banco}
                    onChange={e => setBanco(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                  >
                    {bancos.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    2. Método de Entrada *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setImportMode('file')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                        importMode === 'file'
                          ? 'bg-primary/10 text-primary border-primary shadow-sm'
                          : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                      }`}
                    >
                      <Upload size={14} />
                      <span>Arquivo (OFX / Excel)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportMode('paste')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                        importMode === 'paste'
                          ? 'bg-primary/10 text-primary border-primary shadow-sm'
                          : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
                      }`}
                    >
                      <ClipboardList size={14} />
                      <span>Colar Texto</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              {importMode === 'file' ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-muted/20 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ofx,.xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet size={32} />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-1">
                    {fileName || 'Clique para selecionar ou arraste o extrato bancário'}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-md">
                    Formatos suportados: <strong>OFX</strong> (padrão de todos os bancos), <strong>Excel (.xlsx, .xls)</strong> como o extrato do Banco do Brasil ou Cora, e <strong>CSV</strong>.
                  </p>
                  {isProcessing && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary animate-pulse">
                      <span>Processando extrato bancário...</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Paste text box */
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground block">
                    Cole as linhas do extrato (copiadas do Internet Banking ou PDF):
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Exemplo de linhas:&#10;03/08/2026 Pix - Recebido 100,00 Entrada&#10;04/08/2026 Tar Manuten Conta Ativa -73,00 Saída"
                    value={pastedText}
                    onChange={e => setPastedText(e.target.value)}
                    className="w-full p-4 rounded-xl border border-input bg-background text-foreground font-mono text-xs focus:ring-2 focus:ring-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleProcessPastedText}
                    disabled={isProcessing || !pastedText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Sparkles size={15} />
                    <span>Processar Lançamentos do Texto</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Step 2: Reconciliation & Review Grid */
            <div className="space-y-4">
              {/* Summary KPIs Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">Lançamentos Detectados:</span>
                    <strong className="text-foreground">{parsedList.length}</strong>
                  </div>
                  <span className="text-border">•</span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground">Selecionados:</span>
                    <strong className="text-primary font-bold">{selectedCount}</strong>
                  </div>
                  {duplicateCount > 0 && (
                    <>
                      <span className="text-border">•</span>
                      <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        <AlertTriangle size={14} />
                        <span>{duplicateCount} possíveis duplicados (desmarcados)</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Entradas: +{formatCurrency(totalEntradasSelected)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-destructive font-bold">
                    <span>Saídas: -{formatCurrency(totalSaidasSelected)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setParsedList([]);
                      setFileName('');
                      setPastedText('');
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
                  >
                    Trocar Arquivo
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSelectAll(true)}
                      className="text-primary font-semibold hover:underline"
                    >
                      Selecionar Todos Novos
                    </button>
                    <span>|</span>
                    <button
                      onClick={() => toggleSelectAll(false)}
                      className="text-muted-foreground hover:underline"
                    >
                      Desmarcar Todos
                    </button>
                  </div>
                  <span className="text-muted-foreground">
                    Verifique e ajuste a classificação sugerida antes de importar
                  </span>
                </div>

                <div className="overflow-x-auto max-h-96 scrollbar-thin">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm z-10 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="py-2.5 px-3 text-center">Importar</th>
                        <th className="py-2.5 px-3">Data</th>
                        <th className="py-2.5 px-4">Descrição do Lançamento</th>
                        <th className="py-2.5 px-3">Plano de Contas</th>
                        <th className="py-2.5 px-3">Iniciativa / Projeto</th>
                        <th className="py-2.5 px-3">Centro de Custo</th>
                        <th className="py-2.5 px-3">Caixa Mínimo</th>
                        <th className="py-2.5 px-4 text-right">Valor</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {parsedList.map(item => {
                        const isReceita = item.tipo === 'Receita';

                        return (
                          <tr
                            key={item.idTemp}
                            className={`transition-colors ${
                              item.isDuplicate ? 'bg-amber-500/5 opacity-70' : 'hover:bg-muted/20'
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={item.selected}
                                onChange={e => updateItem(item.idTemp, 'selected', e.target.checked)}
                                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                              />
                            </td>

                            {/* Data */}
                            <td className="py-2.5 px-3 whitespace-nowrap font-medium text-foreground">
                              {item.data}
                            </td>

                            {/* Descrição */}
                            <td className="py-2.5 px-4 max-w-xs">
                              <input
                                type="text"
                                value={item.descricao}
                                onChange={e => updateItem(item.idTemp, 'descricao', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-transparent hover:border-input focus:border-primary bg-transparent text-foreground text-xs font-medium outline-none truncate"
                              />
                              {item.documento && (
                                <span className="text-[10px] text-muted-foreground block truncate">
                                  Doc: {item.documento}
                                </span>
                              )}
                            </td>

                            {/* Plano de Contas */}
                            <td className="py-2.5 px-3 max-w-[150px]">
                              <select
                                value={item.planoContaSugerido}
                                onChange={e => updateItem(item.idTemp, 'planoContaSugerido', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-input bg-background text-foreground text-xs outline-none"
                              >
                                {contasPlano.map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </td>

                            {/* Iniciativa */}
                            <td className="py-2.5 px-3 max-w-[120px]">
                              <select
                                value={item.iniciativaSugerida}
                                onChange={e => updateItem(item.idTemp, 'iniciativaSugerida', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-input bg-background text-foreground text-xs outline-none"
                              >
                                {iniciativas.map((ini: string) => (
                                  <option key={ini} value={ini}>{ini}</option>
                                ))}
                              </select>
                            </td>

                            {/* Centro de Custo */}
                            <td className="py-2.5 px-3 max-w-[130px]">
                              <select
                                value={item.centroCustoSugerido}
                                onChange={e => updateItem(item.idTemp, 'centroCustoSugerido', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-input bg-background text-foreground text-xs outline-none"
                              >
                                {centrosCusto.map(cc => (
                                  <option key={cc} value={cc}>{cc}</option>
                                ))}
                              </select>
                            </td>

                            {/* Caixa Mínimo */}
                            <td className="py-2.5 px-3 max-w-[120px]">
                              <select
                                value={item.categoriaCaixaMinimoSugerida}
                                onChange={e => updateItem(item.idTemp, 'categoriaCaixaMinimoSugerida', e.target.value)}
                                className="w-full px-2 py-1 rounded border border-input bg-background text-foreground text-xs outline-none"
                              >
                                {categoriasCM.map((cm: string) => (
                                  <option key={cm} value={cm}>{cm}</option>
                                ))}
                              </select>
                            </td>

                            {/* Valor */}
                            <td className="py-2.5 px-4 text-right whitespace-nowrap font-bold">
                              <span className={isReceita ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}>
                                {isReceita ? '+ ' : '- '}{formatCurrency(item.valor)}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              {item.isDuplicate ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full" title={item.duplicateReason}>
                                  <AlertTriangle size={11} /> Duplicado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 size={11} /> Novo
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold text-xs transition-colors"
          >
            Cancelar
          </button>

          {parsedList.length > 0 && (
            <button
              onClick={handleConfirm}
              disabled={isSaving || selectedCount === 0}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Check size={16} />
              <span>
                {isSaving ? 'Importando Lançamentos...' : `Importar ${selectedCount} Lançamentos Selecionados`}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
