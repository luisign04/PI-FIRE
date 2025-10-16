// src/controllers/ocorrenciaController.ts
import { Request, Response } from 'express';
import { OcorrenciaModel } from '../models/ocorrenciaModel';

const ocorrenciaModel = new OcorrenciaModel();

export const ocorrenciaController = {
  async create(req: Request, res: Response) {
    try {
      const ocorrenciaData = req.body;
      console.log('📝 Dados recebidos:', ocorrenciaData); // Debug
      
      const id = await ocorrenciaModel.create(ocorrenciaData);
      
      res.status(201).json({ 
        success: true, 
        message: 'Ocorrência registrada com sucesso', 
        id 
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

  async list(req: Request, res: Response) {
    try {
      const ocorrencias = await ocorrenciaModel.findAll();
      console.log('📋 Ocorrências encontradas:', ocorrencias.length); // Debug
      
      res.json({ 
        success: true, 
        data: ocorrencias 
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

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('🔍 Buscando ocorrência ID:', id); // Debug
      
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
  }
};