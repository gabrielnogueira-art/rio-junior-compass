// src/components/IESERecognitionTab.jsx
import React, { useState } from 'react';
import { 
  Award, 
  CheckSquare, 
  Building, 
  GraduationCap, 
  Compass, 
  HelpCircle, 
  Save, 
  Check, 
  Sparkles, 
  FileText,
  ShieldCheck
} from 'lucide-react';

export default function IESERecognitionTab({
  ej,
  ieseAvaliacao,
  onSaveIESE
}) {
  const [dimensoes, setDimensoes] = useState(ieseAvaliacao?.dimensoes || {
    cultura_empreendedora: {
      reunioes_formais_coordenacao: true,
      participacao_semana_calouros: true,
      eventos_empreendedorismo_promovidos: true,
      disciplinas_empreendedorismo_apoio: false,
      pontos: 75
    },
    infraestrutura_capital: {
      espaco_fisico_dedicado: true,
      apoio_administrativo_secretaria: true,
      computadores_internet_dedicada: true,
      acesso_editais_internos_fomento: false,
      auxilio_deslocamento_eventos_mej: false,
      pontos: 60
    },
    extensao_articulacao: {
      curricularizacao_extensao_formal: true,
      horas_extensao_validadas_orientador: true,
      parceria_institucional_governo_mercado: true,
      divulgacao_canais_oficiais_ies: true,
      pontos: 85
    }
  });

  const [parecerArticulador, setParecerArticulador] = useState(
    ieseAvaliacao?.parecer_articulador_orientador || 
    'A IES fornece espaço físico e chancela de extensão, porém necessita ampliar o acesso a editais internos de fomento a projetos de inovação.'
  );

  const [salvo, setSalvo] = useState(false);

  // Manipular toggles de checklist e recalcular pontuação da dimensão
  const handleToggle = (dimensaoKey, itemKey, peso = 25) => {
    const updatedDim = { ...dimensoes[dimensaoKey] };
    updatedDim[itemKey] = !updatedDim[itemKey];

    // Recalcular pontuação
    const totalItems = Object.keys(updatedDim).filter(k => k !== 'pontos');
    const checkedItems = totalItems.filter(k => updatedDim[k] === true).length;
    updatedDim.pontos = Math.round((checkedItems / totalItems.length) * 100);

    setDimensoes({
      ...dimensoes,
      [dimensaoKey]: updatedDim
    });
  };

  // Pontuação Global
  const mediaPontos = Math.round(
    (dimensoes.cultura_empreendedora.pontos + 
     dimensoes.infraestrutura_capital.pontos + 
     dimensoes.extensao_articulacao.pontos) / 3
  );

  let seloNome = 'Bronze - IES em Desenvolvimento';
  let seloCor = 'var(--accent-gold-400)';
  if (mediaPontos >= 90) {
    seloNome = 'Diamante - Excelência Empreendedora';
    seloCor = 'var(--accent-cyan-400)';
  } else if (mediaPontos >= 75) {
    seloNome = 'Ouro - IES Referência Regional';
    seloCor = 'var(--accent-gold-400)';
  } else if (mediaPontos >= 60) {
    seloNome = 'Prata - IES Apoiadora do Empreendedorismo';
    seloCor = '#94a3b8';
  }

  const handleSalvar = () => {
    onSaveIESE({
      id_ej: ej.id_ej,
      dimensoes,
      parecer_articulador_orientador: parecerArticulador,
      selo_previsao: seloNome,
      media_pontos: mediaPontos
    });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  return (
    <div className="iese-tab">
      {/* Banner de Apresentação do IESE */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.35) 0%, rgba(10, 19, 36, 0.9) 100%)', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Award size={26} color="var(--accent-gold-400)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                Edital de Reconhecimento de IES Empreendedora
              </h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '780px' }}>
              Mapeamento de evidências documentais baseado no <strong>IESE (Índice de Instituições de Ensino Superior Empreendedoras)</strong>.
              O professor orientador atua como <em>articulador institucional</em>, validando se a <strong>{ej.ies}</strong> oferece os pilares fundamentais para potencializar a EJ.
            </p>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
            minWidth: '220px'
          }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Índice IESE Estimado
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: seloCor, margin: '0.25rem 0' }}>
              {mediaPontos} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>/100</span>
            </div>
            <div className="badge-status" style={{ background: 'rgba(255,255,255,0.06)', color: seloCor, fontSize: '0.75rem' }}>
              {seloNome}
            </div>
          </div>
        </div>
      </div>

      {/* Grid das 3 Dimensões Oficiais do Edital */}
      <div className="dashboard-section-grid">
        {/* Dimensão 1: Cultura Empreendedora & Inovação */}
        <div className="col-span-4 glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="card-section-title" style={{ margin: 0 }}>
              <Compass size={20} color="var(--accent-cyan-400)" />
              <span>Cultura & Inovação</span>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--accent-cyan-400)', fontSize: '1.1rem' }}>
              {dimensoes.cultura_empreendedora.pontos}%
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Fomento ao protagonismo dos estudantes e incentivo à mentalidade empreendedora na IES.
          </p>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.cultura_empreendedora.reunioes_formais_coordenacao}
              onChange={() => handleToggle('cultura_empreendedora', 'reunioes_formais_coordenacao')}
              id="cult-1"
            />
            <div className="checklist-content">
              <label htmlFor="cult-1" className="checklist-title">Reuniões Formais com Coordenação</label>
              <div className="checklist-desc">Registro de atas de alinhamento estratégico com o colegiado do curso.</div>
            </div>
          </div>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.cultura_empreendedora.participacao_semana_calouros}
              onChange={() => handleToggle('cultura_empreendedora', 'participacao_semana_calouros')}
              id="cult-2"
            />
            <div className="checklist-content">
              <label htmlFor="cult-2" className="checklist-title">Semana de Acolhimento / Calouros</label>
              <div className="checklist-desc">Espaço institucional garantido para a EJ divulgar o MEJ aos ingressantes.</div>
            </div>
          </div>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.cultura_empreendedora.eventos_empreendedorismo_promovidos}
              onChange={() => handleToggle('cultura_empreendedora', 'eventos_empreendedorismo_promovidos')}
              id="cult-3"
            />
            <div className="checklist-content">
              <label htmlFor="cult-3" className="checklist-title">Hackathons & Semanas Acadêmicas</label>
              <div className="checklist-desc">Co-organização ou participação ativa em eventos de inovação na IES.</div>
            </div>
          </div>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.cultura_empreendedora.disciplinas_empreendedorismo_apoio}
              onChange={() => handleToggle('cultura_empreendedora', 'disciplinas_empreendedorismo_apoio')}
              id="cult-4"
            />
            <div className="checklist-content">
              <label htmlFor="cult-4" className="checklist-title">Disciplinas de Empreendedorismo</label>
              <div className="checklist-desc">Articulação da grade curricular com estudos de caso reais da EJ.</div>
            </div>
          </div>
        </div>

        {/* Dimensão 2: Infraestrutura & Capital Financeiro */}
        <div className="col-span-4 glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="card-section-title" style={{ margin: 0 }}>
              <Building size={20} color="var(--accent-gold-400)" />
              <span>Infraestrutura & Capital</span>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--accent-gold-400)', fontSize: '1.1rem' }}>
              {dimensoes.infraestrutura_capital.pontos}%
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Condições materiais e financeiras concedidas pela IES para a operação da empresa júnior.
          </p>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.infraestrutura_capital.espaco_fisico_dedicado}
              onChange={() => handleToggle('infraestrutura_capital', 'espaco_fisico_dedicado')}
              id="infra-1"
            />
            <div className="checklist-content">
              <label htmlFor="infra-1" className="checklist-title">Espaço Físico Dedicado</label>
              <div className="checklist-desc">Sala própria ou coworking acadêmico reservado para reuniões da EJ.</div>
            </div>
          </div>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.infraestrutura_capital.computadores_internet_dedicada}
              onChange={() => handleToggle('infraestrutura_capital', 'computadores_internet_dedicada')}
              id="infra-2"
            />
            <div className="checklist-content">
              <label htmlFor="infra-2" className="checklist-title">Conectividade & Equipamentos</label>
              <div className="checklist-desc">Acesso à internet cabeada/Wi-Fi de alta velocidade e estações de trabalho.</div>
            </div>
          </div>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.infraestrutura_capital.apoio_administrativo_secretaria}
              onChange={() => handleToggle('infraestrutura_capital', 'apoio_administrativo_secretaria')}
              id="infra-3"
            />
            <div className="checklist-content">
              <label htmlFor="infra-3" className="checklist-title">Apoio Administrativo Institucional</label>
              <div className="checklist-desc">Facilitação de trâmites de assinatura de convênios e uso de auditórios.</div>
            </div>
          </div>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.infraestrutura_capital.acesso_editais_internos_fomento}
              onChange={() => handleToggle('infraestrutura_capital', 'acesso_editais_internos_fomento')}
              id="infra-4"
            />
            <div className="checklist-content">
              <label htmlFor="infra-4" className="checklist-title">Editais Internos de Fomento / Bolsas</label>
              <div className="checklist-desc">Disponibilização de recursos orçamentários da IES ou auxílio deslocamento.</div>
            </div>
          </div>
        </div>

        {/* Dimensão 3: Extensão Universitária & Articulação */}
        <div className="col-span-4 glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="card-section-title" style={{ margin: 0 }}>
              <GraduationCap size={20} color="var(--accent-emerald-400)" />
              <span>Extensão & Articulação</span>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--accent-emerald-400)', fontSize: '1.1rem' }}>
              {dimensoes.extensao_articulacao.pontos}%
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Cumprimento da Política Nacional de Extensão e diálogo dialógico com a sociedade fluminense.
          </p>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.extensao_articulacao.curricularizacao_extensao_formal}
              onChange={() => handleToggle('extensao_articulacao', 'curricularizacao_extensao_formal')}
              id="ext-1"
            />
            <div className="checklist-content">
              <label htmlFor="ext-1" className="checklist-title">Curricularização da Extensão (10%)</label>
              <div className="checklist-desc">Horas dedicadas a projetos da EJ computadas na integralização de créditos.</div>
            </div>
          </div>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.extensao_articulacao.horas_extensao_validadas_orientador}
              onChange={() => handleToggle('extensao_articulacao', 'horas_extensao_validadas_orientador')}
              id="ext-2"
            />
            <div className="checklist-content">
              <label htmlFor="ext-2" className="checklist-title">Validação pelo Orientador COEJ</label>
              <div className="checklist-desc">Homologação formal das atividades de extensão perante a Pró-Reitoria.</div>
            </div>
          </div>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.extensao_articulacao.parceria_institucional_governo_mercado}
              onChange={() => handleToggle('extensao_articulacao', 'parceria_institucional_governo_mercado')}
              id="ext-3"
            />
            <div className="checklist-content">
              <label htmlFor="ext-3" className="checklist-title">Parcerias com Mercado & Governo</label>
              <div className="checklist-desc">Projetos com impacto social em prefeituras, ONGs e pequenas empresas.</div>
            </div>
          </div>

          <div className="checklist-item">
            <input 
              type="checkbox" 
              className="checklist-checkbox" 
              checked={dimensoes.extensao_articulacao.divulgacao_canais_oficiais_ies}
              onChange={() => handleToggle('extensao_articulacao', 'divulgacao_canais_oficiais_ies')}
              id="ext-4"
            />
            <div className="checklist-content">
              <label htmlFor="ext-4" className="checklist-title">Divulgação nos Portais da IES</label>
              <div className="checklist-desc">Matérias e divulgação dos resultados da EJ nos veículos de comunicação da IES.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Parecer do Articulador Institucional (Professor Orientador) */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="card-section-title" style={{ margin: 0 }}>
            <ShieldCheck size={20} color="var(--primary-400)" />
            <span>Papel do Professor como Articulador Institucional</span>
          </div>

          <button 
            onClick={handleSalvar}
            className="btn-primary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
          >
            {salvo ? <Check size={16} /> : <Save size={16} />}
            <span>{salvo ? 'Avaliação IESE Salva!' : 'Salvar Avaliação IESE'}</span>
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Registre as ações de articulação com a Diretoria do Centro Universitário, solicitações de espaço ou fomento em aberto:
        </p>

        <textarea 
          rows={3}
          value={parecerArticulador}
          onChange={(e) => setParecerArticulador(e.target.value)}
          placeholder="Ex: Em reunião com a Diretoria da Escola de Engenharia, solicitamos a renovação da sala e apoio para transporte ao ENEJ..."
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            color: 'var(--text-main)',
            fontSize: '0.875rem',
            resize: 'vertical',
            outline: 'none'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span>Esta avaliação pontua a IES no ranking anual divulgado no Prêmio RioJunior de Empreendedorismo Universitário.</span>
          <span>Critérios em conformidade com o Edital de Reconhecimento de IES 2025.</span>
        </div>
      </div>
    </div>
  );
}
