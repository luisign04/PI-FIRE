// migrations/20251214_add_numero_to_ocorrencias.ts

exports.up = async function(knex) {
  return knex.schema.table('ocorrencias', table => {
    // Adiciona campo numero se não existir
    table.string('numero').nullable();
  });
};

exports.down = async function(knex) {
  return knex.schema.table('ocorrencias', table => {
    table.dropColumn('numero');
  });
};
