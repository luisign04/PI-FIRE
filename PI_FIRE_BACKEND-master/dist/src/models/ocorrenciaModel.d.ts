import { Ocorrencia, CreateOcorrencia } from '../types/ocorrencias';
export declare class OcorrenciaModel {
    create(ocorrencia: CreateOcorrencia): Promise<number>;
    findAll(): Promise<Ocorrencia[]>;
    findById(id: number): Promise<Ocorrencia | undefined>;
    findByFilter(filtros: Partial<Ocorrencia>, options?: {
        dataInicio?: string;
        dataFim?: string;
    }): Promise<Ocorrencia[]>;
    findAdvanced(filtros: Partial<Ocorrencia>, options: {
        dataInicio?: string;
        dataFim?: string;
        page: number;
        limit: number;
        sortBy: string;
        sortOrder: 'ASC' | 'DESC';
    }): Promise<{
        data: Ocorrencia[];
        pagination: any;
    }>;
    update(id: number, data: Partial<Ocorrencia>): Promise<Ocorrencia | undefined>;
    delete(id: number): Promise<boolean>;
    count(): Promise<number>;
    countByMunicipio(): Promise<Array<{
        municipio: string;
        total: number;
    }>>;
    countBySituacao(): Promise<Array<{
        situacao_ocorrencia: string;
        total: number;
    }>>;
    countByNatureza(): Promise<Array<{
        natureza_ocorrencia: string;
        total: number;
    }>>;
    countLastMonth(): Promise<number>;
    findRecent(limit?: number): Promise<Ocorrencia[]>;
    getDashboardStats(): Promise<{
        total: number;
        por_municipio: {
            municipio: string;
            total: number;
        }[];
        por_situacao: {
            situacao_ocorrencia: string;
            total: number;
        }[];
        por_natureza: {
            natureza_ocorrencia: string;
            total: number;
        }[];
        ultimo_mes: number;
        recentes: Ocorrencia[];
    }>;
}
//# sourceMappingURL=ocorrenciaModel.d.ts.map