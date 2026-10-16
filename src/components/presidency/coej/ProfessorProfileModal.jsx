// src/components/ProfessorProfileModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Building, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  Camera, 
  Check, 
  Save, 
  AlertCircle 
} from 'lucide-react';

export default function ProfessorProfileModal({
  professor,
  linkedEJ,
  onSaveProfile,
  onClose
}) {
  const [formData, setFormData] = useState({
    nome: professor.nome,
    email: professor.email,
    foto_url: professor.foto_url,
    titulacao: professor.titulacao,
    departamento: professor.departamento,
    ies: professor.ies,
    horas_extensao_semanais: professor.horas_extensao_semanais,
    termo_etica_aceito: professor.termo_etica_aceito
  });

  const [salvo, setSalvo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile({
      ...professor,
      ...formData
    });
    setSalvo(true);
    setTimeout(() => {
      setSalvo(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header do Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <User size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Perfil do Professor Orientador</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Registro Oficial COEJ | Federação RioJunior
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário do Perfil */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Foto e EJ Vinculada */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={formData.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt={formData.nome}
                style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-500)' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>URL da Foto de Perfil:</label>
              <input 
                type="url"
                value={formData.foto_url}
                onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                placeholder="https://..."
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.4rem 0.65rem',
                  color: '#fff',
                  fontSize: '0.8rem',
                  marginTop: '0.25rem'
                }}
              />
            </div>
          </div>

          {/* Nome e E-mail Institucional */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Nome Completo:</label>
              <input 
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  marginTop: '0.35rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>E-mail Institucional (IES):</label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  marginTop: '0.35rem'
                }}
              />
            </div>
          </div>

          {/* IES e Titulação */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Instituição de Ensino Superior (IES):</label>
              <input 
                type="text"
                value={formData.ies}
                onChange={(e) => setFormData({ ...formData, ies: e.target.value })}
                required
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  marginTop: '0.35rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Titulação Acadêmica:</label>
              <input 
                type="text"
                value={formData.titulacao}
                onChange={(e) => setFormData({ ...formData, titulacao: e.target.value })}
                placeholder="Ex: Doutor em Engenharia"
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  marginTop: '0.35rem'
                }}
              />
            </div>
          </div>

          {/* Departamento e Carga Horária de Extensão */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Departamento / Centro:</label>
              <input 
                type="text"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  marginTop: '0.35rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Horas Extensão/Semana:</label>
              <input 
                type="number"
                min="1"
                max="40"
                value={formData.horas_extensao_semanais}
                onChange={(e) => setFormData({ ...formData, horas_extensao_semanais: Number(e.target.value) })}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 0.85rem',
                  color: '#fff',
                  fontSize: '0.875rem',
                  marginTop: '0.35rem'
                }}
              />
            </div>
          </div>

          {/* EJ Vinculada (Isolamento RLS) */}
          <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.15rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-400)', fontWeight: 700 }}>
              Associação Vinculada (Acesso Isolado por RLS):
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
              {linkedEJ.nome} ({linkedEJ.cluster})
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Por diretriz de segurança, seu perfil acessa estritamente os dados desta EJ e os recursos do COEJ.
            </div>
          </div>

          {/* Termo de Conflito de Interesses e Ética */}
          <div className="checklist-item" style={{ marginTop: '0.25rem' }}>
            <input 
              type="checkbox" 
              className="checklist-checkbox"
              id="termo-etica"
              checked={formData.termo_etica_aceito}
              onChange={(e) => setFormData({ ...formData, termo_etica_aceito: e.target.checked })}
              required
            />
            <div className="checklist-content">
              <label htmlFor="termo-etica" className="checklist-title">
                Autodeclaração de Ética e Não-Conflito de Interesses (Art. 4º do Manual COEJ)
              </label>
              <div className="checklist-desc">
                Declaro não possuir interesses comerciais diretos concorrentes com os serviços da empresa júnior, comprometendo-me a orientar os projetos com impessoalidade, transparência e zelo acadêmico.
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {salvo ? <Check size={16} /> : <Save size={16} />}
              <span>{salvo ? 'Perfil Atualizado!' : 'Salvar Alterações'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
