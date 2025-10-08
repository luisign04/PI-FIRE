export interface Occurrence {
  id?: number;
  // Dados Internos
  carimbo_data_hora?: Date;
  numero_aviso: string;
  diretoria: string;
  grupamento: string;
  ponto_base: string;
  data_acionamento: Date;
  
  // Ocorrência
  natureza_ocorrencia: string;
  grupo_ocorrencia: string;
  subgrupo_ocorrencia: string;
  situacao_ocorrencia: string;
  ocorrencia_nao_atendida?: boolean;
  horario_saida_quartel?: string;
  horario_chegada_local?: string;
  motivo_nao_atendida?: string;
  motivo_sem_atuacao?: string;
  horario_saida_local?: string;
  
  // Informações da Vítima
  vitima_envolvida?: boolean;
  sexo_vitima?: 'Masculino' | 'Feminino' | 'Outro';
  idade_vitima?: number;
  classificacao_vitima?: string;
  destino_vitima?: string;
  
  // Viatura e Acionamento
  viatura_empregada: string;
  numero_viatura: string;
  forma_acionamento: string;
  local_acionamento: string;
  
  // Endereço
  municipio: string;
  regiao: string;
  bairro: string;
  tipo_logradouro: string;
  ais: string;
  logradouro: string;
  latitude?: number;
  longitude?: number;
  
  created_at?: Date;
  updated_at?: Date;
}