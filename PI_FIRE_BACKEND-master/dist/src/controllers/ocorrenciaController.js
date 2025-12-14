"use strict";
// src/controllers/ocorrenciaController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ocorrenciaController = void 0;
const ocorrenciaModel_1 = require("../models/ocorrenciaModel");
const ocorrenciaModel = new ocorrenciaModel_1.OcorrenciaModel();
exports.ocorrenciaController = {
    // CREATE - Criar nova ocorrência
    async create(req, res) {
        try {
            const ocorrenciaData = req.body;
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
        }
        catch (error) {
            console.error('❌ Erro ao criar ocorrência:', error);
            res.status(500).json({
                success: false,
                error: 'Erro ao registrar ocorrência',
                details: error.message
            });
        }
    },
    // LIST - Listar todas ocorrências
    async list(req, res) {
        try {
            const ocorrencias = await ocorrenciaModel.findAll();
            console.log('📋 Ocorrências encontradas:', ocorrencias.length);
            res.json({
                success: true,
                data: ocorrencias,
                count: ocorrencias.length
            });
        }
        catch (error) {
            console.error('❌ Erro ao listar ocorrências:', error);
            res.status(500).json({
                success: false,
                error: 'Erro ao buscar ocorrências',
                details: error.message
            });
        }
    },
    // GET BY ID - Buscar ocorrência por ID
    async getById(req, res) {
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
        }
        catch (error) {
            console.error('❌ Erro ao buscar ocorrência por ID:', error);
            res.status(500).json({
                success: false,
                error: 'Erro ao buscar ocorrência',
                details: error.message
            });
        }
    },
    // FILTER - Filtrar ocorrências por múltiplos critérios
    async filter(req, res) {
        try {
            const { municipio, diretoria, grupamento, natureza_ocorrencia, situacao_ocorrencia, data_inicio, data_fim, viatura_empregada, forma_acionamento, regiao, bairro, ais } = req.query;
            // Construir objeto de filtros
            const filtros = {};
            if (municipio)
                filtros.municipio = municipio;
            if (diretoria)
                filtros.diretoria = diretoria;
            if (grupamento)
                filtros.grupamento = grupamento;
            if (natureza_ocorrencia)
                filtros.natureza_ocorrencia = natureza_ocorrencia;
            if (situacao_ocorrencia)
                filtros.situacao_ocorrencia = situacao_ocorrencia;
            if (viatura_empregada)
                filtros.viatura_empregada = viatura_empregada;
            if (forma_acionamento)
                filtros.forma_acionamento = forma_acionamento;
            if (regiao)
                filtros.regiao = regiao;
            if (bairro)
                filtros.bairro = bairro;
            if (ais)
                filtros.ais = ais;
            console.log('🔍 Aplicando filtros:', filtros);
            // Filtros de data opcionais
            const options = {};
            if (data_inicio)
                options.dataInicio = data_inicio;
            if (data_fim)
                options.dataFim = data_fim;
            const ocorrencias = await ocorrenciaModel.findByFilter(filtros, options);
            res.json({
                success: true,
                data: ocorrencias,
                filters: filtros,
                count: ocorrencias.length
            });
        }
        catch (error) {
            console.error('❌ Erro ao filtrar ocorrências:', error);
            res.status(500).json({
                success: false,
                error: 'Erro ao filtrar ocorrências',
                details: error.message
            });
        }
    },
    // ADVANCED FILTER - Filtro avançado com paginação
    async advancedFilter(req, res) {
        try {
            const { municipio, diretoria, grupamento, natureza_ocorrencia, situacao_ocorrencia, data_inicio, data_fim, viatura_empregada, forma_acionamento, regiao, bairro, ais, 
            // Novos parâmetros
            page = '1', limit = '10', sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
            // Construir objeto de filtros
            const filtros = {};
            if (municipio)
                filtros.municipio = municipio;
            if (diretoria)
                filtros.diretoria = diretoria;
            if (grupamento)
                filtros.grupamento = grupamento;
            if (natureza_ocorrencia)
                filtros.natureza_ocorrencia = natureza_ocorrencia;
            if (situacao_ocorrencia)
                filtros.situacao_ocorrencia = situacao_ocorrencia;
            if (viatura_empregada)
                filtros.viatura_empregada = viatura_empregada;
            if (forma_acionamento)
                filtros.forma_acionamento = forma_acionamento;
            if (regiao)
                filtros.regiao = regiao;
            if (bairro)
                filtros.bairro = bairro;
            if (ais)
                filtros.ais = ais;
            console.log('🔍 Aplicando filtros avançados:', filtros);
            // Configurar opções com paginação
            const options = {
                dataInicio: data_inicio,
                dataFim: data_fim,
                page: parseInt(page),
                limit: parseInt(limit),
                sortBy: sortBy,
                sortOrder: sortOrder
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
        }
        catch (error) {
            console.error('❌ Erro no filtro avançado:', error);
            res.status(500).json({
                success: false,
                error: 'Erro no filtro avançado',
                details: error.message
            });
        }
    },
    // UPDATE - Atualizar ocorrência existente
    async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
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
            const dataToUpdate = { ...updateData };
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
        }
        catch (error) {
            console.error('❌ Erro ao atualizar ocorrência:', error);
            res.status(500).json({
                success: false,
                error: 'Erro ao atualizar ocorrência',
                details: error.message
            });
        }
    },
    // DELETE - Deletar ocorrência
    async delete(req, res) {
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
        }
        catch (error) {
            console.error('❌ Erro ao deletar ocorrência:', error);
            res.status(500).json({
                success: false,
                error: 'Erro ao deletar ocorrência',
                details: error.message
            });
        }
    },
    // GET STATS - Obter estatísticas para dashboard
    async getStats(req, res) {
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
        }
        catch (error) {
            console.error('❌ Erro ao gerar estatísticas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro ao gerar estatísticas',
                details: error.message
            });
        }
    }
};
//# sourceMappingURL=ocorrenciaController.js.map