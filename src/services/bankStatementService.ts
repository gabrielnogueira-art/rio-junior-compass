import * as XLSX from 'xlsx';
import { MovimentacaoRioJunior, TaxonomyRioJunior } from '@/types';

export interface RawBankStatementTransaction {
  idTemp: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: 'Despesa' | 'Receita';
  documento?: string;
  contatoSugerido?: string;
  banco: string;
  planoContaSugerido: string;
  iniciativaSugerida: string;
  tipoIniciativaSugerida: string;
  centroCustoSugerido: string;
  categoriaCaixaMinimoSugerida: string;
  isDuplicate: boolean;
  duplicateReason?: string;
  selected: boolean;
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function parseBrazilianAmount(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const clean = val.toString().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

function parseBrazilianDate(val: any): string {
  if (typeof val === 'number') {
    const d = new Date(Math.round((val - 25569) * 86400 * 1000));
    return d.toISOString().split('T')[0];
  }
  if (!val) return new Date().toISOString().split('T')[0];
  const s = val.toString().trim();
  if (s.includes('/')) {
    const parts = s.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      let year = parts[2];
      if (year.length === 2) year = '20' + year;
      return `${year}-${month}-${day}`;
    }
  }
  if (s.length === 8 && !isNaN(Number(s))) {
    // YYYYMMDD
    return `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}`;
  }
  return s.split('T')[0];
}

export class BankStatementService {
  /**
   * Auto-rules engine based on RioJunior financial criteria
   */
  public static autoClassify(
    raw: { data: string; descricao: string; valor: number; tipo: 'Despesa' | 'Receita'; documento?: string; banco: string },
    existingTxs: MovimentacaoRioJunior[],
    taxonomy: TaxonomyRioJunior
  ): RawBankStatementTransaction {
    const dUpper = (raw.descricao || '').toUpperCase();
    const docUpper = (raw.documento || '').toUpperCase();
    const idTemp = `TMP-${Math.random().toString(36).substring(2, 9)}`;

    let planoContaSugerido = raw.tipo === 'Receita' ? '0.4 Outras Receitas' : '1.1.1 Alimentação';
    let iniciativaSugerida = 'N/A';
    let tipoIniciativaSugerida = '';
    let centroCustoSugerido = 'Operações';
    let categoriaCaixaMinimoSugerida = raw.tipo === 'Receita' ? 'Outras Receitas' : 'Outras Despesas';
    let contatoSugerido = '';

    // 1. Identify Tariffs & Bank fees
    if (dUpper.includes('TAR MANUTEN') || dUpper.includes('TARIFA') || dUpper.includes('TAXA DE BOLETO') || dUpper.includes('TAXA DE CART') || dUpper.includes('TAXA BANC')) {
      planoContaSugerido = '1.7.1 Taxas Bancárias';
      categoriaCaixaMinimoSugerida = 'Taxas e impostos';
      centroCustoSugerido = 'Operações';
    }
    // 2. Identify Yields / Rendimentos
    else if (dUpper.includes('RENDE FÁCIL') || dUpper.includes('RENDE FACIL') || dUpper.includes('RENDIMENTO')) {
      planoContaSugerido = '0.3.1 Rendimentos Bancários';
      categoriaCaixaMinimoSugerida = 'Outras Receitas';
      centroCustoSugerido = 'Operações';
    }
    // 3. Identify Junior Enterprises / Annuities
    else if (dUpper.includes('ANUIDADE') || dUpper.includes('LEGADO') || dUpper.includes('PAPO DESIGN') || dUpper.includes('FGV') || dUpper.includes('P&Q') || dUpper.includes('AYRA') || dUpper.includes('CONSULTORIA') || dUpper.includes('ENGENHARIA JR')) {
      if (raw.tipo === 'Receita') {
        planoContaSugerido = '0.2.1 Anuidade';
        categoriaCaixaMinimoSugerida = 'Anuidade';
        centroCustoSugerido = 'Operações';
      }
    }
    // 4. Transportation
    else if (dUpper.includes('UBER') || dUpper.includes('99') || dUpper.includes('GIRO') || dUpper.includes('PASSAGEM') || dUpper.includes('VIACAO') || dUpper.includes('VIAÇÃO') || dUpper.includes('AUTOPASS')) {
      planoContaSugerido = '1.1.3 Transporte';
      categoriaCaixaMinimoSugerida = 'Investimento no membro';
      centroCustoSugerido = 'Operações';
    }
    // 5. Food
    else if (dUpper.includes('IFOOD') || dUpper.includes('RESTAURANTE') || dUpper.includes('PADARIA') || dUpper.includes('ALIMENTACAO') || dUpper.includes('ALIMENTAÇÃO') || dUpper.includes('LANCHONETE') || dUpper.includes('MERCADO')) {
      planoContaSugerido = '1.1.1 Alimentação';
      categoriaCaixaMinimoSugerida = 'Investimento no membro';
      centroCustoSugerido = 'Operações';
    }
    // 6. Hosting / Accommodations
    else if (dUpper.includes('AIRBNB') || dUpper.includes('HOTEL') || dUpper.includes('POUSADA') || dUpper.includes('HOSPEDAGEM')) {
      planoContaSugerido = '1.1.4 Hospedagem';
      categoriaCaixaMinimoSugerida = 'Investimento no membro';
      centroCustoSugerido = 'Operações';
    }
    // 7. Store / Lojinha
    else if (dUpper.includes('LOJINHA') || dUpper.includes('CAMISA') || dUpper.includes('TIRANTE') || dUpper.includes('CANECO') || dUpper.includes('ECOBAG')) {
      if (raw.tipo === 'Receita') {
        planoContaSugerido = '0.1.3 Receita da Lojinha';
        categoriaCaixaMinimoSugerida = 'Venda de Produto';
      } else {
        planoContaSugerido = '1.1.15 Custos da Lojinha';
        categoriaCaixaMinimoSugerida = 'Custos dos produtos';
      }
      iniciativaSugerida = 'Lojinha';
      tipoIniciativaSugerida = 'Produto/Serviço';
      centroCustoSugerido = 'Formação Empreendedora';
    }

    // Identify Events / Initiatives
    if (dUpper.includes('EFEJ')) {
      iniciativaSugerida = 'EFEJ';
      tipoIniciativaSugerida = 'Evento da Rede';
      centroCustoSugerido = 'Formação Empreendedora';
      categoriaCaixaMinimoSugerida = raw.tipo === 'Receita' ? 'Eventos' : 'Custo Evento';
    } else if (dUpper.includes('RJ74')) {
      iniciativaSugerida = 'RJ74';
      tipoIniciativaSugerida = 'Evento da Rede';
      centroCustoSugerido = 'Formação Empreendedora';
      categoriaCaixaMinimoSugerida = raw.tipo === 'Receita' ? 'Eventos' : 'Custo Evento';
    } else if (dUpper.includes('ONDE')) {
      iniciativaSugerida = 'ONDE';
      tipoIniciativaSugerida = 'Evento da Rede';
      centroCustoSugerido = 'Formação Empreendedora';
      categoriaCaixaMinimoSugerida = raw.tipo === 'Receita' ? 'Eventos' : 'Custo Evento';
    } else if (dUpper.includes('CENTRALRIO') || dUpper.includes('CENTRAL RIO')) {
      iniciativaSugerida = 'CentralRIO';
      tipoIniciativaSugerida = 'Evento da Rede';
      centroCustoSugerido = 'Formação Empreendedora';
      categoriaCaixaMinimoSugerida = raw.tipo === 'Receita' ? 'Eventos' : 'Custo Evento';
    } else if (dUpper.includes('IMERSAO') || dUpper.includes('IMERSÃO')) {
      iniciativaSugerida = dUpper.includes('CONSELHO') ? 'Imersão do Conselho' : 'Imersão do Time';
      tipoIniciativaSugerida = dUpper.includes('CONSELHO') ? 'Projeto da Rede' : 'Projeto Interno';
      centroCustoSugerido = dUpper.includes('CONSELHO') ? 'Presidência do Conselho' : 'Operações';
    }

    // Try contact matching
    if (taxonomy?.contacts) {
      for (const c of taxonomy.contacts) {
        if (c && c.length > 3 && dUpper.includes(c.toUpperCase())) {
          contatoSugerido = c;
          break;
        }
      }
    }

    // Check duplicate detection
    let isDuplicate = false;
    let duplicateReason = '';
    const match = existingTxs.find(t => {
      const sameDate = t.dataEfetiva === raw.data;
      const sameVal = Math.abs(t.valorEfetivo - raw.valor) < 0.05;
      const sameBank = t.conta.toLowerCase() === raw.banco.toLowerCase();
      const sameDoc = raw.documento && t.documento && t.documento === raw.documento;
      const sameDesc = t.descricao && raw.descricao && t.descricao.toLowerCase().includes(raw.descricao.toLowerCase().substring(0, 15));

      return sameBank && sameDate && sameVal && (sameDoc || sameDesc);
    });

    if (match) {
      isDuplicate = true;
      duplicateReason = `Possível duplicata de ${match.id} (${match.descricao} - R$ ${match.valorEfetivo})`;
    }

    return {
      idTemp,
      data: raw.data,
      descricao: raw.descricao,
      valor: raw.valor,
      tipo: raw.tipo,
      documento: raw.documento || '',
      contatoSugerido,
      banco: raw.banco,
      planoContaSugerido,
      iniciativaSugerida,
      tipoIniciativaSugerida,
      centroCustoSugerido,
      categoriaCaixaMinimoSugerida,
      isDuplicate,
      duplicateReason,
      selected: !isDuplicate
    };
  }

