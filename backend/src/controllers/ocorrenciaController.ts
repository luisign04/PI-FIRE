// src/controllers/ocorrenciaController.ts
import { Request, Response } from 'express';
import { OcorrenciaModel } from '../models/ocorrenciaModel';

const ocorrenciaModel = new OcorrenciaModel();

export const ocorrenciaController = {
  async create(req: Request, res: Response) {
    try {
      const ocorrenciaData = req.body;
      const id = await ocorrenciaModel.create(ocorrenciaData);
      res.status(201).json({ 
        success: true, 
        message: 'Ocorrência registrada com sucesso', 
        id 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao registrar ocorrência' 
      });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const ocorrencias = await ocorrenciaModel.findAll();
      res.json({ 
        success: true, 
        data: ocorrencias 
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar ocorrências' 
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
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
      res.status(500).json({ 
        success: false, 
        error: 'Erro ao buscar ocorrência' 
      });
    }
  }
};