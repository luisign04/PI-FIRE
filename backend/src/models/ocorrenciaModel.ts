import db from '../database/connection';
import { Ocorrencia } from '../types/ocorrencias';

export class OcorrenciaModel {
    async create(ocorrencia: Omit<Ocorrencia, 'id'>): Promise<number> {
        try {
            console.log('🎯 Inserindo no banco:', ocorrencia); // Debug
            const [id] = await db('occurrences').insert(ocorrencia);
            console.log('✅ ID retornado:', id); // Debug
            return id;
        } catch (error: any) {
            console.error('❌ Erro no model create:', error);
            throw error;
        }
    }

    async findAll(): Promise<Ocorrencia[]> {
        try {
            const ocorrencias = await db('occurrences').select('*').orderBy('created_at', 'desc');
            console.log('📊 Total de ocorrências:', ocorrencias.length); // Debug
            return ocorrencias;
        } catch (error: any) {
            console.error('❌ Erro no model findAll:', error);
            throw error;
        }
    }

    async findById(id: number): Promise<Ocorrencia | undefined> {
        try {
            const ocorrencia = await db('occurrences').where({ id }).first();
            console.log('🔎 Ocorrência encontrada:', ocorrencia); // Debug
            return ocorrencia;
        } catch (error: any) {
            console.error('❌ Erro no model findById:', error);
            throw error;
        }
    }
}