// knexfile.ts - USE ESTA VERSÃO
import type { Knex } from 'knex';

const migrations = {
  directory: './migrations',
  extension: 'ts'
};

const useNullAsDefault = true;

const sqliteConfig = (filename: string, pool?: Knex.PoolConfig): Knex.Config => ({
  client: 'sqlite3',
  connection: { filename },
  migrations,
  useNullAsDefault,
  ...(pool && { pool })
});

const config: { [key: string]: Knex.Config } = {
  development: sqliteConfig('./dev.sqlite3', {
    afterCreate: (conn: any, done: (err: Error | null, conn?: any) => void) => {
      conn.run('PRAGMA foreign_keys = ON', done);
    }
  }),
  staging: sqliteConfig('./staging.sqlite3'),
  production: sqliteConfig('./prod.sqlite3')
};

// Use module.exports em vez de export default
module.exports = config;
