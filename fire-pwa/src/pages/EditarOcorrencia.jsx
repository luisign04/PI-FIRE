// src/pages/EditarOcorrencias.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useScrollToTop from "../hooks/useScrollToTop";
import {
  Save,
  X,
  Building2,
  AlertTriangle,
  User,
  Car,
  MapPin,
  FileText,
} from "lucide-react";
import Header from "../components/Header";
import { useOcorrenciasContext } from "../contexts/OcorrenciasContext";
import "../styles/EditarOcorrencia.css";

// Importar dados dos pickers
import {
  GRUPAMENTOS,
  NATUREZAS,
  GRUPOS_OCORRENCIA,
  SUBGRUPOS_OCORRENCIA,
  SITUACOES,
  SEXOS,
  CLASSIFICACOES,
  DESTINOS,
  ACIONAMENTOS,
  TIPOS_LOGRADOURO,
  MUNICIPIOS_PERNAMBUCO,
  REGIOES,
} from "../constants/pickerData";

const MOTIVOS_NAO_ATENDIMENTO = [
  { label: "Selecione o motivo de não atendimento", value: "" },
  { label: "Vítima Socorrida pelo Samu", value: "Vítima Socorrida pelo Samu" },
  { label: "Vítima Socorrida pelos Populares", value: "Vítima Socorrida pelos Populares" },
  { label: "Recusou Atendimento", value: "Recusou Atendimento" },
  { label: "Outro", value: "Outro" },
];

