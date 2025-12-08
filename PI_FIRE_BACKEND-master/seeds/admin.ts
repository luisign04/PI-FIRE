import { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  const senhaHash = await bcrypt.hash("admin123", 10);

  await knex("users").del(); // limpa
  await knex("users").insert({
    name: "Administrador",
    email: "admin@sistema.com",
    password_hash: senhaHash,
    grupamento: null,
    role: "admin",
  });
}
