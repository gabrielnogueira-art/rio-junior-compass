import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { geminiSettingsService, GEMINI_AVAILABLE_MODELS } from '@/services/geminiSettingsService';

interface GeminiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GeminiConfigModal({ isOpen, onClose }: GeminiConfigModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.0-flash');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const config = geminiSettingsService.getConfig();
      setApiKey(config.apiKey);
      setModel(config.model || 'gemini-2.0-flash');
      setIsEnabled(config.isCustomKeyEnabled);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Digite ou cole sua chave de API do Gemini para testar.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await geminiSettingsService.testConnection(apiKey, model);
      setTestResult(result);
      if (result.success) {
        setIsEnabled(true);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    geminiSettingsService.setConfig({
      apiKey: apiKey.trim(),
      model,
      isCustomKeyEnabled: isEnabled && !!apiKey.trim(),
    });
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setIsEnabled(false);
    setTestResult(null);
    geminiSettingsService.setConfig({
      apiKey: '',
      isCustomKeyEnabled: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-labelledby="gemini-config-title"
        className="w-full max-w-lg bg-card text-card-foreground border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 id="gemini-config-title" className="text-base font-bold flex items-center gap-2">
                Conexão com Google Gemini
                {isEnabled && apiKey ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Pro Conectado
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    Modo Padrão Lovable
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                Conecte sua API Key do Gemini Pro para usufruir de 2M de tokens e sem limites
              </p>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Fechar configurações">
            <X size={18} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Info Card */}
          <div className="p-3.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-xs space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-blue-400">
              <Zap size={14} />
              <span>Por que usar sua chave do Gemini Pro?</span>
            </div>
            <p className="text-muted-foreground">
              O plano Pro do Google AI Studio oferece até <strong>2.000.000 de tokens</strong> por requisição. Isso permite enviar 
              extratos bancários longos em <strong>PDF, XLSX, CSV e TXT</strong> sem cortes, bloqueios ou consumo de créditos de gateways intermediários.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-muted/20">
            <div className="space-y-0.5">
              <label htmlFor="custom-key-toggle" className="font-semibold text-xs cursor-pointer flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary" />
                Usar minha chave pessoal do Gemini Pro
              </label>
              <p className="text-[11px] text-muted-foreground">
                Quando desativado, o sistema usa o gateway de IA padrão.
              </p>
            </div>
            <input 
              id="custom-key-toggle"
              type="checkbox" 
              checked={isEnabled} 
              onChange={e => setIsEnabled(e.target.checked)}
              className="w-4 h-4 accent-primary rounded cursor-pointer"
            />
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold flex items-center gap-1.5">
                <Key size={13} className="text-muted-foreground" />
                API Key do Google AI Studio (Gemini)
              </label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-primary hover:underline flex items-center gap-1"
              >
                Obter chave no Google AI Studio <ExternalLink size={11} />
              </a>
            </div>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="pr-10 font-mono text-xs"
              />
              <button 
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showKey ? 'Ocultar chave' : 'Mostrar chave'}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Sua chave fica gravada no navegador local e nunca é compartilhada publicamente.
            </p>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold flex items-center gap-1.5">
              <Cpu size={13} className="text-muted-foreground" />
              Modelo do Gemini
            </label>
            <select
              value={model}
              onChange={e => {
                setModel(e.target.value);
                setTestResult(null);
              }}
              className="w-full border border-input rounded-md bg-background text-foreground text-xs p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {GEMINI_AVAILABLE_MODELS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.contextWindow})
                </option>
              ))}
            </select>
          </div>

          {/* Test Status Feedback */}
          {testResult && (
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 animate-in fade-in ${
              testResult.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-destructive/10 border-destructive/30 text-destructive'
            }`}>
              {testResult.success ? <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
              <div className="space-y-0.5">
                <p className="font-semibold">{testResult.success ? 'Conexão Bem-Sucedida!' : 'Falha na Conexão'}</p>
                <p className="opacity-90">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Action Buttons for Testing */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={isTesting || !apiKey.trim()}
              className="gap-1.5 text-xs font-semibold"
            >
              {isTesting ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Testando conexão...
                </>
              ) : (
                <>
                  <Sparkles size={13} className="text-primary" />
                  Testar Chave & Conexão
                </>
              )}
            </Button>

            {apiKey && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-xs text-muted-foreground hover:text-destructive ml-auto"
              >
                Limpar Chave
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-border bg-muted/20">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1.5 font-semibold">
            Salvar e Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
}
