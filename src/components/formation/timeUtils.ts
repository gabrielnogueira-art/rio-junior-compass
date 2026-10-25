/**
 * Utilitários para cálculo inteligente de horários e durações na Grade de Conteúdo
 */

export function parseTime(timeStr: string): number | null {
  if (!timeStr) return null;
  const clean = timeStr.trim().toLowerCase();

  // Caso: 14h30 ou 14h
  const matchH = clean.match(/^(\d{1,2})h(\d{1,2})?$/);
  if (matchH) {
    const h = parseInt(matchH[1], 10);
    const m = matchH[2] ? parseInt(matchH[2], 10) : 0;
    if (h >= 0 && h < 24 && m >= 0 && m < 60) return h * 60 + m;
  }

  // Caso: 14:30 ou 9:30
  const matchColon = clean.match(/^(\d{1,2}):(\d{1,2})$/);
  if (matchColon) {
    const h = parseInt(matchColon[1], 10);
    const m = parseInt(matchColon[2], 10);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) return h * 60 + m;
  }

  return null;
}

export function minutesToTime(minutes: number): string {
  const norm = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatDurationLabel(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMins = parseTime(startTime);
  if (startMins === null || !durationMinutes || durationMinutes <= 0) return '';
  return minutesToTime(startMins + durationMinutes);
}

export function calculateDuration(startTime: string, endTime: string): number {
  const startMins = parseTime(startTime);
  const endMins = parseTime(endTime);
  if (startMins === null || endMins === null) return 0;
  let diff = endMins - startMins;
  if (diff < 0) diff += 1440; // Passou da meia-noite
  return diff;
}

export function extractTimesFromHorario(horario: string): { inicio: string; fim: string; duracao: number } {
  if (!horario) return { inicio: '', fim: '', duracao: 0 };
  const clean = horario.trim();

  // Padrões como: "09:00 às 10:30", "09:00 - 10:30", "09:00 a 10:30", "14h às 15h30"
  const parts = clean.split(/\s*(?:às|as|-|a|to)\s*/i);
  if (parts.length >= 2) {
    const startMins = parseTime(parts[0]);
    const endMins = parseTime(parts[1]);
    const inicio = startMins !== null ? minutesToTime(startMins) : parts[0].trim();
    const fim = endMins !== null ? minutesToTime(endMins) : parts[1].trim();
    const duracao = startMins !== null && endMins !== null ? calculateDuration(inicio, fim) : 0;
    return { inicio, fim, duracao };
  }

  const singleMins = parseTime(clean);
  if (singleMins !== null) {
    return { inicio: minutesToTime(singleMins), fim: '', duracao: 0 };
  }

  return { inicio: clean, fim: '', duracao: 0 };
}

export function formatHorarioString(inicio: string, fim: string): string {
  if (!inicio && !fim) return '';
  if (inicio && !fim) return inicio;
  return `${inicio} às ${fim}`;
}

export function getGapBetween(prevEnd: string, nextStart: string): number {
  const endMins = parseTime(prevEnd);
  const startMins = parseTime(nextStart);
  if (endMins === null || startMins === null) return 0;
  return startMins - endMins;
}
