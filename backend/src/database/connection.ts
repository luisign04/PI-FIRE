import knex from "knex";
import config from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';

// Garantir que a configuração existe
const knexConfig = config[environment];
if (!knexConfig) {
  throw new Error(`Knex configuration not found for environment: ${environment}`);
}

const db = knex(knexConfig);

export default db;