import db from '../database/connection';
import { Ocorrencia } from '../types/ocorrencias';

export class OcorrenciaModel {
    async create(ocorrencia: Omit<Ocorrencia, 'id'>): Promise<number> {
        try {
            console.log('🎯 Inserindo ocorrência no banco...');
            const [id] = await db('ocorrencias').insert(ocorrencia);
            
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

    async findAll(): Promise<Ocorrencia[]> {
        try {
            const ocorrencias = await db('ocorrencias').select('*').orderBy('created_at', 'desc');
            console.log('📊 Total de ocorrências:', ocorrencias.length); // Debug
            return ocorrencias;
        } catch (error: any) {
            console.error('❌ Erro no model findAll:', error);
            throw error;
        }
    }

    async findById(id: number): Promise<Ocorrencia | undefined> {
        try {
            const ocorrencia = await db('ocorrencias').where({ id }).first();
            console.log('🔎 Ocorrência encontrada:', ocorrencia); // Debug
            return ocorrencia;
        } catch (error: any) {
            console.error('❌ Erro no model findById:', error);
            throw error;
        }
    }
}