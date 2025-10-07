// knexfile.ts - USE ESTA VERSÃO
import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn: any, done: any) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      }
    }
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: './staging.sqlite3'
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './prod.sqlite3'
    },
    migrations: {
      directory: './migrations',
      extension: 'ts'
    },
    useNullAsDefault: true
  }
};

// Use module.exports em vez de export default
module.exports = config;