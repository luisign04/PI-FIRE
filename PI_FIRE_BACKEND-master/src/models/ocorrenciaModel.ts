// src/models/ocorrenciaModel.ts

import db from '../database/connection';
import { Ocorrencia, CreateOcorrencia } from '../types/ocorrencias';

export class OcorrenciaModel {
  // CREATE - Criar nova ocorrência
  async create(ocorrencia: CreateOcorrencia): Promise<number> {
    try {
      console.log('🎯 Inserindo ocorrência no banco...');
      
      // Adicionar timestamps se não existirem
      const ocorrenciaComTimestamps = {
        ...ocorrencia,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const [id] = await db('ocorrencias').insert(ocorrenciaComTimestamps);
      
      if (id === undefined) {
        throw new Error('Falha ao inserir ocorrência: ID não retornado');
      }
      
      console.log('✅ Ocorrência criada com ID:', id);
      return id;
    } catch (error: any) {
      console.error('❌ Erro ao criar ocorrência:', error);
      throw error;
    }
  }

  // FIND ALL - Buscar todas ocorrências
  async findAll(): Promise<Ocorrencia[]> {
    try {
      const ocorrencias = await db('ocorrencias')
        .select('*')
        .orderBy('created_at', 'desc');
      
      console.log('📊 Total de ocorrências:', ocorrencias.length);
      return ocorrencias;
    } catch (error: any) {
      console.error('❌ Erro no model findAll:', error);
      throw error;
    }
  }

  // FIND BY ID - Buscar ocorrência por ID
  async findById(id: number): Promise<Ocorrencia | undefined> {
    try {
      const ocorrencia = await db('ocorrencias').where({ id }).first();
      console.log('🔎 Ocorrência encontrada:', ocorrencia ? 'Sim' : 'Não');
      return ocorrencia;
    } catch (error: any) {
      console.error('❌ Erro no model findById:', error);
      throw error;
    }
  }

  // FIND BY FILTER - Filtrar ocorrências com múltiplos critérios
  async findByFilter(
    filtros: Partial<Ocorrencia>, 
    options?: { dataInicio?: string; dataFim?: string }
  ): Promise<Ocorrencia[]> {
    try {
      let query = db('ocorrencias').select('*');

      // Aplicar filtros simples (igualdade)
      const camposParaFiltro = [
        'municipio', 'diretoria', 'grupamento', 'natureza_ocorrencia',
        'situacao_ocorrencia', 'viatura_empregada', 'forma_acionamento',
        'regiao', 'bairro', 'ais', 'ponto_base', 'grupo_ocorrencia',
        'subgrupo_ocorrencia', 'numero_viatura', 'tipo_logradouro'
      ];

      camposParaFiltro.forEach(campo => {
        if (filtros[campo as keyof Ocorrencia]) {
          query = query.where(campo, filtros[campo as keyof Ocorrencia]);
        }
      });

      // Filtros especiais para datas
      if (options?.dataInicio) {
        query = query.where('data_acionamento', '>=', options.dataInicio);
      }
      if (options?.dataFim) {
        query = query.where('data_acionamento', '<=', options.dataFim);
      }

      // Ordenar por data de criação decrescente
      query = query.orderBy('created_at', 'desc');

      const ocorrencias = await query;
      console.log('🔍 Ocorrências encontradas com filtro:', ocorrencias.length);
      return ocorrencias;
    } catch (error: any) {
      console.error('❌ Erro no model findByFilter:', error);
      throw error;
    }
  }
  // FIND ADVANCED - Busca avançada com paginação
  async findAdvanced(
    filtros: Partial<Ocorrencia>,
    options: {
      dataInicio?: string;
      dataFim?: string;
      page: number;
      limit: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
    }
  ): Promise<{ data: Ocorrencia[]; pagination: any }> {
    try {
      let query = db('ocorrencias').select('*');

      // Aplicar filtros
      const camposExatos = [
        'municipio', 'diretoria', 'grupamento', 'natureza_ocorrencia',
        'situacao_ocorrencia', 'viatura_empregada', 'forma_acionamento',
        'regiao', 'bairro', 'ais', 'ponto_base', 'grupo_ocorrencia',
        'subgrupo_ocorrencia', 'numero_viatura', 'tipo_logradouro'
      ];

      camposExatos.forEach(campo => {
        if (filtros[campo as keyof Ocorrencia]) {
          query = query.where(campo, filtros[campo as keyof Ocorrencia]);
        }
      });

      // Datas
      if (options.dataInicio) {
        query = query.where('data_acionamento', '>=', options.dataInicio);
      }
      if (options.dataFim) {
        query = query.where('data_acionamento', '<=', options.dataFim);
      }

      // Ordenação
      query = query.orderBy(options.sortBy, options.sortOrder);

      // Paginação
      const offset = (options.page - 1) * options.limit;
      query = query.offset(offset).limit(options.limit);

      const data = await query;

      // Contar total
      let countQuery = db('ocorrencias').count('id as total');
      camposExatos.forEach(campo => {
        if (filtros[campo as keyof Ocorrencia]) {
          countQuery = countQuery.where(campo, filtros[campo as keyof Ocorrencia]);
        }
      });
      
      if (options.dataInicio) {
        countQuery = countQuery.where('data_acionamento', '>=', options.dataInicio);
      }
      if (options.dataFim) {
        countQuery = countQuery.where('data_acionamento', '<=', options.dataFim);
      }

      const countResult = await countQuery.first();
      const total = Number(countResult?.total) || 0;

      const pagination = {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit)
      };

      return { data, pagination };
    } catch (error: any) {
      console.error('❌ Erro no model findAdvanced:', error);
      throw error;
    }
  }
  // UPDATE - Atualizar ocorrência
  async update(id: number, data: Partial<Ocorrencia>): Promise<Ocorrencia | undefined> {
    try {
      console.log('🔄 Atualizando ocorrência ID:', id);
      
      // Adicionar timestamp de atualização
      const dataComTimestamp = {
        ...data,
        updated_at: new Date()
      };
      
      const updatedCount = await db('ocorrencias')
        .where({ id })
        .update(dataComTimestamp);
      
      if (updatedCount === 0) {
        console.log('⚠️ Ocorrência não encontrada para atualização');
        return undefined;
      }
      
      // Retornar a ocorrência atualizada
      const updatedOcorrencia = await this.findById(id);
      console.log('✅ Ocorrência atualizada com sucesso');
      return updatedOcorrencia;
    } catch (error: any) {
      console.error('❌ Erro no model update:', error);
      throw error;
    }
  }

