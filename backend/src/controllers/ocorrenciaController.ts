import {Request, Response} from 'express'
import {OcorrenciaModel} from '../models/ocorrenciaModel'

const ocorrenciaModel = new OcorrenciaModel();

export class OcorrenciaController {

    async create (req: Request, res: Response){
        try{
            const ocorrenciaData = req.body;
            const id = await ocorrenciaModel.create(ocorrenciaData);
            res.status(201).json({id, message: 'Ocorrência criada com sucesso'});
        } catch (error) {
            res.status(500).json({message: 'Erro ao criar ocorrência', error});
        }
    }
    async list (req: Request, res: Response){
        try{
            const ocorrencias = await ocorrenciaModel.findAll();
            res.json(ocorrencias);
        }catch (error) {
            res.status(500).json({message: 'Erro ao listar ocorrências', error});
        }
    }
}