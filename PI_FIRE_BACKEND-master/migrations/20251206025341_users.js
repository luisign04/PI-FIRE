"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        // Identificação
        table.string("name").notNullable();
        table.string("email").unique().notNullable();
        // Segurança
        table.string("password_hash").notNullable(); // Armazenará a senha criptografada
        // Informações do Corpo de Bombeiros
        table.string("grupamento");
        table.string("role").defaultTo('firefighter'); // Nível de acesso (Ex: 'admin', 'firefighter')
        // Timestamps
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTableIfExists("users");
}
//# sourceMappingURL=20251206025341_users.js.map