export default function EditarOcorrencias() {
  useScrollToTop();
  const navigate = useNavigate();
  const location = useLocation();
  const { editarOcorrencia } = useOcorrenciasContext();

  const ocorrencia = location.state?.ocorrencia;

  if (!ocorrencia) {
    navigate("/listar-ocorrencias");
    return null;
  }

  // Funções auxiliares para parse
  const parseDataHora = (dataString) => {
    if (!dataString) return new Date().toISOString().slice(0, 16);
    try {
      const date = new Date(dataString);
      return date.toISOString().slice(0, 16);
    } catch {
      return new Date().toISOString().slice(0, 16);
    }
  };

  const parseHora = (horaString) => {
    if (!horaString) return "";
    try {
      if (horaString.includes("T")) {
        return new Date(horaString).toTimeString().slice(0, 5);
      }
      return horaString.slice(0, 5);
    } catch {
      return "";
    }
  };

  // Estados dos campos
  const [dataHora, setDataHora] = useState(parseDataHora(ocorrencia.dataHora));
  const [numeroAviso, setNumeroAviso] = useState(ocorrencia.numeroAviso || "");
  const [diretoria, setDiretoria] = useState(ocorrencia.diretoria || "");
  const [grupamento, setGrupamento] = useState(ocorrencia.grupamento || "");
  const [pontoBase, setPontoBase] = useState(ocorrencia.pontoBase || "");

  const [natureza, setNatureza] = useState(ocorrencia.natureza || "");
  const [grupoOcorrencia, setGrupoOcorrencia] = useState(ocorrencia.grupoOcorrencia || "");
  const [subgrupoOcorrencia, setSubgrupoOcorrencia] = useState(ocorrencia.subgrupoOcorrencia || "");
  const [situacao, setSituacao] = useState(ocorrencia.situacao || ocorrencia.status || "");
  const [horaSaidaQuartel, setHoraSaidaQuartel] = useState(parseHora(ocorrencia.horaSaidaQuartel));
  const [horaLocal, setHoraLocal] = useState(parseHora(ocorrencia.horaLocal || ocorrencia.horaChegadaLocal));
  const [horaSaidaLocal, setHoraSaidaLocal] = useState(parseHora(ocorrencia.horaSaidaLocal));
  const [motivoNaoAtendida, setMotivoNaoAtendida] = useState(ocorrencia.motivoNaoAtendida || "");
  const [motivoOutro, setMotivoOutro] = useState(ocorrencia.motivoOutro || "");
  const [vitimaSamu, setVitimaSamu] = useState(ocorrencia.vitimaSamu || false);

  const [envolvida, setEnvolvida] = useState(ocorrencia.envolvida || false);
  const [sexo, setSexo] = useState(ocorrencia.sexo || "");
  const [idade, setIdade] = useState(ocorrencia.idade || "");
  const [classificacao, setClassificacao] = useState(ocorrencia.classificacao || "");
  const [destino, setDestino] = useState(ocorrencia.destino || "");

  const [viatura, setViatura] = useState(ocorrencia.viatura || "");
  const [numeroViatura, setNumeroViatura] = useState(ocorrencia.numeroViatura || "");
  const [acionamento, setAcionamento] = useState(ocorrencia.acionamento || "");
  const [localAcionamento, setLocalAcionamento] = useState(ocorrencia.localAcionamento || "");

  const [municipio, setMunicipio] = useState(ocorrencia.municipio || "");
  const [regiao, setRegiao] = useState(ocorrencia.regiao || "");
  const [bairro, setBairro] = useState(ocorrencia.bairro || "");
  const [tipoLogradouro, setTipoLogradouro] = useState(ocorrencia.tipoLogradouro || "");
  const [ais, setAis] = useState(ocorrencia.ais || "");
  const [logradouro, setLogradouro] = useState(ocorrencia.logradouro || "");
  const [numero, setNumero] = useState(ocorrencia.numero || "");
  const [latitude, setLatitude] = useState(ocorrencia.latitude || "");
  const [longitude, setLongitude] = useState(ocorrencia.longitude || "");

  const [descricao, setDescricao] = useState(ocorrencia.descricao || "");
  const [saving, setSaving] = useState(false);

  // Validações
  const handleIdadeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") {
      setIdade("");
      return;
    }
    let idadeNum = parseInt(numericValue, 10);
    if (idadeNum > 125) idadeNum = 125;
    setIdade(idadeNum.toString());
  };

  const handleAISChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") {
      setAis("");
      return;
    }
    let aisNum = parseInt(numericValue, 10);
    if (aisNum < 1) aisNum = 1;
    else if (aisNum > 10) aisNum = 10;
    setAis(aisNum.toString());
  };

  const handleAISBlur = () => {
    if (ais && ais !== "") {
      const aisNumber = parseInt(ais, 10);
      if (!isNaN(aisNumber) && aisNumber >= 1 && aisNumber <= 10) {
        const formattedAIS = aisNumber < 10 ? `0${aisNumber}` : aisNumber.toString();
        setAis(formattedAIS);
      }
    }
  };

  const formatHoraToISO = (horaString) => {
    if (!horaString) return "";
    try {
      const hoje = new Date();
      const [horas, minutos] = horaString.split(":");
      hoje.setHours(parseInt(horas) || 0);
      hoje.setMinutes(parseInt(minutos) || 0);
      hoje.setSeconds(0);
      return hoje.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch {
      return "";
    }
  };

  const handleSalvar = async () => {
    if (!natureza.trim() && !grupoOcorrencia.trim()) {
      alert("Preencha pelo menos a Natureza ou o Grupo da Ocorrência");
      return;
    }

    setSaving(true);

    let aisToSave = ais;
    if (aisToSave && aisToSave !== "") {
      const aisNumber = parseInt(aisToSave, 10);
      if (!isNaN(aisNumber) && aisNumber >= 1 && aisNumber <= 10) {
        aisToSave = aisNumber < 10 ? `0${aisNumber}` : aisNumber.toString();
      }
    }

    const dadosAtualizados = {
      dataHora: new Date(dataHora).toISOString(),
      numeroAviso: numeroAviso.trim(),
      diretoria: diretoria.trim(),
      grupamento: grupamento.trim(),
      pontoBase: pontoBase.trim(),
      natureza: natureza.trim(),
      grupoOcorrencia: grupoOcorrencia.trim(),
      subgrupoOcorrencia: subgrupoOcorrencia.trim(),
      situacao: situacao.trim(),
      status: situacao.trim(),
      horaSaidaQuartel: formatHoraToISO(horaSaidaQuartel),
      horaLocal: formatHoraToISO(horaLocal),
      horaChegadaLocal: formatHoraToISO(horaLocal),
      horaSaidaLocal: formatHoraToISO(horaSaidaLocal),
      motivoNaoAtendida: motivoNaoAtendida.trim(),
      motivoOutro: motivoOutro.trim(),
      vitimaSamu,
      envolvida,
      sexo: sexo.trim(),
      idade: idade.trim(),
      classificacao: classificacao.trim(),
      destino: destino.trim(),
      viatura: viatura.trim(),
      numeroViatura: numeroViatura.trim(),
      acionamento: acionamento.trim(),
      localAcionamento: localAcionamento.trim(),
      municipio: municipio.trim(),
      regiao: regiao.trim(),
      bairro: bairro.trim(),
      tipoLogradouro: tipoLogradouro.trim(),
      ais: aisToSave,
      logradouro: logradouro.trim(),
      numero: numero.trim(),
      latitude: latitude.trim(),
      longitude: longitude.trim(),
      descricao: descricao.trim(),
    };

    const result = await editarOcorrencia(ocorrencia.id, dadosAtualizados);

    setSaving(false);

    if (result.success) {
      alert("Ocorrência atualizada com sucesso!");
      navigate("/listar-ocorrencias");
    } else {
      alert(result.message || "Falha ao atualizar ocorrência");
    }
  };

  const handleCancelar = () => {
    if (window.confirm("Deseja descartar as alterações?")) {
      navigate("/listar-ocorrencias");
    }
  };

  return (
    <div className="editar-container">
      <Header title="Editar Ocorrência" />

      <div className="content">
        <div className="page-header">
          <h1 className="page-title">Editar Ocorrência</h1>
          <p className="page-subtitle">ID: {ocorrencia.id?.slice(0, 20)}...</p>
        </div>

        <div className="form-container">
          {/* DADOS INTERNOS */}
          <div className="section">
            <div className="section-header">
              <Building2 size={24} color="#bc010c" />
              <h2 className="section-title">Dados Internos</h2>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">Data e Hora</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="label">Número do Aviso</label>
                <input
                  type="text"
                  className="input"
                  value={numeroAviso}
                  onChange={(e) => setNumeroAviso(e.target.value)}
                  placeholder="Número do chamado"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">Diretoria</label>
                <input
                  type="text"
                  className="input"
                  value={diretoria}
                  onChange={(e) => setDiretoria(e.target.value)}
                  placeholder="Ex: 1ª Diretoria, DIM"
                />
              </div>

              <div className="form-field">
                <label className="label">Grupamento</label>
                <select
                  className="input"
                  value={grupamento}
                  onChange={(e) => setGrupamento(e.target.value)}
                >
                  {GRUPAMENTOS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field full-width">
              <label className="label">Ponto Base</label>
              <input
                type="text"
                className="input"
                value={pontoBase}
                onChange={(e) => setPontoBase(e.target.value)}
                placeholder="Local da base"
              />
            </div>
          </div>

          {/* OCORRÊNCIA */}
          <div className="section">
            <div className="section-header">
              <AlertTriangle size={24} color="#bc010c" />
              <h2 className="section-title">Ocorrência</h2>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">
                  Natureza <span className="required">*</span>
                </label>
                <select
                  className="input"
                  value={natureza}
                  onChange={(e) => setNatureza(e.target.value)}
                >
                  {NATUREZAS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="label">Grupo da Ocorrência</label>
                <select
                  className="input"
                  value={grupoOcorrencia}
                  onChange={(e) => setGrupoOcorrencia(e.target.value)}
                >
                  {GRUPOS_OCORRENCIA.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">Subgrupo da Ocorrência</label>
                <select
                  className="input"
                  value={subgrupoOcorrencia}
                  onChange={(e) => setSubgrupoOcorrencia(e.target.value)}
                >
                  {SUBGRUPOS_OCORRENCIA.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="label">Situação/Status</label>
                <select
                  className="input"
                  value={situacao}
                  onChange={(e) => setSituacao(e.target.value)}
                >
                  {SITUACOES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">Hora Saída do Quartel</label>
                <input
                  type="time"
                  className="input"
                  value={horaSaidaQuartel}
                  onChange={(e) => setHoraSaidaQuartel(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="label">Hora Chegada ao Local</label>
                <input
                  type="time"
                  className="input"
                  value={horaLocal}
                  onChange={(e) => setHoraLocal(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="label">Hora Saída do Local</label>
                <input
                  type="time"
                  className="input"
                  value={horaSaidaLocal}
                  onChange={(e) => setHoraSaidaLocal(e.target.value)}
                />
              </div>
            </div>

            {(situacao === "Não Atendida" || situacao === "Sem Atuação") && (
              <>
                <div className="form-field full-width">
                  <label className="label">Motivo Não Atendimento</label>
                  <select
                    className="input"
                    value={motivoNaoAtendida}
                    onChange={(e) => setMotivoNaoAtendida(e.target.value)}
                  >
                    {MOTIVOS_NAO_ATENDIMENTO.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {motivoNaoAtendida === "Outro" && (
                  <div className="form-field full-width">
                    <label className="label">Especificar Outro Motivo</label>
                    <textarea
                      className="input textarea"
                      value={motivoOutro}
                      onChange={(e) => {
                        if (e.target.value.length <= 100)
                          setMotivoOutro(e.target.value);
                      }}
                      placeholder="Especifique o motivo (máx. 100 caracteres)"
                      maxLength={100}
                      rows={3}
                    />
                    <span className="hint">{motivoOutro.length}/100 caracteres</span>
                  </div>
                )}
              </>
            )}

            <div className="form-field checkbox-field full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={vitimaSamu}
                  onChange={(e) => setVitimaSamu(e.target.checked)}
                />
                <span>Vítima Socorrida pelo SAMU</span>
              </label>
            </div>
          </div>

          {/* INFORMAÇÕES DA VÍTIMA */}
          <div className="section">
            <div className="section-header">
              <User size={24} color="#bc010c" />
              <h2 className="section-title">Informações da Vítima</h2>
            </div>

            <div className="form-field checkbox-field full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={envolvida}
                  onChange={(e) => setEnvolvida(e.target.checked)}
                />
                <span>Vítima Envolvida</span>
              </label>
            </div>

            {envolvida && (
              <>
                <div className="form-row">
                  <div className="form-field">
                    <label className="label">Sexo</label>
                    <select
                      className="input"
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                    >
                      {SEXOS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="label">Idade</label>
                    <input
                      type="text"
                      className="input"
                      value={idade}
                      onChange={(e) => handleIdadeChange(e.target.value)}
                      placeholder="Digite a idade (0-125)"
                      maxLength={3}
                    />
                    <span className="hint">Idade limitada a 125 anos</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="label">Classificação</label>
                    <select
                      className="input"
                      value={classificacao}
                      onChange={(e) => setClassificacao(e.target.value)}
                    >
                      {CLASSIFICACOES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="label">Destino</label>
                    <select
                      className="input"
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)}
                    >
                      {DESTINOS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* VIATURA E ACIONAMENTO */}
          <div className="section">
            <div className="section-header">
              <Car size={24} color="#bc010c" />
              <h2 className="section-title">Viatura e Acionamento</h2>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">Viatura Empregada</label>
                <input
                  type="text"
                  className="input"
                  value={viatura}
                  onChange={(e) => setViatura(e.target.value)}
                  placeholder="Tipo de viatura"
                />
              </div>

              <div className="form-field">
                <label className="label">Número da Viatura</label>
                <input
                  type="text"
                  className="input"
                  value={numeroViatura}
                  onChange={(e) => setNumeroViatura(e.target.value)}
                  placeholder="Identificação da viatura"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">Forma de Acionamento</label>
                <select
                  className="input"
                  value={acionamento}
                  onChange={(e) => setAcionamento(e.target.value)}
                >
                  {ACIONAMENTOS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="label">Local do Acionamento</label>
                <input
                  type="text"
                  className="input"
                  value={localAcionamento}
                  onChange={(e) => setLocalAcionamento(e.target.value)}
                  placeholder="Onde foi feito o chamado"
                />
              </div>
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="section">
            <div className="section-header">
              <MapPin size={24} color="#bc010c" />
              <h2 className="section-title">Endereço da Ocorrência</h2>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">Município</label>
                <select
                  className="input"
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                >
                  {MUNICIPIOS_PERNAMBUCO.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="label">Região</label>
                <select
                  className="input"
                  value={regiao}
                  onChange={(e) => setRegiao(e.target.value)}
                >
                  {REGIOES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="label">Bairro</label>
                <input
                  type="text"
                  className="input"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Nome do bairro"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">Tipo de Logradouro</label>
                <select
                  className="input"
                  value={tipoLogradouro}
                  onChange={(e) => setTipoLogradouro(e.target.value)}
                >
                  {TIPOS_LOGRADOURO.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="label">AIS (Área Integrada de Segurança)</label>
                <input
                  type="text"
                  className="input"
                  value={ais}
                  onChange={(e) => handleAISChange(e.target.value)}
                  onBlur={handleAISBlur}
                  placeholder="AIS 1-10"
                  maxLength={2}
                />
                <span className="hint">AIS deve ser entre 1 e 10</span>
              </div>
            </div>

            <div className="form-field full-width">
              <label className="label">Logradouro</label>
              <input
                type="text"
                className="input"
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
                placeholder="Nome da rua/avenida"
              />
            </div>

            <div className="form-field">
              <label className="label">Número</label>
              <input
                type="text"
                className="input"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Número do imóvel"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="label">Latitude</label>
                <input
                  type="text"
                  className="input"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Ex: -8.0476"
                />
              </div>

              <div className="form-field">
                <label className="label">Longitude</label>
                <input
                  type="text"
                  className="input"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Ex: -34.8770"
                />
              </div>
            </div>
          </div>

          {/* DESCRIÇÃO ADICIONAL */}
          <div className="section">
            <div className="section-header">
              <FileText size={24} color="#bc010c" />
              <h2 className="section-title">Descrição Adicional</h2>
            </div>

            <div className="form-field full-width">
              <label className="label">Observações</label>
              <textarea
                className="input textarea"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva detalhes adicionais da ocorrência..."
                rows={5}
              />
            </div>
          </div>

          {ocorrencia.dataAtualizacao && (
            <div className="info-box">
              <span className="info-text">
                Última atualização:{" "}
                {new Date(ocorrencia.dataAtualizacao).toLocaleString("pt-BR")}
              </span>
            </div>
          )}

          <div className="action-buttons">
            <button
              className="save-button"
              onClick={handleSalvar}
              disabled={saving}
            >
              <Save size={20} />
              <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
            </button>

            <button
              className="cancel-button"
              onClick={handleCancelar}
              disabled={saving}
            >
              <X size={20} />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}