import type { Knex } from 'knex';
import path from 'path';

const migrations = {
  directory: path.resolve(__dirname, 'migrations'),
  extension: 'ts'
};

const useNullAsDefault = true;

const sqliteConfig = (filename: string, pool?: Knex.PoolConfig): Knex.Config => ({
  client: 'sqlite3',
  connection: { 
    filename: path.resolve(__dirname, 'database', filename)
  },
  migrations,
  useNullAsDefault,
  ...(pool && { pool })
});

const config: { [key: string]: Knex.Config } = {
  development: sqliteConfig('dev.sqlite3', {
    afterCreate: (conn: any, done: (err: Error | null, conn?: any) => void) => {
      conn.run('PRAGMA foreign_keys = ON', done);
    }
  }),
  staging: sqliteConfig('staging.sqlite3'),
  production: sqliteConfig('prod.sqlite3')
};

// MUDE PARA export default
export default config; // ← Esta é a linha crucial