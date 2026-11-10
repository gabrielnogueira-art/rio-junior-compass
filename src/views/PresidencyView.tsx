import { useState } from 'react';
import { OKR, GovernanceChecklist, GovProgramRow } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Target, Landmark, Scale, ShieldCheck, Network } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DirectorateAccessGuard } from '@/components/DirectorateAccessGuard';
import OKRsSection from '@/components/presidency/OKRsSection';
import InstitutionalSection from '@/components/presidency/InstitutionalSection';
import GovernanceCouncilSection from '@/components/presidency/GovernanceCouncilSection';
import LegalComplianceSection from '@/components/presidency/LegalComplianceSection';
import COEJSection from '@/components/presidency/coej/COEJSection';

interface Props {
  okrs: OKR[];
  onOKRsChange: (d: OKR[]) => void;
  govChecklist: GovernanceChecklist[];
  onGovChecklistChange: (d: GovernanceChecklist[]) => void;
  govPrograms: GovProgramRow[];
  onGovProgramsChange: (d: GovProgramRow[]) => void;
}

export default function PresidencyView(props: Props) {
  const { canEditPresEx } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('okrs');

  return (
    <DirectorateAccessGuard
      canEdit={canEditPresEx}
      directorateName="Presidência Executiva (PresEx)"
      directorateShort="PresEx"
    >
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-5">
        <TabsList className="bg-secondary/60 border border-border/60 h-11 p-1 flex-wrap">
          <TabsTrigger value="okrs" className="text-xs gap-1.5 px-4">
            <Target className="h-3.5 w-3.5" /> OKRs, Farol &amp; Gestão à Vista
          </TabsTrigger>
          <TabsTrigger value="institucional" className="text-xs gap-1.5 px-4">
            <Landmark className="h-3.5 w-3.5" /> Articulação Institucional &amp; Gov.
          </TabsTrigger>
          <TabsTrigger value="conselho" className="text-xs gap-1.5 px-4">
            <Scale className="h-3.5 w-3.5" /> Governança &amp; Conselho
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs gap-1.5 px-4">
            <ShieldCheck className="h-3.5 w-3.5" /> Compliance &amp; Jurídico
          </TabsTrigger>
          <TabsTrigger value="coej" className="text-xs gap-1.5 px-4">
            <Network className="h-3.5 w-3.5" /> COEJ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="okrs" className="mt-0">
          <OKRsSection okrs={props.okrs} onOKRsChange={props.onOKRsChange} />
        </TabsContent>

        <TabsContent value="institucional" className="mt-0">
          <InstitutionalSection govPrograms={props.govPrograms} onGovProgramsChange={props.onGovProgramsChange} />
        </TabsContent>

        <TabsContent value="conselho" className="mt-0">
          <GovernanceCouncilSection />
        </TabsContent>

        <TabsContent value="compliance" className="mt-0">
          <LegalComplianceSection govChecklist={props.govChecklist} onGovChecklistChange={props.onGovChecklistChange} />
        </TabsContent>

        <TabsContent value="coej" className="mt-0">
          <COEJSection />
        </TabsContent>
      </Tabs>
    </DirectorateAccessGuard>
  );
}
