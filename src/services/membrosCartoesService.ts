// src/services/membrosCartoesService.ts
// Servico oficial de gerenciamento de membros da RioJunior e sistema disciplinar de cartoes

import { GuildaKey } from '@/data/rolesGuildasData';

export type CardTipo = 'amarelo' | 'vermelho';
export type CardGravidade = 'moderada' | 'grave';

export interface MembroRioJunior {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  identidade: string;
  orgaoExpedidor: string;
  endereco: string;
  nacionalidade: string;
  estadoCivil: string;
  profissao: string;
  dataEntrada: string;
  guilda: GuildaKey;
  cargo: string;
  status: 'ativo' | 'atencao' | 'critico' | 'desligado';
  /** Vínculo na frente: responsável/coordenador ou integrante do time (ex.: Time EFEJ) */
  vinculoFrente?: 'responsavel' | 'time';
  /** Desligamento por motivo específico, sem relação com aplicação de cartões */
  desligamentoManual?: { motivo: string; data: string };
}

export interface CartaoAdvertencia {
  id: string;
  membroId: string;
  membroNome: string;
  membroEmail: string;
  tipo: CardTipo;
  gravidade: CardGravidade;
  motivo: string;
  categoria: string;
  data: string;
  aplicadoPor: string;
  observacoes?: string;
}

export interface MembroCardStats {
  amarelosCount: number;
  vermelhosDiretosCount: number;
  vermelhosConvertidos: number;
  totalVermelhos: number;
  isDesligamento: boolean;
}

const STORAGE_KEY_MEMBROS = 'riojunior_membros_v3';
const STORAGE_KEY_CARTOES = 'riojunior_cartoes_v3';

