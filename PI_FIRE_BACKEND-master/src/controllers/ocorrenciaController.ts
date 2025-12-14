// src/controllers/ocorrenciaController.ts

import { Request, Response } from 'express';
import { OcorrenciaModel } from '../models/ocorrenciaModel';
import { Ocorrencia, CreateOcorrencia } from '../types/ocorrencias';

const ocorrenciaModel = new OcorrenciaModel();

export const ocorrenciaController = {
  // CREATE - Criar nova ocorrência
  async create(req: Request, res: Response) {
    try {
      const ocorrenciaData: any = req.body;
      const foto = req.file ? req.file.filename : null;

      // Adicionar carimbo de data/hora atual se não fornecido
      if (!ocorrenciaData.carimbo_data_hora) {
        ocorrenciaData.carimbo_data_hora = new Date();
      }

      // Se o ID for uma string (ID customizado), salvar em id_custom e remover
      if (ocorrenciaData.id && typeof ocorrenciaData.id === 'string') {
        ocorrenciaData.id_custom = ocorrenciaData.id;
        delete ocorrenciaData.id;
      }

      // Remover campos que podem causar problemas de SQL injection ou sintaxe
      if (ocorrenciaData.fotos && typeof ocorrenciaData.fotos === 'object') {
        ocorrenciaData.fotos = JSON.stringify(ocorrenciaData.fotos);
      }

      console.log('📝 Dados recebidos:', ocorrenciaData);
      console.log('📸 Foto recebida:', foto);

      const id = await ocorrenciaModel.create({ 
        ...ocorrenciaData, 
        foto 
      });

      res.status(201).json({ 
        success: true, 
        message: 'Ocorrência registrada com sucesso', 
        id,
        foto 
      });
    } catch (error: any) {
      console.error('❌ Erro ao criar ocorrência:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao registrar ocorrência',
        details: error.message 
      });
    }
  },

  // LIST - Listar todas ocorrências
  async list(req: Request, res: Response) {
    try {
      const ocorrencias = await ocorrenciaModel.findAll();
      console.log('📋 Ocorrências encontradas:', ocorrencias.length);
      
      res.json({ 
        success: true, 
        data: ocorrencias,
        count: ocorrencias.length
      });
    } catch (error: any) {
      console.error('❌ Erro ao listar ocorrências:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar ocorrências',
        details: error.message 
      });
    }
  },

  // GET BY ID - Buscar ocorrência por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('🔍 Buscando ocorrência ID:', id);
      
      const ocorrencia = await ocorrenciaModel.findById(Number(id));
      
      if (!ocorrencia) {
        return res.status(404).json({ 
          success: false, 
          error: 'Ocorrência não encontrada' 
        });
      }
      
      res.json({ 
        success: true, 
        data: ocorrencia 
      });
    } catch (error: any) {
      console.error('❌ Erro ao buscar ocorrência por ID:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar ocorrência',
        details: error.message 
      });
    }
  },

  // FILTER - Filtrar ocorrências por múltiplos critérios
  async filter(req: Request, res: Response) {
    try {
      const {
        municipio,
        diretoria,
        grupamento,
        natureza_ocorrencia,
        situacao_ocorrencia,
        data_inicio,
        data_fim,
        viatura_empregada,
        forma_acionamento,
        regiao,
        bairro,
        ais
      } = req.query;

      // Construir objeto de filtros
      const filtros: Partial<Ocorrencia> = {};
      
      if (municipio) filtros.municipio = municipio as string;
      if (diretoria) filtros.diretoria = diretoria as string;
      if (grupamento) filtros.grupamento = grupamento as string;
      if (natureza_ocorrencia) filtros.natureza_ocorrencia = natureza_ocorrencia as string;
      if (situacao_ocorrencia) filtros.situacao_ocorrencia = situacao_ocorrencia as string;
      if (viatura_empregada) filtros.viatura_empregada = viatura_empregada as string;
      if (forma_acionamento) filtros.forma_acionamento = forma_acionamento as string;
      if (regiao) filtros.regiao = regiao as string;
      if (bairro) filtros.bairro = bairro as string;
      if (ais) filtros.ais = ais as string;

      console.log('🔍 Aplicando filtros:', filtros);
      
      // Filtros de data opcionais
      const options: any = {};
      if (data_inicio) options.dataInicio = data_inicio as string;
      if (data_fim) options.dataFim = data_fim as string;
      
      const ocorrencias = await ocorrenciaModel.findByFilter(filtros, options);
      
      res.json({ 
        success: true, 
        data: ocorrencias,
        filters: filtros,
        count: ocorrencias.length
      });
    } catch (error: any) {
      console.error('❌ Erro ao filtrar ocorrências:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao filtrar ocorrências',
        details: error.message 
      });
    }
  },
  // ADVANCED FILTER - Filtro avançado com paginação
  async advancedFilter(req: Request, res: Response) {
    try {
      const {
        municipio,
        diretoria,
        grupamento,
        natureza_ocorrencia,
        situacao_ocorrencia,
        data_inicio,
        data_fim,
        viatura_empregada,
        forma_acionamento,
        regiao,
        bairro,
        ais,
        // Novos parâmetros
        page = '1',
        limit = '10',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      // Construir objeto de filtros
      const filtros: Partial<Ocorrencia> = {};
      
      if (municipio) filtros.municipio = municipio as string;
      if (diretoria) filtros.diretoria = diretoria as string;
      if (grupamento) filtros.grupamento = grupamento as string;
      if (natureza_ocorrencia) filtros.natureza_ocorrencia = natureza_ocorrencia as string;
      if (situacao_ocorrencia) filtros.situacao_ocorrencia = situacao_ocorrencia as string;
      if (viatura_empregada) filtros.viatura_empregada = viatura_empregada as string;
      if (forma_acionamento) filtros.forma_acionamento = forma_acionamento as string;
      if (regiao) filtros.regiao = regiao as string;
      if (bairro) filtros.bairro = bairro as string;
      if (ais) filtros.ais = ais as string;

      console.log('🔍 Aplicando filtros avançados:', filtros);
      
      // Configurar opções com paginação
      const options: any = {
        dataInicio: data_inicio as string,
        dataFim: data_fim as string,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'ASC' | 'DESC'
      };
      
      // Usar o método findAdvanced do model (que você já tem)
      const result = await ocorrenciaModel.findAdvanced(filtros, options);
      
      res.json({ 
        success: true, 
        data: result.data,
        pagination: result.pagination,
        filters: filtros,
        count: result.data.length
      });
    } catch (error: any) {
      console.error('❌ Erro no filtro avançado:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro no filtro avançado',
        details: error.message 
      });
    }
  },
  // UPDATE - Atualizar ocorrência existente
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: Partial<Ocorrencia> = req.body;
      const foto = req.file ? req.file.filename : undefined;
      
      console.log('🔄 Atualizando ocorrência ID:', id);
      console.log('📝 Dados para atualizar:', updateData);
      
      // Verificar se a ocorrência existe
      const existingOcorrencia = await ocorrenciaModel.findById(Number(id));
      if (!existingOcorrencia) {
        return res.status(404).json({ 
          success: false, 
          error: 'Ocorrência não encontrada' 
        });
      }
      
      // Preparar dados para atualização
      const dataToUpdate: Partial<Ocorrencia> = { ...updateData };
      
      // Adicionar nova foto se fornecida
      if (foto !== undefined) {
        dataToUpdate.foto = foto;
      }
      
      const updated = await ocorrenciaModel.update(Number(id), dataToUpdate);
      
      if (!updated) {
        return res.status(500).json({ 
          success: false, 
          error: 'Falha ao atualizar ocorrência' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Ocorrência atualizada com sucesso',
        data: updated 
      });
    } catch (error: any) {
      console.error('❌ Erro ao atualizar ocorrência:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao atualizar ocorrência',
        details: error.message 
      });
    }
  },

  // DELETE - Deletar ocorrência
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      console.log('🗑️ Deletando ocorrência ID:', id);
      
      // Verificar se a ocorrência existe
      const ocorrencia = await ocorrenciaModel.findById(Number(id));
      
      if (!ocorrencia) {
        return res.status(404).json({ 
          success: false, 
          error: 'Ocorrência não encontrada' 
        });
      }
      
      const deleted = await ocorrenciaModel.delete(Number(id));
      
      if (!deleted) {
        return res.status(500).json({ 
          success: false, 
          error: 'Falha ao deletar ocorrência' 
        });
      }
      
      res.json({ 
        success: true, 
        message: 'Ocorrência deletada com sucesso',
        id: Number(id)
      });
    } catch (error: any) {
      console.error('❌ Erro ao deletar ocorrência:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao deletar ocorrência',
        details: error.message 
      });
    }
  },

  // GET STATS - Obter estatísticas para dashboard
  async getStats(req: Request, res: Response) {
    try {
      console.log('📊 Gerando estatísticas...');
      
      // Usar método consolidado do model
      const stats = await ocorrenciaModel.getDashboardStats();
      
      res.json({
        success: true,
        data: {
          ...stats,
          atualizado_em: new Date()
        }
      });
    } catch (error: any) {
      console.error('❌ Erro ao gerar estatísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao gerar estatísticas',
        details: error.message
      });
    }
  },

  // GET ML TRAINING DATA - Obter dados formatados para treinar o modelo de ML
  async getMLTrainingData(req: Request, res: Response) {
    try {
      console.log('🤖 Preparando dados para Machine Learning...');
      
      const ocorrencias = await ocorrenciaModel.findAll();
      
      // Formatar dados para o formato esperado pelo ML
      const trainingData = ocorrencias.map((oc: any) => {
        // Calcular turno baseado no horário
        let turno = 0;
        if (oc.horario_saida_quartel || oc.data_acionamento) {
          const dataHora = new Date(oc.horario_saida_quartel || oc.data_acionamento);
          const hora = dataHora.getHours();
          if (hora >= 6 && hora < 12) turno = 1; // Manhã
          else if (hora >= 12 && hora < 18) turno = 2; // Tarde
          else if (hora >= 18 && hora < 24) turno = 3; // Noite
          else turno = 0; // Madrugada
        }

        // Calcular dia da semana
        const diaSemana = oc.data_acionamento ? new Date(oc.data_acionamento).getDay() : 0;

        // Calcular tempo de resposta em minutos
        let tempoResposta = null;
        if (oc.horario_saida_quartel && oc.horario_chegada_local) {
          const saida = new Date(oc.horario_saida_quartel);
          const chegada = new Date(oc.horario_chegada_local);
          if (!isNaN(saida.getTime()) && !isNaN(chegada.getTime())) {
            tempoResposta = Math.abs(chegada.getTime() - saida.getTime()) / 1000 / 60;
          }
        }

        // Estimar complexidade baseada na natureza
        let complexidade = 5;
        if (oc.natureza_ocorrencia) {
          const natureza = oc.natureza_ocorrencia.toLowerCase();
          if (natureza.includes('incêndio') || natureza.includes('produtos perigosos')) {
            complexidade = 8;
          } else if (natureza.includes('aph')) {
            complexidade = 6;
          } else if (natureza.includes('resgate')) {
            complexidade = 7;
          }
        }

        return {
          // Dados básicos
          natureza: oc.natureza_ocorrencia || 'Outro',
          regiao: oc.regiao || 'Não especificado',
          dia_semana: diaSemana,
          turno: turno,
          complexidade: complexidade,
          
          // Dados da vítima
          idade: oc.idade_vitima || null,
          sexo: oc.sexo_vitima || null,
          classificacao_vitima: oc.classificacao_vitima || null,
          
          // Métricas calculadas
          tempo_resposta: tempoResposta,
          necessita_samu: oc.classificacao_vitima ? 
            (oc.classificacao_vitima.toLowerCase().includes('grave') || 
             oc.classificacao_vitima.toLowerCase().includes('óbito')) : false,
          
          // Metadados
          situacao: oc.situacao_ocorrencia || oc.situacao,
          data_ocorrencia: oc.data_acionamento || oc.carimbo_data_hora
        };
      }).filter(item => item.natureza && item.regiao); // Filtrar registros incompletos

      res.json({
        success: true,
        total_records: trainingData.length,
        data: trainingData,
        generated_at: new Date().toISOString()
      });
      
      console.log(`✅ ${trainingData.length} registros preparados para ML`);
    } catch (error: any) {
      console.error('❌ Erro ao preparar dados para ML:', error);
      res.status(500).json({
        success: false,
        error: 'Erro ao preparar dados para ML',
        details: error.message
      });
    }
  }
};