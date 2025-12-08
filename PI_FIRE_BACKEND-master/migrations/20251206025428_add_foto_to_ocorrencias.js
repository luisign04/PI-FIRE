"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.alterTable("ocorrencias", (table) => {
        table.string("foto").nullable();
    });
}
async function down(knex) {
    return knex.schema.alterTable("ocorrencias", (table) => {
        table.dropColumn("foto");
    });
}
//# sourceMappingURL=20251206025428_add_foto_to_ocorrencias.js.map