// migrations/20251214_add_missing_columns.js

exports.up = async function(knex) {
  return knex.schema.table('ocorrencias', table => {
    // Campos de controle e auditoria
    table.string('criado_por').nullable();
    table.timestamp('dataAtualizacao').nullable();
    table.timestamp('dataCriacao').nullable();
    table.timestamp('dataRegistro').nullable();
    table.text('fotos').nullable(); // JSON string com array de fotos
    table.boolean('sincronizado').defaultTo(false);
    table.string('usuario_matricula').nullable();
    
    // Campos opcionais que podem estar faltando
    table.string('id_custom').nullable(); // Para IDs customizados do tipo 'ocorrencia_xxx'
  });
};

exports.down = async function(knex) {
  return knex.schema.table('ocorrencias', table => {
    table.dropColumn('criado_por');
    table.dropColumn('dataAtualizacao');
    table.dropColumn('dataCriacao');
    table.dropColumn('dataRegistro');
    table.dropColumn('fotos');
    table.dropColumn('sincronizado');
    table.dropColumn('usuario_matricula');
    table.dropColumn('id_custom');
  });
};