  /**
   * Parse Excel File (.xlsx, .xls)
   */
  public static parseExcel(
    arrayBuffer: ArrayBuffer,
    defaultBank: string,
    existingTxs: MovimentacaoRioJunior[],
    taxonomy: TaxonomyRioJunior
  ): RawBankStatementTransaction[] {
    const wb = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length < 2) return [];

    const parsed: RawBankStatementTransaction[] = [];
    const header = rows[0].map(h => (h || '').toString().toLowerCase());

    // Detect column indexes
    let idxData = header.findIndex(h => h.includes('data'));
    let idxDesc = header.findIndex(h => h.includes('lançamento') || h.includes('lancamento') || h.includes('descri') || h.includes('histórico') || h.includes('historico'));
    let idxDetalhes = header.findIndex(h => h.includes('detalhe') || h.includes('complemento') || h.includes('observa'));
    let idxDoc = header.findIndex(h => h.includes('documento') || h.includes('doc'));
    let idxValor = header.findIndex(h => h.includes('valor'));
    let idxTipo = header.findIndex(h => h.includes('tipo'));

    if (idxData === -1) idxData = 0;
    if (idxDesc === -1) idxDesc = 1;
    if (idxValor === -1) idxValor = rows[0].length >= 5 ? 4 : 2;

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;

