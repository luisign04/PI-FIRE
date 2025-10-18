import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
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


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("users");
}

