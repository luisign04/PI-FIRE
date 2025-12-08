"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable("ocorrencias", (table) => {
        table.increments("id").primary();
        // Dados Internos
        table.timestamp('carimbo_data_hora').defaultTo(knex.fn.now()).notNullable();
        table.string('numero_aviso').unique().notNullable();
        table.string('diretoria').notNullable();
        table.string('grupamento').notNullable();
        table.string('ponto_base').notNullable();
        table.timestamp('data_acionamento').notNullable();
        // Ocorrência
        table.string('natureza_ocorrencia').notNullable();
        table.string('grupo_ocorrencia').notNullable();
        table.string('subgrupo_ocorrencia').notNullable();
        table.string('situacao_ocorrencia').notNullable();
        table.boolean('ocorrencia_nao_atendida').defaultTo(false);
        table.timestamp('horario_saida_quartel');
        table.timestamp('horario_chegada_local');
        table.text('motivo_nao_atendida');
        table.text('motivo_sem_atuacao');
        table.timestamp('horario_saida_local');
        // Vítima
        table.boolean('vitima_envolvida').defaultTo(false);
        table.string('sexo_vitima').checkIn(['Masculino', 'Feminino', 'Outro']);
        table.integer('idade_vitima');
        table.string('classificacao_vitima');
        table.string('destino_vitima');
        // Viatura
        table.string('viatura_empregada').notNullable();
        table.string('numero_viatura').notNullable();
        table.string('forma_acionamento').notNullable();
        table.string('local_acionamento').notNullable();
        // Endereço
        table.string('municipio').notNullable();
        table.string('regiao').notNullable();
        table.string('bairro').notNullable();
        table.string('tipo_logradouro').notNullable();
        table.string('ais').notNullable();
        table.string('logradouro').notNullable();
        table.decimal('latitude', 10, 8);
        table.decimal('longitude', 11, 8);
        // Timestamps automáticos
        table.timestamps(true, true);
        // Índices
        table.index(['numero_aviso']);
        table.index(['data_acionamento']);
        table.index(['municipio', 'bairro']);
    });
}
async function down(knex) {
    return knex.schema.dropTableIfExists("ocorrencias");
}
//# sourceMappingURL=20251206025056_create_ocorrencias.js.map