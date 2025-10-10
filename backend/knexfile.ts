import type { Knex } from 'knex';
import path from 'path';
import fs from 'fs';

// Garantir que a pasta src/database existe
const databaseDir = path.resolve(__dirname, 'src', 'database');
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
  console.log('✅ Pasta src/database criada:', databaseDir);
}

const migrations = {
  directory: path.resolve(__dirname, 'migrations'),
  extension: 'ts'
};

const useNullAsDefault = true;

const sqliteConfig = (filename: string, pool?: Knex.PoolConfig): Knex.Config => ({
  client: 'sqlite3',
  connection: { 
    filename: path.resolve(databaseDir, filename)
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

// Mude para export default
export default config; // ← Esta é a linha crucial