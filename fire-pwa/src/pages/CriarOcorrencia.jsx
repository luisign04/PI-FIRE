import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/CriaOcorrencia.css';

function CriarOcorrencia() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numero_aviso: '',
    diretoria: '',
    grupamento: '',
    ponto_base: '',
    data_acionamento: '',
    natureza_ocorrencia: '',
    grupo_ocorrencia: '',
    subgrupo_ocorrencia: '',
    situacao_ocorrencia: '',
    ocorrencia_nao_atendida: false,
    horario_saida_quartel: '',
    horario_chegada_local: '',
    motivo_nao_atendida: '',
    motivo_sem_atuacao: '',
    horario_saida_local: '',
    vitima_envolvida: false,
    sexo_vitima: '',
    idade_vitima: '',
    classificacao_vitima: '',
    destino_vitima: '',
    viatura_empregada: '',
    numero_viatura: '',
    forma_acionamento: '',
    local_acionamento: '',
    municipio: '',
    regiao: '',
    bairro: '',
    tipo_logradouro: '',
    ais: '',
    logradouro: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('ultimaOcorrencia', JSON.stringify(formData));
    alert('Ocorrência registrada com sucesso!');
    navigate('/ocorrencia-sucesso');
  };

  const handleReset = () => {
    setFormData({
      numero_aviso: '',
      diretoria: '',
      grupamento: '',
      ponto_base: '',
      data_acionamento: '',
      natureza_ocorrencia: '',
      grupo_ocorrencia: '',
      subgrupo_ocorrencia: '',
      situacao_ocorrencia: '',
      ocorrencia_nao_atendida: false,
      horario_saida_quartel: '',
      horario_chegada_local: '',
      motivo_nao_atendida: '',
      motivo_sem_atuacao: '',
      horario_saida_local: '',
      vitima_envolvida: false,
      sexo_vitima: '',
      idade_vitima: '',
      classificacao_vitima: '',
      destino_vitima: '',
      viatura_empregada: '',
      numero_viatura: '',
      forma_acionamento: '',
      local_acionamento: '',
      municipio: '',
      regiao: '',
      bairro: '',
      tipo_logradouro: '',
      ais: '',
      logradouro: '',
      latitude: '',
      longitude: ''
    });
  };

  return (
    <div className="criar-ocorrencia-page">
      <Header title="Registro de Ocorrência" />

      <form id="ocorrenciaForma" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Dados Internos</legend>
          
          <div className="form-group">
            <label htmlFor="numero_aviso">Nº do Aviso *</label>
            <input type="text" id="numero_aviso" name="numero_aviso" value={formData.numero_aviso} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="diretoria">Diretoria *</label>
            <select id="diretoria" name="diretoria" value={formData.diretoria} onChange={handleChange} required>
              <option value="">Selecione a diretoria</option>
              <option value="Norte">Norte</option>
              <option value="Sul">Sul</option>
              <option value="Leste">Leste</option>
              <option value="Oeste">Oeste</option>
              <option value="Central">Central</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="grupamento">Grupamento *</label>
            <input type="text" id="grupamento" name="grupamento" value={formData.grupamento} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="ponto_base">Ponto Base *</label>
            <input type="text" id="ponto_base" name="ponto_base" value={formData.ponto_base} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="data_acionamento">Data do Acionamento *</label>
            <input type="datetime-local" id="data_acionamento" name="data_acionamento" value={formData.data_acionamento} onChange={handleChange} required />
          </div>
        </fieldset>

        <fieldset>
          <legend>Dados da Ocorrência</legend>

          <div className="form-group">
            <label htmlFor="natureza_ocorrencia">Natureza da Ocorrência *</label>
            <select id="natureza_ocorrencia" name="natureza_ocorrencia" value={formData.natureza_ocorrencia} onChange={handleChange} required>
              <option value="">Selecione a natureza</option>
              <option value="Incêndio">Incêndio</option>
              <option value="Acidente">Acidente</option>
              <option value="Resgate">Resgate</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="grupo_ocorrencia">Grupo da Ocorrência *</label>
            <input type="text" id="grupo_ocorrencia" name="grupo_ocorrencia" value={formData.grupo_ocorrencia} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="subgrupo_ocorrencia">Subgrupo da Ocorrência *</label>
            <input type="text" id="subgrupo_ocorrencia" name="subgrupo_ocorrencia" value={formData.subgrupo_ocorrencia} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="situacao_ocorrencia">Situação da Ocorrência *</label>
            <select id="situacao_ocorrencia" name="situacao_ocorrencia" value={formData.situacao_ocorrencia} onChange={handleChange} required>
              <option value="">Selecione a situação</option>
              <option value="Atendida">Atendida</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Não Atendida">Não Atendida</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" id="ocorrencia_nao_atendida" name="ocorrencia_nao_atendida" checked={formData.ocorrencia_nao_atendida} onChange={handleChange} />
              Ocorrência não atendida
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="horario_saida_quartel">Horário de Saída do Quartel</label>
            <input type="time" id="horario_saida_quartel" name="horario_saida_quartel" value={formData.horario_saida_quartel} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="horario_chegada_local">Horário no Local da Ocorrência</label>
            <input type="time" id="horario_chegada_local" name="horario_chegada_local" value={formData.horario_chegada_local} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="motivo_nao_atendida">Ocorrência não atendida: (motivo)</label>
            <textarea id="motivo_nao_atendida" name="motivo_nao_atendida" rows="3" value={formData.motivo_nao_atendida} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="motivo_sem_atuacao">Ocorrência sem atuação: (motivo)</label>
            <textarea id="motivo_sem_atuacao" name="motivo_sem_atuacao" rows="3" value={formData.motivo_sem_atuacao} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="horario_saida_local">Horário de Saída do Local</label>
            <input type="time" id="horario_saida_local" name="horario_saida_local" value={formData.horario_saida_local} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Informações da Vítima</legend>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" id="vitima_envolvida" name="vitima_envolvida" checked={formData.vitima_envolvida} onChange={handleChange} />
              Vítima envolvida
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="sexo_vitima">Sexo da Vítima</label>
            <select id="sexo_vitima" name="sexo_vitima" value={formData.sexo_vitima} onChange={handleChange}>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="idade_vitima">Idade da Vítima</label>
            <input type="number" id="idade_vitima" name="idade_vitima" min="0" max="120" value={formData.idade_vitima} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="classificacao_vitima">Classificação da Vítima</label>
            <input type="text" id="classificacao_vitima" name="classificacao_vitima" value={formData.classificacao_vitima} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="destino_vitima">Destino da Vítima</label>
            <input type="text" id="destino_vitima" name="destino_vitima" value={formData.destino_vitima} onChange={handleChange} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Viatura e Forma de Acionamento</legend>

          <div className="form-group">
            <label htmlFor="viatura_empregada">Viatura Empregada *</label>
            <input type="text" id="viatura_empregada" name="viatura_empregada" value={formData.viatura_empregada} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="numero_viatura">Número da Viatura *</label>
            <input type="text" id="numero_viatura" name="numero_viatura" value={formData.numero_viatura} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="forma_acionamento">Forma de Acionamento *</label>
            <select id="forma_acionamento" name="forma_acionamento" value={formData.forma_acionamento} onChange={handleChange} required>
              <option value="">Selecione a forma</option>
              <option value="Telefone">Telefone</option>
              <option value="Rádio">Rádio</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="local_acionamento">Local do Acionamento *</label>
            <input type="text" id="local_acionamento" name="local_acionamento" value={formData.local_acionamento} onChange={handleChange} required />
          </div>
        </fieldset>

        <fieldset>
          <legend>Endereço</legend>

          <div className="form-group">
            <label htmlFor="municipio">Município *</label>
            <input type="text" id="municipio" name="municipio" value={formData.municipio} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="regiao">Região *</label>
            <input type="text" id="regiao" name="regiao" value={formData.regiao} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="bairro">Bairro *</label>
            <input type="text" id="bairro" name="bairro" value={formData.bairro} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="tipo_logradouro">Tipo de Logradouro *</label>
            <select id="tipo_logradouro" name="tipo_logradouro" value={formData.tipo_logradouro} onChange={handleChange} required>
              <option value="">Selecione</option>
              <option value="Rua">Rua</option>
              <option value="Avenida">Avenida</option>
              <option value="Praça">Praça</option>
              <option value="Travessa">Travessa</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ais">AIS *</label>
            <input type="text" id="ais" name="ais" value={formData.ais} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="logradouro">Logradouro *</label>
            <input type="text" id="logradouro" name="logradouro" value={formData.logradouro} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input type="number" step="any" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input type="number" step="any" id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} />
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Registrar Ocorrência</button>
          <button type="button" onClick={handleReset}>Limpar Formulário</button>
        </div>
      </form>
    </div>
  );
}

export default CriarOcorrencia;