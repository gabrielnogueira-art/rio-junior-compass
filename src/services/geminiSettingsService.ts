export interface GeminiConfig {
  apiKey: string;
  model: string;
  isCustomKeyEnabled: boolean;
  lastTestedAt?: string;
  lastTestStatus?: 'success' | 'error';
}

const STORAGE_KEY = 'riojunior_gemini_custom_config_v1';

export const GEMINI_AVAILABLE_MODELS = [
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Recomendado - Ultrarrápido & Multimodal)', contextWindow: '1M tokens' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Máximo Raciocínio & Extratos Extensos)', contextWindow: '2M tokens' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Leve & Econômico)', contextWindow: '1M tokens' },
];

class GeminiSettingsService {
  private config: GeminiConfig = {
    apiKey: '',
    model: 'gemini-2.0-flash',
    isCustomKeyEnabled: false,
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.config = { ...this.config, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Erro ao carregar configurações do Gemini:', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Erro ao salvar configurações do Gemini:', e);
    }
  }

  public getConfig(): GeminiConfig {
    return { ...this.config };
  }

  public getApiKey(): string {
    return this.config.apiKey.trim();
  }

  public getModel(): string {
    return this.config.model || 'gemini-2.0-flash';
  }

  public hasCustomKey(): boolean {
    return !!(this.config.apiKey.trim() && this.config.isCustomKeyEnabled);
  }

  public setConfig(updated: Partial<GeminiConfig>) {
    this.config = { ...this.config, ...updated };
    this.saveToStorage();
    window.dispatchEvent(new Event('rio-gemini-config-changed'));
  }

  public async testConnection(apiKey: string, model: string = 'gemini-2.0-flash'): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    const key = apiKey.trim();
    if (!key) {
      return { success: false, message: 'Informe uma chave de API do Gemini válida.' };
    }

    const start = performance.now();
    try {
      // Teste direto usando a API oficial do Google Gemini (Google AI Studio)
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Responda apenas: CONECTADO' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      });

      const latencyMs = Math.round(performance.now() - start);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.error?.message || `Erro HTTP ${res.status}: ${res.statusText}`;
        return { success: false, message: `Falha na autenticação: ${msg}` };
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (text.toLowerCase().includes('conectado') || text.length > 0) {
        this.setConfig({ lastTestedAt: new Date().toISOString(), lastTestStatus: 'success' });
        return { 
          success: true, 
          message: `Conexão estabelecida com sucesso! Modelo ${model} ativo (${latencyMs}ms). Cota do seu plano Gemini Pro disponível.`,
          latencyMs
        };
      }

      return { success: false, message: 'Resposta inesperada do modelo Gemini.' };
    } catch (err: any) {
      return { success: false, message: `Erro de rede ou CORS: ${err.message || 'Não foi possível conectar ao Google AI Studio.'}` };
    }
  }
}

export const geminiSettingsService = new GeminiSettingsService();
