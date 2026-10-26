import { useState } from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import { TabType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import MobileMenu from '@/components/layout/MobileMenu';
import CalendarView from '@/views/CalendarView';
import DDRView from '@/views/DDRView';
import OperationsView from '@/views/OperationsView';
import StrategicPanelView from '@/views/StrategicPanelView';
import PlaceholderView from '@/views/PlaceholderView';
import PresidencyView from '@/views/PresidencyView';
import FormacaoEmpreendedoraView from '@/views/FormacaoEmpreendedoraView';
import BusinessView from '@/views/BusinessView';
import UsersAdmin from '@/components/admin/UsersAdmin';
import { useWebMCP } from 'use-webmcp-tool';
import { runWebMCPTool } from '@/lib/webmcp-telemetry';
import RioAssistant from '@/components/assistant/RioAssistant';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { profile, isAdmin, signOut } = useAuth();

  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
  const visibleTabs: TabType[] = ['calendar', 'strategic', 'presidency', 'council', 'business', 'operations', 'ddr', 'formation', ...(isAdmin ? ['users' as const] : [])];
  function changeTab(tab: TabType) {
    if (typeof tab !== 'string' || !visibleTabs.includes(tab)) throw new Error('Seção indisponível para sua conta.');
    setActiveTab(tab);
  }
  function changeYear(year: number) {
    if (typeof year !== 'number' || !Number.isInteger(year) || !yearOptions.includes(year)) throw new Error('Ano indisponível no seletor.');
    setSelectedYear(year);
  }
  useWebMCP({
    name: 'read_current_section',
    description: 'Consulta a seção e o ano atualmente selecionados no painel RioJunior.',
    annotations: { readOnlyHint: true },
    execute: () => runWebMCPTool('read_current_section', () => `Seção: ${activeTab}; ano: ${selectedYear}.`),
  });
  useWebMCP({
    name: 'open_section',
    description: 'Abre uma seção disponível no menu da RioJunior sem alterar registros.',
    inputSchema: { type: 'object', properties: { section: { type: 'string', enum: visibleTabs, description: 'Identificador da seção do menu.' } }, required: ['section'] },
    execute: ({ section }: { section: TabType }) => runWebMCPTool('open_section', () => { changeTab(section); return `Seção selecionada: ${section}.`; }),
  });
  useWebMCP({
    name: 'select_year',
    description: 'Seleciona um ano disponível no seletor de vigência do painel.',
    inputSchema: { type: 'object', properties: { year: { type: 'integer', enum: yearOptions, description: 'Ano de vigência disponível.' } }, required: ['year'] },
    execute: ({ year }: { year: number }) => runWebMCPTool('select_year', () => { changeYear(year); return `Ano selecionado: ${year}.`; }),
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView selectedYear={selectedYear} />;
      case 'ddr':
        return <DDRView selectedYear={selectedYear} />;
      case 'operations':
        return <OperationsView selectedYear={selectedYear} />;
      case 'strategic':
        return <StrategicPanelView selectedYear={selectedYear} />;
      case 'presidency':
        return <PresidencyView selectedYear={selectedYear} />;
      case 'users':
        return isAdmin ? <UsersAdmin /> : <CalendarView selectedYear={selectedYear} />;
      case 'council':
        return (
          <PlaceholderView 
            title="Presidência do Conselho" 
            description="Esta seção será desenvolvida em breve. Aqui você encontrará informações e atividades relacionadas ao Conselho da Federação." 
          />
        );
      case 'business':
        return <BusinessView selectedYear={selectedYear} />;
      case 'formation':
        return <FormacaoEmpreendedoraView selectedYear={selectedYear} />;
      default:
        return <CalendarView selectedYear={selectedYear} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={changeTab}
        isAdmin={isAdmin}
        userName={profile?.nome ?? undefined}
        userEmail={profile?.email ?? undefined}
        onLogout={signOut}
      />

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={changeTab}
        isAdmin={isAdmin}
        onLogout={signOut}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0 lg:ml-72 flex flex-col min-h-screen">
        {/* Header with Year Selector */}
        <header className="h-16 bg-card border-b border-border sticky top-0 z-10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 text-foreground hover:bg-secondary rounded-lg transition-colors lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xs">
                RJ
              </div>
              <span className="font-bold text-lg text-foreground">RioJunior</span>
            </div>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Ano de vigência:</span>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => changeYear(Number(e.target.value))}
                className="appearance-none bg-primary text-primary-foreground px-4 py-2 pr-8 rounded-lg font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity border-0 focus:ring-2 focus:ring-primary/50 focus:outline-none"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-foreground pointer-events-none" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main data-assistant-page className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {renderContent()}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2025 RioJunior - Federação de Empresas Juniores do Estado do Rio de Janeiro</p>
        </footer>
      </div>
      <RioAssistant section={activeTab} year={selectedYear} />
    </div>
  );
};

export default Index;
