import db from '../database/connection';
import { Ocorrencia } from '../types/ocorrencias';

export class OcorrenciaModel {
    async create(ocorrencia: Omit<Ocorrencia, 'id'>): Promise<number> {
        const [id] = await db('occurrences').insert(ocorrencia); // ← Note: 'occurrences' (inglês)
        
        // Garantir que o ID não é undefined
        if (id === undefined) {
            throw new Error('Falha ao criar ocorrência: ID não retornado');
        }
        
        return id;
    }

    async findAll(): Promise<Ocorrencia[]> {
        return db('occurrences').select('*').orderBy('created_at', 'desc');
    }

    async findById(id: number): Promise<Ocorrencia | undefined> {
        return db('occurrences').where({ id }).first();
    }
}