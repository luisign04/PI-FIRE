// migrations/20251214_add_situacao_to_ocorrencias.js

exports.up = async function(knex) {
  return knex.schema.table('ocorrencias', table => {
    // Adiciona campo situacao como alias para compatibilidade
    table.string('situacao').nullable();
  });
};

exports.down = async function(knex) {
  return knex.schema.table('ocorrencias', table => {
    table.dropColumn('situacao');
  });
};