  // DELETE - Deletar ocorrência
  async delete(id: number): Promise<boolean> {
    try {
      console.log('🗑️ Deletando ocorrência ID:', id);
      
      const deletedCount = await db('ocorrencias').where({ id }).delete();
      
      if (deletedCount === 0) {
        console.log('⚠️ Ocorrência não encontrada para deleção');
        return false;
      }
      
      console.log('✅ Ocorrência deletada com sucesso');
      return true;
    } catch (error: any) {
      console.error('❌ Erro no model delete:', error);
      throw error;
    }
  }

  // STATISTICS METHODS

  // Contar total de ocorrências
  async count(): Promise<number> {
    try {
      const result = await db('ocorrencias').count('id as total').first();
      return Number(result?.total) || 0;
    } catch (error: any) {
      console.error('❌ Erro no model count:', error);
      throw error;
    }
  }

  // Contar ocorrências por município
  async countByMunicipio(): Promise<Array<{ municipio: string; total: number }>> {
    try {
      const result = await db('ocorrencias')
        .select('municipio')
        .count('id as total')
        .groupBy('municipio')
        .orderBy('total', 'desc');
      
      // Garantir que municipio seja sempre string
      return result.map(row => ({
        municipio: String(row.municipio || 'Não informado'),
        total: Number(row.total) || 0
      }));
    } catch (error: any) {
      console.error('❌ Erro no model countByMunicipio:', error);
      throw error;
    }
  }

  // Contar ocorrências por situação
  async countBySituacao(): Promise<Array<{ situacao_ocorrencia: string; total: number }>> {
    try {
      const result = await db('ocorrencias')
        .select('situacao_ocorrencia')
        .count('id as total')
        .groupBy('situacao_ocorrencia')
        .orderBy('total', 'desc');
      
      // Garantir que situacao_ocorrencia seja sempre string
      return result.map(row => ({
        situacao_ocorrencia: String(row.situacao_ocorrencia || 'Não informada'),
        total: Number(row.total) || 0
      }));
    } catch (error: any) {
      console.error('❌ Erro no model countBySituacao:', error);
      throw error;
    }
  }

  // Contar ocorrências por natureza
  async countByNatureza(): Promise<Array<{ natureza_ocorrencia: string; total: number }>> {
    try {
      const result = await db('ocorrencias')
        .select('natureza_ocorrencia')
        .count('id as total')
        .groupBy('natureza_ocorrencia')
        .orderBy('total', 'desc');
      
      // Garantir que natureza_ocorrencia seja sempre string
      return result.map(row => ({
        natureza_ocorrencia: String(row.natureza_ocorrencia || 'Não informada'),
        total: Number(row.total) || 0
      }));
    } catch (error: any) {
      console.error('❌ Erro no model countByNatureza:', error);
      throw error;
    }
  }

  // Contar ocorrências do último mês
  async countLastMonth(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await db('ocorrencias')
        .count('id as total')
        .where('created_at', '>=', thirtyDaysAgo)
        .first();
      
      return Number(result?.total) || 0;
    } catch (error: any) {
      console.error('❌ Erro no model countLastMonth:', error);
      throw error;
    }
  }

  // Buscar ocorrências recentes (últimas 10)
  async findRecent(limit: number = 10): Promise<Ocorrencia[]> {
    try {
      const ocorrencias = await db('ocorrencias')
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(limit);
      
      return ocorrencias;
    } catch (error: any) {
      console.error('❌ Erro no model findRecent:', error);
      throw error;
    }
  }

  // Estatísticas resumidas para dashboard
  async getDashboardStats() {
    try {
      const [
        total,
        porMunicipio,
        porSituacao,
        porNatureza,
        ultimoMes,
        recentes
      ] = await Promise.all([
        this.count(),
        this.countByMunicipio(),
        this.countBySituacao(),
        this.countByNatureza(),
        this.countLastMonth(),
        this.findRecent(5)
      ]);

      return {
        total,
        por_municipio: porMunicipio,
        por_situacao: porSituacao,
        por_natureza: porNatureza,
        ultimo_mes: ultimoMes,
        recentes
      };
    } catch (error: any) {
      console.error('❌ Erro no model getDashboardStats:', error);
      throw error;
    }
  }
}