      const desc = (r[idxDesc] || '').toString().trim();
      const descUpper = desc.toUpperCase();

      // Skip summary / balance rows
      if (!desc || descUpper.includes('SALDO ANTERIOR') || descUpper.includes('SALDO DO DIA') || descUpper.includes('SALDO FINAL') || descUpper.includes('S A L D O')) {
        continue;
      }

      const dataStr = parseBrazilianDate(r[idxData]);
      const detalhesStr = idxDetalhes !== -1 ? (r[idxDetalhes] || '').toString().trim() : '';
      const docStr = idxDoc !== -1 ? (r[idxDoc] || '').toString().trim() : '';
      const valorRaw = parseBrazilianAmount(r[idxValor]);
      const tipoRaw = idxTipo !== -1 ? (r[idxTipo] || '').toString().trim() : '';

      if (valorRaw === 0 && !desc) continue;

      let isReceita = valorRaw > 0;
      if (tipoRaw.toLowerCase().includes('entrada') || tipoRaw.toLowerCase().includes('crédito') || tipoRaw.toLowerCase().includes('credito') || tipoRaw.toLowerCase().includes('receita')) {
        isReceita = true;
      } else if (tipoRaw.toLowerCase().includes('saída') || tipoRaw.toLowerCase().includes('saida') || tipoRaw.toLowerCase().includes('débito') || tipoRaw.toLowerCase().includes('debito') || tipoRaw.toLowerCase().includes('despesa')) {
        isReceita = false;
      }

      const fullDesc = desc + (detalhesStr && detalhesStr !== desc ? ` - ${detalhesStr}` : '');

      const classified = this.autoClassify({
        data: dataStr,
        descricao: fullDesc,
        valor: Math.abs(valorRaw),
        tipo: isReceita ? 'Receita' : 'Despesa',
        documento: docStr,
        banco: defaultBank
      }, existingTxs, taxonomy);

      parsed.push(classified);
    }