export const INITIAL_MEMBROS: MembroRioJunior[] = [
  {
    "id": "mem_001",
    "nome": "Adrielle Macedo Coutinho",
    "email": "dricoutinho@riojunior.com.br",
    "cpf": "6425646713",
    "identidade": "362144750",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Barão da Lagoa Dourada, n° 119 - Centro, Campos dos Goytacazes - RJ, 28035-211",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Estratégia de Comunicação",
    "status": "atencao"
  },
  {
    "id": "mem_002",
    "nome": "Ana Clara Machado Lacerda",
    "email": "anamachado@riojunior.com.br",
    "cpf": "15888608769",
    "identidade": "273834820",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Sarapuí, n° 64 - Rocha Sobrinho, Mesquita - RJ, 26585-640",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "DDR",
    "cargo": "Diretor(a) de Desenvolvimento da Rede",
    "status": "ativo"
  },
  {
    "id": "mem_003",
    "nome": "Breno Chrisostomo Paulo de Mattos Pinna",
    "email": "brenopinna@riojunior.com.br",
    "cpf": "15179151716",
    "identidade": "296972466",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Osvaldo Campos, n° 373, Casa 109 - Rio do Limão, Araruama - RJ, 28981-295",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "OP",
    "cargo": "Financeiro",
    "status": "atencao"
  },
  {
    "id": "mem_004",
    "nome": "Bruno de Souza Abeid",
    "email": "brunoabeid@riojunior.com.br",
    "cpf": "15983660764",
    "identidade": "258750009",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Evanir Pereira da Costa, n° 181 - Bangu, Rio de Janeiro, RJ, 21815-280",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "DDR",
    "cargo": "Regulamentação da Rede",
    "status": "ativo"
  },
  {
    "id": "mem_005",
    "nome": "Clara Santos Louback",
    "email": "claralouback@riojunior.com.br",
    "cpf": "129.985.667-58",
    "identidade": "259.147.38-7",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Avenida Ewerton Xavier, 808 - Cond. Ubá 2 (R1/ Qd6/ Lt6).\nItaipu - Niterói / RJ.\nCEP: 24340-105",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Coordenadoria de Comunicação do EFEJ",
    "status": "atencao"
  },
  {
    "id": "mem_006",
    "nome": "Deborah Pacheco Marques",
    "email": "deb@riojunior.com.br",
    "cpf": "16586773741",
    "identidade": "323505209",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua José Tunula, n° 20 - Boa Esperança, Seropédica - RJ, 23894-418",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "PRESCON",
    "cargo": "Presidente do Conselho",
    "status": "desligado"
  },
  {
    "id": "mem_007",
    "nome": "Eduarda Thomé de Souza Martins da Silva",
    "email": "comunicacaoefej@riojunior.com.br",
    "cpf": "16092226790",
    "identidade": "26.252.998-5",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Jornalista Henrique Cordeiro 120, Apartamento 1003 Bl1 - Barra da Tijuca, Rio de Janeiro (22631-450)",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Coordenadoria de Comunicação do EFEJ",
    "status": "ativo"
  },
  {
    "id": "mem_008",
    "nome": "Emanuelle Mesquita Alves da Fonseca",
    "email": "manumafonseca@riojunior.com.br",
    "cpf": "19896061726",
    "identidade": "259034007",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Vicente de Lima Cleto, n° 1076 - Pião, São Gonçalo - RJ, 24455-001",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "OP",
    "cargo": "Jornada de Time",
    "status": "critico"
  },
  {
    "id": "mem_009",
    "nome": "Gabriel de Sousa Silva Araújo",
    "email": "gabrielsousa@riojunior.com.br",
    "cpf": "12094955702",
    "identidade": "275969707",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Monsenhor Jerônimo, n° 73, Casa 101 - Engenho de Dentro, Rio de Janeiro - RJ, 20730-110",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "PRESEX",
    "cargo": "Mercado",
    "status": "atencao"
  },
  {
    "id": "mem_010",
    "nome": "Géssyca Cristina de Souza da Silva",
    "email": "gessycasouza@riojunior.com.br",
    "cpf": "16255301702",
    "identidade": "294328315",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Estrada. do Viegas, n° 322 - Bloco 28, Apartamento 308 - Senador Camará, Rio de Janeiro - RJ, 21832-006",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "PRESEX",
    "cargo": "Relacionamento com Insituição de Ensino Superior",
    "status": "ativo"
  },
  {
    "id": "mem_011",
    "nome": "Gabriel Pinto Nogueira",
    "email": "gabriel.nogueira@riojunior.com.br",
    "cpf": "19534178764",
    "identidade": "327157368",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Cabo Amaro Burla, n° 30 - Parque Alvorada, Campos dos Goytacazes - RJ, 28083-030",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "PRESEX",
    "cargo": "Presidente Executivo",
    "status": "critico"
  },
  {
    "id": "mem_012",
    "nome": "Gabriel Rodrigues da Silva",
    "email": "gabrielrodrigues@riojunior.com.br",
    "cpf": "169.676.837-30",
    "identidade": "27.133.954-1",
    "orgaoExpedidor": "DETRAN",
    "endereco": "Av. Ten. Armindo Leal Gonçalves - Parque Sao Vicente, Belford Roxo - RJ, 26178-400, Brazil",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "DDR",
    "cargo": "Regulamentação da Rede",
    "status": "atencao"
  },
  {
    "id": "mem_013",
    "nome": "Gabrielle Ferreira de Oliveira",
    "email": "gabrielle.oliveira@riojunior.com.br",
    "cpf": "19882099785",
    "identidade": "260902036",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Alfredo Correia, n° 150, Apt 103, Jardim Carioca, Rio de Janeiro, RJ, 21920-225",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "DDR",
    "cargo": "Expansão",
    "status": "ativo"
  },
  {
    "id": "mem_014",
    "nome": "Luiz Antonio Ribeiro dos Santos",
    "email": "luiz.ribeiro@riojunior.com.br",
    "cpf": "48499009840",
    "identidade": "644258792",
    "orgaoExpedidor": "SSP-SP",
    "endereco": "Rua Comendador Bastos, n° 349, Apartamento 105 - Freguesia, Rio de Janeiro - RJ, 21911-020",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "VPNEG",
    "cargo": "Modelo de Negócios",
    "status": "ativo"
  },
  {
    "id": "mem_015",
    "nome": "João Pedro Do Nascimento Buzatto",
    "email": "joaobuzatto@riojunior.com.br",
    "cpf": "13073447717",
    "identidade": "266328335",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Silva Pinto, n° 149, Apartamento 501 - Vila Isabel, Rio de Janeiro - RJ, 20551-190",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "OP",
    "cargo": "Gestão de Processos",
    "status": "ativo"
  },
  {
    "id": "mem_016",
    "nome": "Júlia da Silva Coupey",
    "email": "geralefej@riojunior.com.br",
    "cpf": "18717621704",
    "identidade": "319901484",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Alvaro Moutinho, n° 171 - Mangueira, São Gonçalo - RJ, 24435-200",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Coordenadoria Geral do EFEJ",
    "status": "atencao"
  },
  {
    "id": "mem_017",
    "nome": "Karoline dos Santos Silva",
    "email": "conteudoefej@riojunior.com.br",
    "cpf": "157.010.977-06",
    "identidade": "28.657.724-2",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Projetada Sete, 16, Parque Santa Rita, Magé, Rio de Janeiro, 25906-002",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Coordenadoria de Conteúdo do EFEJ",
    "status": "critico"
  },
  {
    "id": "mem_018",
    "nome": "Letícia Urbano Pessanha",
    "email": "leticiaurbano@riojunior.com.br",
    "cpf": "21038718716",
    "identidade": "25 8351980",
    "orgaoExpedidor": "DETRAN",
    "endereco": "Rua das Acácias, Âncora, Rio das Ostras, Rio de Janeiro,  28899-422",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Educação da rede",
    "status": "atencao"
  },
  {
    "id": "mem_019",
    "nome": "Lucas Rodrigues Jordão",
    "email": "lucasrodrigues@riojunior.com.br",
    "cpf": "18338157775",
    "identidade": "313989733",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Francisco Lôbo da Costa, n° 108 - Parque Novo Mundo, Campos dos Goytacazes - RJ, 28083-430",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "DDR",
    "cargo": "Suporte aos Guardiões",
    "status": "ativo"
  },
  {
    "id": "mem_020",
    "nome": "Lygia Bragança dos Santos",
    "email": "lygiabraganca@riojunior.com.br",
    "cpf": "187.738.717-70",
    "identidade": "29.070.942-7",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua General Galiene, 195, Casa 2 \nBonsucesso \nRio de Janeiro \nRJ\n21050-780",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Coordenadoria Geral do EFEJ",
    "status": "ativo"
  },
  {
    "id": "mem_021",
    "nome": "Maria Eduarda Marins Romão",
    "email": "mariaeduardamarins@riojunior.com.br",
    "cpf": "20686707710",
    "identidade": "20686707710",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Grão de Areia, n° 131 - Jardim Guanabara, Rio de Janeiro - RJ, 21941-080",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "VPNEG",
    "cargo": "Executivo de Vendas",
    "status": "ativo"
  },
  {
    "id": "mem_022",
    "nome": "Maria Fernanda Barbosa Portella Costa Nonato Da Silva",
    "email": "mariafernanda@riojunior.com.br",
    "cpf": "18468573760",
    "identidade": "258567304",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Avenida Francisco Crisóstomos Tôrres, n° 50 - São Luís, Volta Redonda - RJ, 27286-440",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Experiência e Infraestrutura de Eventos",
    "status": "ativo"
  },
  {
    "id": "mem_023",
    "nome": "Mariana de Moura Ansel",
    "email": "marianansel@riojunior.com.br",
    "cpf": "19798704703",
    "identidade": "275011740",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Thetis Drumond, n° 26, Apartamento 104 - Vista Alegre, Rio de Janeiro - RJ, 21235-530",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "DDR",
    "cargo": "Suporte as EJs",
    "status": "ativo"
  },
  {
    "id": "mem_036",
    "nome": "Miguel Ribeiro de Mello",
    "email": "miguel.ribeiro@riojunior.com.br",
    "cpf": "19787393701",
    "identidade": "326206893",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Projetada, n° 41, Casa 1 - Vila Emil, Mesquita - RJ, 26580-330",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "OP",
    "cargo": "Diretor(a) de Operações",
    "status": "ativo"
  },
  {
    "id": "mem_037",
    "nome": "Paulo Ricardo Soares Vaz",
    "email": "paulovaz@riojunior.com.br",
    "cpf": "198.792.467-30",
    "identidade": "32.644.512-9",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Juazeiro, 9 - casa, trindade, São Gonçalo, Rio de Janeiro, 24456-210",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "VPNEG",
    "cargo": "Modelo de Negócios",
    "status": "ativo"
  },
  {
    "id": "mem_038",
    "nome": "Rafael Julião Oliveira da Silva dos Santos",
    "email": "rafaeljuliao@riojunior.com.br",
    "cpf": "18302187780",
    "identidade": "18302187780",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua Ambrósio, n° 50 - Vila Emil, Mesquita - RJ, 26580-250",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "DDR",
    "cargo": "Expansão",
    "status": "desligado"
  },
  {
    "id": "mem_039",
    "nome": "Rian Mendes Guimarães",
    "email": "rianm@riojunior.com.br",
    "cpf": "14316428780",
    "identidade": "4079206",
    "orgaoExpedidor": "SSP-ES",
    "endereco": "Avenida Dr. Arthur Bernardes, n° 1520 - Horto, Campos dos Goytacazes - RJ, 28015-325",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Diretor(a) de Formação Empreendedora",
    "status": "atencao"
  },
  {
    "id": "mem_040",
    "nome": "Sara Machado da Silva",
    "email": "saramachado@riojunior.com.br",
    "cpf": "151.014.917-13",
    "identidade": "26.460.259-0",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua José do Patrocínio, 89 - Apto 404, Centro, Campos dos Goytacazes, RJ, 28010-385",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Coordenadoria de Operações do EFEJ",
    "status": "ativo"
  },
  {
    "id": "mem_041",
    "nome": "Sofia Batista Silva Orrico",
    "email": "operacoesefej@riojunior.com.br",
    "cpf": "54608814800",
    "identidade": "594238535",
    "orgaoExpedidor": "SSP-SP",
    "endereco": "Rua José Tunula, n° 64, Casa 5 - Boa Esperança, Seropédica - RJ, 23894-418",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "FE",
    "cargo": "Coordenadoria de Operações do EFEJ",
    "status": "atencao"
  },
  {
    "id": "mem_042",
    "nome": "Victor Pereira Lopes",
    "email": "victorlopes@riojunior.com.br",
    "cpf": "18399631744",
    "identidade": "315007286",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Estrada de Jacarepaguá, n° 95 - Itanhangá, Rio de Janeiro - RJ, 22753-030",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "PRESEX",
    "cargo": "Relações Institucionais e Governamentais",
    "status": "atencao"
  },
  {
    "id": "mem_043",
    "nome": "Vinicius Souza da Silva",
    "email": "vinicius.souza@riojunior.com.br",
    "cpf": "17150193773",
    "identidade": "295714331",
    "orgaoExpedidor": "DETRAN-RJ",
    "endereco": "Rua A, n° 586 - Fragoso, Magé - RJ, 25935-290",
    "nacionalidade": "brasileira",
    "estadoCivil": "solteiro",
    "profissao": "estudante",
    "dataEntrada": "2026-01-15",
    "guilda": "OP",
    "cargo": "Employer Branding",
    "status": "atencao"
  }
];

