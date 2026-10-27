// src/utils/gradeExportUtils.ts
// Exportador Oficial da Grade de Conteúdo em PDF e XLSX para a RioJunior

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PautaEvento, TIPO_MOMENTO_LABELS, MINISTRANTE_TIPO_LABELS } from '@/hooks/useGradeConteudo';
import { calculateEndTime, calculateDuration, formatDurationLabel } from '@/components/formation/timeUtils';

interface EventoInfo {
  id: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
}

interface CotasInfo {
  magnasVendaveis?: number;
  paralelasVendaveis?: number;
  magnasNaGrade?: number;
  paralelasNaGrade?: number;
}

// -------------------------------------------------------------
// EXPORTAÇÃO PARA EXCEL (.XLSX)
// -------------------------------------------------------------
export function exportGradeToExcel(
  evento: EventoInfo | undefined,
  pautas: PautaEvento[],
  cotas?: CotasInfo
): void {
  const nomeEvento = evento?.nome || 'Evento RioJunior';
  const dataInicioFormatada = evento?.dataInicio
    ? format(new Date(evento.dataInicio + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })
    : '-';
  const dataFimFormatada = evento?.dataFim
    ? format(new Date(evento.dataFim + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })
    : '-';

  // Ordena pautas cronologicamente
  const pautasOrdenadas = [...pautas].sort((a, b) => {
    if (a.dia && b.dia && a.dia !== b.dia) {
      return a.dia.localeCompare(b.dia);
    }
    const hA = a.horario || '';
    const hB = b.horario || '';
    return hA.localeCompare(hB);
  });

  // Linhas da tabela
  const rows = pautasOrdenadas.map((p, idx) => {
    const diaFormatado = p.dia
      ? format(new Date(p.dia + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })
      : 'Dia Geral';

    const tipoLabel = TIPO_MOMENTO_LABELS[p.tipo] || p.tipo || 'Momento';
    const ministranteTipoLabel = p.ministranteTipo
      ? MINISTRANTE_TIPO_LABELS[p.ministranteTipo] || p.ministranteTipo
      : 'N/A';

    let statusComercial = 'N/A';
    if (p.tipo === 'magna' || p.tipo === 'paralela') {
      statusComercial = p.vendaId || p.parceiroNome ? `Vendida (${p.parceiroNome || 'Parceiro'})` : 'Disponível para Venda';
    }

    return {
      '#': idx + 1,
      'Dia': diaFormatado,
      'Horário': p.horario || 'A definir',
      'Tipo de Momento': tipoLabel,
      'Título / Pauta': p.titulo || 'Sem título',
      'Temática Macro': p.tematicaMacro || 'Geral',
      'Ministrante / Facilitador': p.ministranteNome || 'A definir',
      'Tipo de Ministrante': ministranteTipoLabel,
      'Empresa Parceira': p.parceiroNome || '-',
      'Status Comercial (VPNeg)': statusComercial,
      'CSAT Esperado': p.csat !== null ? `${p.csat}%` : '-'
    };
  });

  const ws = XLSX.utils.sheet_add_json(XLSX.utils.aoa_to_sheet([]), rows, { origin: 'A6' });

  // Cabeçalho institucional estilizado
  XLSX.utils.sheet_add_aoa(
    ws,
    [
      ['RIOJUNIOR - FEDERAÇÃO DAS EMPRESAS JUNIORES DO ESTADO DO RIO DE JANEIRO'],
      [`GRADE OFICIAL DE CONTEÚDO - ${nomeEvento.toUpperCase()}`],
      [`Período do Evento: ${dataInicioFormatada} a ${dataFimFormatada} | Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`],
      [`Total de Momentos: ${pautas.length} | Magnas na Grade: ${cotas?.magnasNaGrade ?? 0} | Paralelas na Grade: ${cotas?.paralelasNaGrade ?? 0}`],
      [] // linha em branco antes da tabela
    ],
    { origin: 'A1' }
  );

  // Largura automática das colunas
  ws['!cols'] = [
    { wch: 5 },  // #
    { wch: 14 }, // Dia
    { wch: 14 }, // Horário
    { wch: 20 }, // Tipo
    { wch: 35 }, // Título
    { wch: 22 }, // Temática
    { wch: 26 }, // Ministrante
    { wch: 22 }, // Tipo Ministrante
    { wch: 24 }, // Parceiro
    { wch: 28 }, // Status VPNeg
    { wch: 14 }  // CSAT
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Grade de Conteúdo');

  // Adiciona aba com resumo de cotas e métricas
  const wsResumo = XLSX.utils.aoa_to_sheet([
    ['MÉTRICAS DA GRADE DE FORMAÇÃO EMPREENDEDORA - RIOJUNIOR'],
    [''],
    ['Indicador', 'Valor'],
    ['Evento', nomeEvento],
    ['Data Início', dataInicioFormatada],
    ['Data Fim', dataFimFormatada],
    ['Total de Momentos / Pautas', pautas.length],
    ['Pautas Magnas Cadastradas', pautas.filter(p => p.tipo === 'magna').length],
    ['Pautas Paralelas Cadastradas', pautas.filter(p => p.tipo === 'paralela').length],
    ['Cotas Magnas Vendáveis VPNeg', cotas?.magnasVendaveis ?? 0],
    ['Cotas Paralelas Vendáveis VPNeg', cotas?.paralelasVendaveis ?? 0],
    ['Pautas com Parceiro Comercial Confirmado', pautas.filter(p => p.vendaId || p.parceiroNome).length]
  ]);
  wsResumo['!cols'] = [{ wch: 38 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo Executivo');

  const cleanFileName = `Grade_${nomeEvento.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().getFullYear()}.xlsx`;
  XLSX.writeFile(wb, cleanFileName);
}

// -------------------------------------------------------------
// EXPORTAÇÃO PARA PDF (.PDF)
// -------------------------------------------------------------
export function exportGradeToPDF(
  evento: EventoInfo | undefined,
  pautas: PautaEvento[],
  cotas?: CotasInfo
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const nomeEvento = evento?.nome || 'Evento RioJunior';
  const dataInicioFormatada = evento?.dataInicio
    ? format(new Date(evento.dataInicio + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })
    : '-';
  const dataFimFormatada = evento?.dataFim
    ? format(new Date(evento.dataFim + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })
    : '-';

  const pautasOrdenadas = [...pautas].sort((a, b) => {
    if (a.dia && b.dia && a.dia !== b.dia) {
      return a.dia.localeCompare(b.dia);
    }
    const hA = a.horario || '';
    const hB = b.horario || '';
    return hA.localeCompare(hB);
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Banner (Navy Blue)
  doc.setFillColor(15, 28, 53);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Gold accent line
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 28, pageWidth, 1.8, 'F');

  // Logo / RJ Symbol
  doc.setFillColor(30, 58, 138);
  doc.roundedRect(12, 5, 18, 18, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('RJ', 21, 16.5, { align: 'center' });

  // Header Title
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('RioJunior | Grade Oficial de Conteúdo & Formação', 36, 12);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Evento: ${nomeEvento}  •  Período: ${dataInicioFormatada} a ${dataFimFormatada}  •  Vigência ${new Date().getFullYear()}`,
    36,
    18
  );
  doc.text(
    `Federação das Empresas Juniores do Estado do Rio de Janeiro  •  Diretoria de Formação Empreendedora`,
    36,
    23
  );

  // Metric Cards on Top
  const startY = 34;
  const cardW = (pageWidth - 24 - 15) / 4;
  const metrics = [
    { label: 'Total de Momentos', value: String(pautas.length), color: [59, 130, 246] },
    { label: 'Pautas Magnas', value: `${cotas?.magnasNaGrade ?? pautas.filter(p => p.tipo === 'magna').length} na grade`, color: [168, 85, 247] },
    { label: 'Pautas Paralelas', value: `${cotas?.paralelasNaGrade ?? pautas.filter(p => p.tipo === 'paralela').length} na grade`, color: [16, 185, 129] },
    { label: 'Vagas VPNeg', value: `${(cotas?.magnasVendaveis ?? 0) + (cotas?.paralelasVendaveis ?? 0)} cotas totais`, color: [245, 158, 11] }
  ];

  metrics.forEach((m, i) => {
    const x = 12 + i * (cardW + 5);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, startY, cardW, 14, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, startY, cardW, 14, 2, 2, 'S');

    // Label
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(m.label.toUpperCase(), x + 4, startY + 5);

    // Value
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.value, x + 4, startY + 11);
  });

  // Table Data Preparation
  const tableData = pautasOrdenadas.map((p, idx) => {
    const diaFormatado = p.dia
      ? format(new Date(p.dia + 'T12:00:00'), 'dd/MM', { locale: ptBR })
      : 'Geral';

    const tipoLabel = TIPO_MOMENTO_LABELS[p.tipo] || p.tipo || 'Momento';
    const ministranteTipoLabel = p.ministranteTipo
      ? MINISTRANTE_TIPO_LABELS[p.ministranteTipo] || p.ministranteTipo
      : '-';

    let statusComercial = '-';
    if (p.tipo === 'magna' || p.tipo === 'paralela') {
      statusComercial = p.vendaId || p.parceiroNome ? `Vendida: ${p.parceiroNome || 'Parceiro'}` : 'Disponível';
    }

    return [
      idx + 1,
      diaFormatado,
      p.horario || '-',
      tipoLabel,
      p.titulo || 'Sem título',
      p.tematicaMacro || '-',
      p.ministranteNome || '-',
      ministranteTipoLabel,
      p.parceiroNome || '-',
      statusComercial
    ];
  });

  // Render Table using autoTable
  autoTable(doc, {
    startY: startY + 18,
    margin: { left: 12, right: 12, bottom: 15 },
    head: [[
      '#',
      'Dia',
      'Horário',
      'Tipo de Momento',
      'Título / Pauta da Grade',
      'Temática',
      'Ministrante / Facilitador',
      'Origem',
      'Parceiro',
      'Status VPNeg'
    ]],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
      font: 'helvetica',
      textColor: [30, 41, 59]
    },
    headStyles: {
      fillColor: [15, 28, 53],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left'
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 14, halign: 'center' },
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 26, fontStyle: 'bold' },
      4: { cellWidth: 60, fontStyle: 'bold' },
      5: { cellWidth: 26 },
      6: { cellWidth: 35 },
      7: { cellWidth: 24 },
      8: { cellWidth: 30 },
      9: { cellWidth: 32 }
    },
    didParseCell: (data) => {
      // Color-coding based on type
      if (data.section === 'body' && data.column.index === 3) {
        const text = String(data.cell.raw);
        if (text.includes('Magna')) {
          data.cell.styles.textColor = [126, 34, 206]; // Purple
        } else if (text.includes('Paralela')) {
          data.cell.styles.textColor = [5, 150, 105]; // Emerald
        } else if (text.includes('Abertura') || text.includes('Encerramento')) {
          data.cell.styles.textColor = [180, 83, 9]; // Amber
        } else if (text.includes('Intervalo') || text.includes('Almoço')) {
          data.cell.styles.textColor = [100, 116, 139]; // Slate
        }
      }
      // Status VPNeg
      if (data.section === 'body' && data.column.index === 9) {
        const text = String(data.cell.raw);
        if (text.includes('Vendida')) {
          data.cell.styles.textColor = [5, 150, 105];
          data.cell.styles.fontStyle = 'bold';
        } else if (text.includes('Disponível')) {
          data.cell.styles.textColor = [217, 119, 6];
        }
      }
    },
    didDrawPage: (data) => {
      // Footer on all pages
      const str = `Página ${data.pageNumber}`;
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `RioJunior • Sistema Integrado de Gestão • Grade gerada em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
        12,
        pageHeight - 6
      );
      doc.text(str, pageWidth - 12, pageHeight - 6, { align: 'right' });
    }
  });

  const cleanFileName = `Grade_${nomeEvento.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().getFullYear()}.pdf`;
  doc.save(cleanFileName);
}