    return parsed;
  }

  /**
   * Parse OFX Statement format (Universal standard across Brazilian banks)
   */
  public static parseOFX(
    ofxText: string,
    defaultBank: string,
    existingTxs: MovimentacaoRioJunior[],
    taxonomy: TaxonomyRioJunior
  ): RawBankStatementTransaction[] {
    const parsed: RawBankStatementTransaction[] = [];
    const transactionsRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
    let match: RegExpExecArray | null;

    while ((match = transactionsRegex.exec(ofxText)) !== null) {
      const block = match[1];

      const trnTypeMatch = block.match(/<TRNTYPE>([^\r\n<]+)/i);
      const dtPostedMatch = block.match(/<DTPOSTED>([^\r\n<]+)/i);
      const trnAmtMatch = block.match(/<TRNAMT>([^\r\n<]+)/i);
      const fitIdMatch = block.match(/<FITID>([^\r\n<]+)/i);
      const nameMatch = block.match(/<NAME>([^\r\n<]+)/i);
      const memoMatch = block.match(/<MEMO>([^\r\n<]+)/i);

      const trnType = trnTypeMatch ? trnTypeMatch[1].trim().toUpperCase() : '';
      const dtPosted = dtPostedMatch ? dtPostedMatch[1].trim() : '';
      const trnAmt = trnAmtMatch ? parseFloat(trnAmtMatch[1].trim().replace(',', '.')) : 0;
      const fitId = fitIdMatch ? fitIdMatch[1].trim() : '';
      const name = nameMatch ? nameMatch[1].trim() : '';
      const memo = memoMatch ? memoMatch[1].trim() : '';

      const isReceita = trnType === 'CREDIT' || trnAmt > 0;
      const dataStr = parseBrazilianDate(dtPosted.substring(0, 8));
      const fullDesc = name + (memo && memo !== name ? ` - ${memo}` : '');

      if (!fullDesc && trnAmt === 0) continue;

      const classified = this.autoClassify({
        data: dataStr,
        descricao: fullDesc || 'Transação OFX',
        valor: Math.abs(trnAmt),
        tipo: isReceita ? 'Receita' : 'Despesa',
        documento: fitId,
        banco: defaultBank
      }, existingTxs, taxonomy);

      parsed.push(classified);
    }

    return parsed;
  }

  /**
   * Parse CSV Statement format
   */
  public static parseCSV(
    csvText: string,
    defaultBank: string,
    existingTxs: MovimentacaoRioJunior[],
    taxonomy: TaxonomyRioJunior
  ): RawBankStatementTransaction[] {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];

    const delimiter = lines[0].includes(';') ? ';' : ',';
    const parsed: RawBankStatementTransaction[] = [];

    const header = lines[0].split(delimiter).map(h => h.trim().toLowerCase());
    let idxData = header.findIndex(h => h.includes('data'));
    let idxDesc = header.findIndex(h => h.includes('descri') || h.includes('histórico') || h.includes('historico') || h.includes('lançamento') || h.includes('memo'));
    let idxValor = header.findIndex(h => h.includes('valor') || h.includes('amount'));

    if (idxData === -1) idxData = 0;
    if (idxDesc === -1) idxDesc = 1;
    if (idxValor === -1) idxValor = 2;

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(delimiter).map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 2) continue;

      const desc = parts[idxDesc] || '';
      if (desc.toUpperCase().includes('SALDO')) continue;

      const dataStr = parseBrazilianDate(parts[idxData]);
      const valor = parseBrazilianAmount(parts[idxValor]);
      const isReceita = valor > 0;

      const classified = this.autoClassify({
        data: dataStr,
        descricao: desc,
        valor: Math.abs(valor),
        tipo: isReceita ? 'Receita' : 'Despesa',
        banco: defaultBank
      }, existingTxs, taxonomy);

      parsed.push(classified);
    }

    return parsed;
  }

  /**
   * Parse raw text (copied & pasted lines from internet banking)
   */
  public static parsePastedText(
    text: string,
    defaultBank: string,
    existingTxs: MovimentacaoRioJunior[],
    taxonomy: TaxonomyRioJunior
  ): RawBankStatementTransaction[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    const parsed: RawBankStatementTransaction[] = [];

    for (const line of lines) {
      // Look for a date pattern DD/MM/YYYY or YYYY-MM-DD
      const dateMatch = line.match(/(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})/);
      // Look for Brazilian currency R$ 1.234,56 or 1234,56
      const valMatch = line.match(/[-+]?\s*R?\$?\s*([0-9]{1,3}(\.[0-9]{3})*,[0-9]{2})/);

      if (dateMatch && valMatch) {
        const dataStr = parseBrazilianDate(dateMatch[0]);
        const valStr = valMatch[1];
        const isNegative = line.includes('-') || line.toUpperCase().includes('SAÍDA') || line.toUpperCase().includes('DÉBITO');
        const valor = parseBrazilianAmount(valStr);

        let desc = line
          .replace(dateMatch[0], '')
          .replace(valMatch[0], '')
          .replace(/Pix|TED|DOC|Saída|Entrada|Débito|Crédito/gi, '')
          .trim();

        if (!desc) desc = 'Lançamento importado de extrato';

        const classified = this.autoClassify({
          data: dataStr,
          descricao: desc,
          valor: Math.abs(valor),
          tipo: !isNegative ? 'Receita' : 'Despesa',
          banco: defaultBank
        }, existingTxs, taxonomy);

        parsed.push(classified);
      }
    }

    return parsed;
  }
}