export const INITIAL_CARTOES: CartaoAdvertencia[] = [
  {
    "id": "card_001",
    "membroId": "mem_001",
    "membroNome": "Adrielle Macedo Coutinho",
    "membroEmail": "dricoutinho@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Ausência sem justificativa prévia na Reunião Geral de Alinhamento da Federação (RV 08).",
    "categoria": "Falta em Reunião Geral (RV)",
    "data": "2026-02-10",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_002",
    "membroId": "mem_003",
    "membroNome": "Breno Chrisostomo Paulo de Mattos Pinna",
    "membroEmail": "brenopinna@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Não entrega do diagnóstico operacional no prazo estipulado sem comunicação ao time.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-18",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_003",
    "membroId": "mem_005",
    "membroNome": "Clara Santos Louback",
    "membroEmail": "claralouback@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso na validação dos comunicados de comunicação do EFEJ.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-03-05",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_004",
    "membroId": "mem_006",
    "membroNome": "Deborah Pacheco Marques",
    "membroEmail": "deb@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Ausência não comunicada em Reunião de Governança do Conselho.",
    "categoria": "Falta em Reunião Geral (RV)",
    "data": "2026-01-20",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_005",
    "membroId": "mem_006",
    "membroNome": "Deborah Pacheco Marques",
    "membroEmail": "deb@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Descumprimento de prazo estatutário na emissão de parecer do Conselho.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-05",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_006",
    "membroId": "mem_006",
    "membroNome": "Deborah Pacheco Marques",
    "membroEmail": "deb@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso na validação de atas e relatórios de conformidade regulamentar.",
    "categoria": "Violação Estatutária",
    "data": "2026-02-25",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_007",
    "membroId": "mem_006",
    "membroNome": "Deborah Pacheco Marques",
    "membroEmail": "deb@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Não comparecimento à sessão extraordinária de alinhamento com a diretoria.",
    "categoria": "Ausência em Evento Obrigatório",
    "data": "2026-03-12",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_008",
    "membroId": "mem_008",
    "membroNome": "Emanuelle Mesquita Alves da Fonseca",
    "membroEmail": "manumafonseca@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso no fechamento do relatório quinzenal da Jornada de Time.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-02",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_009",
    "membroId": "mem_008",
    "membroNome": "Emanuelle Mesquita Alves da Fonseca",
    "membroEmail": "manumafonseca@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Falta em alinhamento de liderança de Gente e Gestão.",
    "categoria": "Falta em Reunião Geral (RV)",
    "data": "2026-02-20",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_010",
    "membroId": "mem_008",
    "membroNome": "Emanuelle Mesquita Alves da Fonseca",
    "membroEmail": "manumafonseca@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Ausência em treinamento obrigatório de feedback e clima organizacional.",
    "categoria": "Ausência em Evento Obrigatório",
    "data": "2026-03-15",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_011",
    "membroId": "mem_009",
    "membroNome": "Gabriel de Sousa Silva Araújo",
    "membroEmail": "gabrielsousa@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Não envio de propostas comerciais de mercado no prazo acordado.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-28",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_012",
    "membroId": "mem_011",
    "membroNome": "Gabriel Pinto Nogueira",
    "membroEmail": "gabriel.nogueira@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso na validação dos relatórios executivos institucionais.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-14",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_013",
    "membroId": "mem_011",
    "membroNome": "Gabriel Pinto Nogueira",
    "membroEmail": "gabriel.nogueira@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Ausência em compromisso institucional com agentes de mercado.",
    "categoria": "Ausência em Evento Obrigatório",
    "data": "2026-03-10",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_014",
    "membroId": "mem_012",
    "membroNome": "Gabriel Rodrigues da Silva",
    "membroEmail": "gabrielrodrigues@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso na análise de conformidade de documentação de Selo EJ.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-22",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_015",
    "membroId": "mem_016",
    "membroNome": "Júlia da Silva Coupey",
    "membroEmail": "geralefej@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso na consolidação da grade geral de coordenadores do EFEJ.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-03-01",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_016",
    "membroId": "mem_017",
    "membroNome": "Karoline dos Santos Silva",
    "membroEmail": "conteudoefej@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Descumprimento do prazo de curadoria de conteúdos do EFEJ.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-08",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_017",
    "membroId": "mem_017",
    "membroNome": "Karoline dos Santos Silva",
    "membroEmail": "conteudoefej@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Falta sem justificativa prévia na reunião tática de conteúdo.",
    "categoria": "Falta em Reunião Geral (RV)",
    "data": "2026-02-26",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_018",
    "membroId": "mem_017",
    "membroNome": "Karoline dos Santos Silva",
    "membroEmail": "conteudoefej@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso na validação dos roteiros e palestrantes do evento.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-03-18",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_019",
    "membroId": "mem_018",
    "membroNome": "Letícia Urbano Pessanha",
    "membroEmail": "leticiaurbano@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso na elaboração do diagnóstico de capacitações da rede.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-12",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_020",
    "membroId": "mem_038",
    "membroNome": "Rafael Julião Oliveira da Silva dos Santos",
    "membroEmail": "rafaeljuliao@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Ausência não justificada em imersão presencial de Expansão.",
    "categoria": "Ausência em Evento Obrigatório",
    "data": "2026-01-25",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_021",
    "membroId": "mem_038",
    "membroNome": "Rafael Julião Oliveira da Silva dos Santos",
    "membroEmail": "rafaeljuliao@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Não entrega do plano de prospecção de novas EJs no prazo acordado.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-15",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_022",
    "membroId": "mem_038",
    "membroNome": "Rafael Julião Oliveira da Silva dos Santos",
    "membroEmail": "rafaeljuliao@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Falta em reunião obrigatória de acompanhamento da DDR.",
    "categoria": "Falta em Reunião Geral (RV)",
    "data": "2026-03-02",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_023",
    "membroId": "mem_038",
    "membroNome": "Rafael Julião Oliveira da Silva dos Santos",
    "membroEmail": "rafaeljuliao@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Descumprimento de diretriz da coordenação de Expansão.",
    "categoria": "Violação Estatutária",
    "data": "2026-03-20",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_024",
    "membroId": "mem_039",
    "membroNome": "Rian Mendes Guimarães",
    "membroEmail": "rianm@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso no envio do cronograma de eventos da guilda de FE.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-03-08",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_025",
    "membroId": "mem_041",
    "membroNome": "Sofia Batista Silva Orrico",
    "membroEmail": "operacoesefej@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso no envio do checklist de infraestrutura do evento.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-16",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_026",
    "membroId": "mem_042",
    "membroNome": "Victor Pereira Lopes",
    "membroEmail": "victorlopes@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Ausência em reunião estratégica de articulação com o poder público.",
    "categoria": "Ausência em Evento Obrigatório",
    "data": "2026-03-14",
    "aplicadoPor": "Guilda de Operações (OP)"
  },
  {
    "id": "card_027",
    "membroId": "mem_043",
    "membroNome": "Vinicius Souza da Silva",
    "membroEmail": "vinicius.souza@riojunior.com.br",
    "tipo": "amarelo",
    "gravidade": "moderada",
    "motivo": "Atraso na publicação dos materiais de comunicação de Marca Empregadora.",
    "categoria": "Descumprimento de SLA / Entrega",
    "data": "2026-02-24",
    "aplicadoPor": "Guilda de Operações (OP)"
  }
];

