// migrations/20251214_add_usuario_id.js

exports.up = async function(knex) {
  return knex.schema.table('ocorrencias', table => {
    // Adiciona campo usuario_id como chave estrangeira
    table.integer('usuario_id').unsigned().nullable();
  });
};

exports.down = async function(knex) {
  return knex.schema.table('ocorrencias', table => {
    table.dropColumn('usuario_id');
  });
};
