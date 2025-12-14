// migrations/20251214_remove_sexo_vitima_constraint.js

exports.up = async function(knex) {
  const hasConstraint = await knex.raw(`
    SELECT sql FROM sqlite_master WHERE type='table' AND name='ocorrencias'
  `).then(result => {
    if (result && result.length > 0) {
      const sql = result[0].sql;
      return sql.includes('CHECK');
    }
    return false;
  });

  if (hasConstraint) {
    // Passo 1: Criar tabela temporária sem constraint
    await knex.raw(`
      CREATE TABLE ocorrencias_backup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        carimbo_data_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        numero_aviso TEXT UNIQUE NOT NULL,
        diretoria TEXT NOT NULL,
        grupamento TEXT NOT NULL,
        ponto_base TEXT NOT NULL,
        data_acionamento TIMESTAMP NOT NULL,
        natureza_ocorrencia TEXT NOT NULL,
        grupo_ocorrencia TEXT NOT NULL,
        subgrupo_ocorrencia TEXT NOT NULL,
        situacao_ocorrencia TEXT NOT NULL,
        ocorrencia_nao_atendida BOOLEAN DEFAULT 0,
        horario_saida_quartel TIMESTAMP,
        horario_chegada_local TIMESTAMP,
        motivo_nao_atendida TEXT,
        motivo_sem_atuacao TEXT,
        horario_saida_local TIMESTAMP,
        vitima_envolvida BOOLEAN DEFAULT 0,
        sexo_vitima TEXT,
        idade_vitima INTEGER,
        classificacao_vitima TEXT,
        destino_vitima TEXT,
        viatura_empregada TEXT NOT NULL,
        numero_viatura TEXT NOT NULL,
        forma_acionamento TEXT NOT NULL,
        local_acionamento TEXT NOT NULL,
        municipio TEXT NOT NULL,
        regiao TEXT NOT NULL,
        bairro TEXT NOT NULL,
        tipo_logradouro TEXT NOT NULL,
        ais TEXT NOT NULL,
        logradouro TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        foto TEXT,
        numero TEXT,
        situacao TEXT,
        criado_por TEXT,
        dataAtualizacao TIMESTAMP,
        dataCriacao TIMESTAMP,
        dataRegistro TIMESTAMP,
        fotos TEXT,
        sincronizado BOOLEAN DEFAULT 0,
        usuario_matricula TEXT,
        id_custom TEXT,
        usuario_id INTEGER
      )
    `);

    // Passo 2: Copiar dados
    await knex.raw(`
      INSERT INTO ocorrencias_backup 
      SELECT * FROM ocorrencias
    `);

    // Passo 3: Dropar tabela original
    await knex.raw(`DROP TABLE ocorrencias`);

    // Passo 4: Renomear backup
    await knex.raw(`ALTER TABLE ocorrencias_backup RENAME TO ocorrencias`);

    // Passo 5: Recriar índices
    await knex.raw(`CREATE INDEX idx_numero_aviso ON ocorrencias(numero_aviso)`);
    await knex.raw(`CREATE INDEX idx_data_acionamento ON ocorrencias(data_acionamento)`);
    await knex.raw(`CREATE INDEX idx_municipio_bairro ON ocorrencias(municipio, bairro)`);
  }
};

exports.down = async function(knex) {
  // Não há rollback necessário
  return Promise.resolve();
};