class MembrosCartoesService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEY_MEMBROS)) {
      localStorage.setItem(STORAGE_KEY_MEMBROS, JSON.stringify(INITIAL_MEMBROS));
    }
    if (!localStorage.getItem(STORAGE_KEY_CARTOES)) {
      localStorage.setItem(STORAGE_KEY_CARTOES, JSON.stringify(INITIAL_CARTOES));
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Erro no listener de membros/cartoes:', e);
      }
    });
  }

  public getMembros(): MembroRioJunior[] {
    if (typeof window === 'undefined') return INITIAL_MEMBROS;
    const data = localStorage.getItem(STORAGE_KEY_MEMBROS);
    if (!data) return INITIAL_MEMBROS;
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_MEMBROS;
    }
  }

  public getMembroById(id: string): MembroRioJunior | undefined {
    return this.getMembros().find(m => m.id === id);
  }

  public saveMembro(membro: MembroRioJunior): void {
    // Desligamento manual prevalece sobre o status calculado pelos cartões
    if (membro.desligamentoManual && membro.status !== 'desligado') {
      membro = { ...membro, status: 'desligado' };
    }
    const list = this.getMembros();
    const idx = list.findIndex(m => m.id === membro.id);
    if (idx >= 0) {
      list[idx] = membro;
    } else {
      list.push(membro);
    }
    localStorage.setItem(STORAGE_KEY_MEMBROS, JSON.stringify(list));
    this.notify();
  }

  // Desliga o membro por motivo específico (sem depender de cartões)
  public desligarMembro(id: string, motivo: string, data: string): void {
    const m = this.getMembroById(id);
    if (!m) return;
    this.saveMembro({
      ...m,
      status: 'desligado',
      desligamentoManual: { motivo: motivo.trim(), data }
    });
  }

  // Reintegra o membro e recalcula o status com base nos cartões
  public reintegrarMembro(id: string): void {
    const m = this.getMembroById(id);
    if (!m) return;
    const stats = this.calculateCardStats(this.getCartoesByMembro(id));
    let status: MembroRioJunior['status'] = 'ativo';
    if (stats.isDesligamento) status = 'desligado';
    else if (stats.totalVermelhos === 1) status = 'critico';
    else if (stats.amarelosCount > 0) status = 'atencao';
    const { desligamentoManual, ...rest } = m;
    this.saveMembro({ ...rest, status });
  }

  public deleteMembro(id: string): void {
    const list = this.getMembros().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY_MEMBROS, JSON.stringify(list));
    
    // Remove tambem cartoes desse membro
    const cartoes = this.getCartoes().filter(c => c.membroId !== id);
    localStorage.setItem(STORAGE_KEY_CARTOES, JSON.stringify(cartoes));
    
    this.notify();
  }

  public getCartoes(): CartaoAdvertencia[] {
    if (typeof window === 'undefined') return INITIAL_CARTOES;
    const data = localStorage.getItem(STORAGE_KEY_CARTOES);
    if (!data) return INITIAL_CARTOES;
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CARTOES;
    }
  }

  public getCartoesByMembro(membroId: string): CartaoAdvertencia[] {
    return this.getCartoes().filter(c => c.membroId === membroId);
  }

  public getCartaoById(id: string): CartaoAdvertencia | undefined {
    return this.getCartoes().find(c => c.id === id);
  }

  public aplicarCartao(params: {
    membroId: string;
    tipo: CardTipo;
    categoria: string;
    motivo: string;
    data: string;
    observacoes?: string;
    aplicadoPor?: string;
  }): CartaoAdvertencia {
    const membro = this.getMembroById(params.membroId);
    if (!membro) {
      throw new Error('Membro não encontrado para aplicação de cartão.');
    }

    const newCard: CartaoAdvertencia = {
      id: 'card_' + Date.now().toString(36),
      membroId: membro.id,
      membroNome: membro.nome,
      membroEmail: membro.email,
      tipo: params.tipo,
      gravidade: params.tipo === 'vermelho' ? 'grave' : 'moderada',
      motivo: params.motivo,
      categoria: params.categoria,
      data: params.data || new Date().toISOString().split('T')[0],
      aplicadoPor: params.aplicadoPor || 'Guilda de Operações (OP)',
      observacoes: params.observacoes
    };

    const cartoes = this.getCartoes();
    cartoes.unshift(newCard);
    localStorage.setItem(STORAGE_KEY_CARTOES, JSON.stringify(cartoes));

    // Recalcula status disciplinar do membro
    const membroCards = this.getCartoesByMembro(membro.id);
    const stats = this.calculateCardStats(membroCards);

    let newStatus: MembroRioJunior['status'] = 'ativo';
    if (stats.isDesligamento) {
      newStatus = 'desligado';
    } else if (stats.totalVermelhos === 1) {
      newStatus = 'critico';
    } else if (stats.amarelosCount > 0) {
      newStatus = 'atencao';
    }

    this.saveMembro({
      ...membro,
      status: newStatus
    });

    this.notify();
    return newCard;
  }

  public updateCartao(cartaoAtualizado: CartaoAdvertencia): void {
    const list = this.getCartoes();
    const oldCard = list.find(c => c.id === cartaoAtualizado.id);
    if (!oldCard) {
      throw new Error('Cartão não encontrado para atualização.');
    }

    const previousMemberId = oldCard.membroId;
    const newMemberId = cartaoAtualizado.membroId;

    let finalCard = { ...cartaoAtualizado };
    if (newMemberId !== previousMemberId) {
      const newMembro = this.getMembroById(newMemberId);
      if (newMembro) {
        finalCard.membroNome = newMembro.nome;
        finalCard.membroEmail = newMembro.email;
      }
    }

    finalCard.gravidade = finalCard.tipo === 'vermelho' ? 'grave' : 'moderada';

    const updatedList = list.map(c => (c.id === finalCard.id ? finalCard : c));
    localStorage.setItem(STORAGE_KEY_CARTOES, JSON.stringify(updatedList));

    // Recalcula status do membro atual
    const membro = this.getMembroById(finalCard.membroId);
    if (membro) {
      const stats = this.calculateCardStats(this.getCartoesByMembro(membro.id));
      let newStatus: MembroRioJunior['status'] = 'ativo';
      if (stats.isDesligamento) newStatus = 'desligado';
      else if (stats.totalVermelhos === 1) newStatus = 'critico';
      else if (stats.amarelosCount > 0) newStatus = 'atencao';
      this.saveMembro({ ...membro, status: newStatus });
    }

    // Se mudou de membro, recalcula tambem o status do membro anterior
    if (previousMemberId && previousMemberId !== newMemberId) {
      const prevMembro = this.getMembroById(previousMemberId);
      if (prevMembro) {
        const prevStats = this.calculateCardStats(this.getCartoesByMembro(prevMembro.id));
        let prevStatus: MembroRioJunior['status'] = 'ativo';
        if (prevStats.isDesligamento) prevStatus = 'desligado';
        else if (prevStats.totalVermelhos === 1) prevStatus = 'critico';
        else if (prevStats.amarelosCount > 0) prevStatus = 'atencao';
        this.saveMembro({ ...prevMembro, status: prevStatus });
      }
    }

    this.notify();
  }

  public deleteCartao(id: string): void {
    const cardToDelete = this.getCartoes().find(c => c.id === id);
    const cartoes = this.getCartoes().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CARTOES, JSON.stringify(cartoes));

    if (cardToDelete) {
      const membro = this.getMembroById(cardToDelete.membroId);
      if (membro) {
        const stats = this.calculateCardStats(this.getCartoesByMembro(membro.id));
        let newStatus: MembroRioJunior['status'] = 'ativo';
        if (stats.isDesligamento) {
          newStatus = 'desligado';
        } else if (stats.totalVermelhos === 1) {
          newStatus = 'critico';
        } else if (stats.amarelosCount > 0) {
          newStatus = 'atencao';
        }
        this.saveMembro({ ...membro, status: newStatus });
      }
    }

    this.notify();
  }

  public calculateCardStats(cartoes: CartaoAdvertencia[]): MembroCardStats {
    const amarelos = cartoes.filter(c => c.tipo === 'amarelo');
    const vermelhosDiretos = cartoes.filter(c => c.tipo === 'vermelho');

    const amarelosCount = amarelos.length;
    const vermelhosDiretosCount = vermelhosDiretos.length;

    // Regra: cada 2 cartões amarelos convertem em 1 cartão vermelho adicional
    const vermelhosConvertidos = Math.floor(amarelosCount / 2);
    const totalVermelhos = vermelhosDiretosCount + vermelhosConvertidos;

    const isDesligamento = totalVermelhos >= 2;

    return {
      amarelosCount,
      vermelhosDiretosCount,
      vermelhosConvertidos,
      totalVermelhos,
      isDesligamento
    };
  }

  public reloadFromSeed(): void {
    localStorage.setItem(STORAGE_KEY_MEMBROS, JSON.stringify(INITIAL_MEMBROS));
    localStorage.setItem(STORAGE_KEY_CARTOES, JSON.stringify(INITIAL_CARTOES));
    this.notify();
  }
}

export const membrosCartoesService = new MembrosCartoesService();
