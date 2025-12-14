// src/pages/CriarOcorrencia.jsx
import React, { useState, useEffect, useContext } from "react";
import { Camera, MapPin, Trash2, Upload, X, Loader } from "lucide-react";
import Header from "../components/Header";
import { useOcorrenciasContext } from "../contexts/OcorrenciasContext";
import useScrollToTop from "../hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";
import "../styles/CriaOcorrencia.css";
import { AuthContext } from "../contexts/AuthContext";

// Importar constantes (você precisará adaptar o caminho conforme sua estrutura)
import {
  REGIOES,
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
} from "../constants/pickerData";

const MOTIVOS_NAO_ATENDIMENTO = [
  { label: "Selecione o motivo de não atendimento", value: "" },
  { label: "Vítima Socorrida pelo Samu", value: "Vítima Socorrida pelo Samu" },
  { label: "Vítima Socorrida pelos Populares", value: "Vítima Socorrida pelos Populares" },
  { label: "Recusou Atendimento", value: "Recusou Atendimento" },
  { label: "Outro", value: "Outro" },
];

// Função para gerar o número do aviso
const gerarNumeroAviso = () => {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  const horas = String(agora.getHours()).padStart(2, "0");
  const minutos = String(agora.getMinutes()).padStart(2, "0");
  const segundos = String(agora.getSeconds()).padStart(2, "0");
  const sufixo = Math.floor(1000 + Math.random() * 9000);
  return `${ano}${mes}${dia}${horas}${minutos}${segundos}${sufixo}`;
};

// Função de validação
const validateRequiredFields = (
  formData,
  dataHora,
  horaSaidaQuartel,
  horaLocal,
  horaSaidaLocal
) => {
  const camposObrigatorios = [
    { campo: "Data e Hora", preenchido: dataHora !== "" },
    { campo: "Diretoria", preenchido: !!formData.diretoria?.trim() },
    { campo: "Grupamento", preenchido: !!formData.grupamento?.trim() },
    { campo: "Ponto Base", preenchido: !!formData.pontoBase?.trim() },
    { campo: "Natureza da Ocorrência", preenchido: !!formData.natureza?.trim() },
    { campo: "Grupo da Ocorrência", preenchido: !!formData.grupoOcorrencia?.trim() },
    { campo: "Subgrupo da Ocorrência", preenchido: !!formData.subgrupoOcorrencia?.trim() },
    { campo: "Situação da Ocorrência", preenchido: !!formData.situacao?.trim() },
    { campo: "Saída do Quartel", preenchido: horaSaidaQuartel !== "" },
    { campo: "Chegada no Local", preenchido: horaLocal !== "" },
    { campo: "Saída do Local", preenchido: horaSaidaLocal !== "" },
    { campo: "Município", preenchido: !!formData.municipio?.trim() },
    { campo: "Região", preenchido: !!formData.regiao?.trim() },
    { campo: "Tipo de Logradouro", preenchido: !!formData.tipoLogradouro?.trim() },
    { campo: "Logradouro", preenchido: !!formData.logradouro?.trim() },
  ];

  return camposObrigatorios.filter((campo) => !campo.preenchido);
};

// Função para formatar datetime-local para ISO
const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().slice(0, 16);
};

// Função para formatar time input
const formatTimeInput = (timeString) => {
  if (!timeString) return "";
  return timeString;
};

const CriarOcorrenciaScreen = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { adicionarOcorrencia } = useOcorrenciasContext();
  const { user } = useContext(AuthContext);

  // Estado principal do formulário
  const [formData, setFormData] = useState({
    numero_aviso: gerarNumeroAviso(),
    diretoria: "DIM",
    grupamento: "",
    pontoBase: "",
    natureza: "",
    grupoOcorrencia: "",
    subgrupoOcorrencia: "",
    situacao: "",
    motivoNaoAtendida: "",
    motivoOutro: "",
    vitimaSamu: false,
    envolvida: false,
    sexo: "",
    idade: "",
    classificacao: "",
    destino: "",
    viatura: "",
    numeroViatura: "",
    acionamento: "",
    localAcionamento: "",
    municipio: "",
    regiao: "",
    bairro: "",
    tipoLogradouro: "",
    ais: "",
    logradouro: "",
    latitude: "",
    longitude: "",
  });

  // Estados para datas e horários (formato HTML5)
  const [dataHora, setDataHora] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [horaSaidaQuartel, setHoraSaidaQuartel] = useState("");
  const [horaLocal, setHoraLocal] = useState("");
  const [horaSaidaLocal, setHoraSaidaLocal] = useState("");

  const [enviando, setEnviando] = useState(false);
  const [fotoOcorrencia, setFotoOcorrencia] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Função auxiliar para combinar data e hora
  const combinarDataHora = (dataISO, horaString) => {
    const data = new Date(dataISO);
    const [hora, minuto] = horaString.split(':');
    data.setHours(parseInt(hora), parseInt(minuto), 0, 0);
    return data.toISOString();
  };

  // Atualiza número do aviso quando data/hora mudar
  useEffect(() => {
    if (dataHora) {
      setFormData((prev) => ({
        ...prev,
        numeroAviso: gerarNumeroAviso(),
      }));
    }
  }, [dataHora]);

  // Função para atualizar formData
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Função para obter localização
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador");
      return;
    }

    const confirmed = window.confirm(
      "Deseja usar sua localização atual para preencher automaticamente os campos de endereço?"
    );

    if (!confirmed) return;

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Usando API de geocoding reverso (OpenStreetMap Nominatim)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          const data = await response.json();
          
          if (data && data.address) {
            const address = data.address;
            
            updateFormData("latitude", latitude.toString());
            updateFormData("longitude", longitude.toString());
            
            if (address.city || address.town || address.village) {
              const cidade = address.city || address.town || address.village;
              updateFormData("municipio", cidade);
            }
            
            if (address.suburb || address.neighbourhood) {
              updateFormData("bairro", address.suburb || address.neighbourhood);
            }
            
            if (address.road) {
              updateFormData("logradouro", address.road);
            }
            
            alert("Localização obtida com sucesso!");
          }
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
          alert("Coordenadas obtidas, mas não foi possível buscar o endereço automaticamente.");
          
          updateFormData("latitude", latitude.toString());
          updateFormData("longitude", longitude.toString());
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationLoading(false);
        alert("Erro ao obter localização: " + error.message);
      }
    );
  };

  // Função para lidar com upload de foto
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A foto deve ter no máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoOcorrencia({
          uri: reader.result,
          fileName: file.name,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover foto
  const removerFoto = () => {
    if (window.confirm("Tem certeza que deseja remover a foto?")) {
      setFotoOcorrencia(null);
    }
  };

  // Função para validar idade
  const handleIdadeChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") {
      updateFormData("idade", "");
      return;
    }
    let idade = parseInt(numericValue, 10);
    if (idade > 125) idade = 125;
    updateFormData("idade", idade.toString());
  };

  // Função para validar AIS
  const handleAISChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "") {
      updateFormData("ais", "");
      return;
    }
    let ais = parseInt(numericValue, 10);
    if (ais < 1) ais = 1;
    else if (ais > 10) ais = 10;
    updateFormData("ais", ais.toString());
  };

  // Função para formatar AIS no blur
  const handleAISBlur = () => {
    if (formData.ais && formData.ais !== "") {
      const aisNumber = parseInt(formData.ais, 10);
      if (!isNaN(aisNumber) && aisNumber >= 1 && aisNumber <= 10) {
        const formattedAIS =
          aisNumber < 10 ? `0${aisNumber}` : aisNumber.toString();
        updateFormData("ais", formattedAIS);
      }
    }
  };

  // Função para converter hora string para Date
  const timeStringToDate = (timeString) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    return date;
  };

  // Função para formatar hora para string
  const formatHoraToString = (timeString) => {
    if (!timeString) return "";
    return timeString + ":00"; // Adiciona segundos
  };

  // Função para salvar ocorrência
  const handleSave = async () => {
    // Validação
    const camposVazios = validateRequiredFields(
      formData,
      dataHora,
      horaSaidaQuartel,
      horaLocal,
      horaSaidaLocal
    );

    if (camposVazios.length > 0) {
      const camposLista = camposVazios
        .map((campo) => `• ${campo.campo}`)
        .join("\n");
      alert(`Os seguintes campos são obrigatórios:\n\n${camposLista}`);
      return;
    }

    if (enviando) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja salvar esta ocorrência?${
        fotoOcorrencia ? "\n\nUma foto será incluída no registro." : ""
      }`
    );

    if (!confirmed) return;

    try {
      setEnviando(true);

      // Calcular tempo de resposta
      let tempoResposta = 0;
      if (horaSaidaQuartel && horaLocal) {
        const saida = timeStringToDate(horaSaidaQuartel);
        const chegada = timeStringToDate(horaLocal);
        if (saida && chegada) {
          const saidaSegundos =
            saida.getHours() * 3600 +
            saida.getMinutes() * 60 +
            saida.getSeconds();
          const chegadaSegundos =
            chegada.getHours() * 3600 +
            chegada.getMinutes() * 60 +
            chegada.getSeconds();
          tempoResposta = Math.max(0, chegadaSegundos - saidaSegundos) / 60;
        }
      }

      // Formatar AIS
      let aisToSave = formData.ais;
      if (aisToSave && aisToSave !== "") {
        const aisNumber = parseInt(aisToSave, 10);
        if (!isNaN(aisNumber) && aisNumber >= 1 && aisNumber <= 10) {
          aisToSave =
            aisNumber < 10 ? `0${aisNumber}` : aisNumber.toString();
        }
      }

      // Montar objeto da ocorrência
            // Montar objeto da ocorrência no formato do backend
      const ocorrenciaData = {
        // Dados Internos
        numero_aviso: formData.numero_aviso || gerarNumeroAviso(),
        diretoria: formData.diretoria || "DIM",
        grupamento: formData.grupamento,
        ponto_base: formData.pontoBase,
        data_acionamento: new Date(dataHora).toISOString(),
        
        // Ocorrência
        natureza_ocorrencia: formData.natureza,
        grupo_ocorrencia: formData.grupoOcorrencia,
        subgrupo_ocorrencia: formData.subgrupoOcorrencia,
        situacao_ocorrencia: formData.situacao,
        horario_saida_quartel: horaSaidaQuartel ? combinarDataHora(dataHora, horaSaidaQuartel) : null,
        horario_chegada_local: horaLocal ? combinarDataHora(dataHora, horaLocal) : null,
        horario_saida_local: horaSaidaLocal ? combinarDataHora(dataHora, horaSaidaLocal) : null,
        
        // Informações da Vítima
        vitima_envolvida: formData.envolvida,
        sexo_vitima: formData.sexo,
        idade_vitima: formData.idade ? parseInt(formData.idade) : null,
        classificacao_vitima: formData.classificacao,
        destino_vitima: formData.destino,
        
        // Viatura
        viatura_empregada: formData.viatura,
        numero_viatura: formData.numeroViatura,
        forma_acionamento: formData.acionamento,
        local_acionamento: formData.localAcionamento,
        
        // Endereço
        municipio: formData.municipio,
        regiao: formData.regiao,
        bairro: formData.bairro,
        tipo_logradouro: formData.tipoLogradouro,
        ais: aisToSave,
        logradouro: formData.logradouro,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        
        // Campos adicionais para compatibilidade
        criado_por: user?.nome || 'Usuário não identificado',
        usuario_id: user?.id || null,
        usuario_matricula: user?.matricula || null,
        
        // Foto (se houver)
        foto: fotoOcorrencia ? fotoOcorrencia.uri : null
      };

      console.log("Enviando ocorrência para o backend:", ocorrenciaData);


      console.log("Salvando ocorrência:", ocorrenciaData);

      await adicionarOcorrencia(ocorrenciaData);

      // Navegar para a tela de sucesso
      navigate("/ocorrencia-sucesso");
    } catch (error) {
      console.error("Erro ao salvar ocorrência:", error);
      alert("Não foi possível salvar a ocorrência: " + error.message);
    } finally {
      setEnviando(false);
    }
  };

  // Função para limpar formulário
  const handleClear = () => {
    if (
      window.confirm("Tem certeza que deseja limpar todos os campos?")
    ) {
      setFormData({
        numeroAviso: gerarNumeroAviso(),
        diretoria: "DIM",
        grupamento: "",
        pontoBase: "",
        natureza: "",
        grupoOcorrencia: "",
        subgrupoOcorrencia: "",
        situacao: "",
        motivoNaoAtendida: "",
        motivoOutro: "",
        vitimaSamu: false,
        envolvida: false,
        sexo: "",
        idade: "",
        classificacao: "",
        destino: "",
        viatura: "",
        numeroViatura: "",
        acionamento: "",
        localAcionamento: "",
        municipio: "",
        regiao: "",
        bairro: "",
        tipoLogradouro: "",
        ais: "",
        logradouro: "",
        latitude: "",
        longitude: "",
      });
      setDataHora(new Date().toISOString().slice(0, 16));
      setHoraSaidaQuartel("");
      setHoraLocal("");
      setHoraSaidaLocal("");
      setFotoOcorrencia(null);
    }
  };

  const shouldShowMotivo =
    formData.situacao === "Não Atendida" || formData.situacao === "Sem Atuação";

  return (
    <div className="criar-ocorrencia-container">
      <Header title="Criar Ocorrência" />
      
      <div className="criar-ocorrencia-scroll">
        <div className="form-container">
          
          {/* Dados Internos */}
          <section className="form-section">
            <h2 className="section-title">Dados Internos</h2>

            <div className="input-group">
              <label className="input-label required">Data e Hora</label>
              <input
                type="datetime-local"
                className="form-input"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Número do Aviso (I-NETOISPATCHER)</label>
              <input
                type="text"
                className="form-input auto-generated"
                value={formData.numeroAviso}
                onChange={(e) => updateFormData("numeroAviso", e.target.value)}
                placeholder="Número gerado automaticamente"
              />
              <span className="helper-text">
                Formato: YYYYMMDDHHMMSS + sufixo único
              </span>
            </div>

            <div className="input-group">
              <label className="input-label required">Diretoria</label>
              <input
                type="text"
                className="form-input"
                value={formData.diretoria}
                onChange={(e) => updateFormData("diretoria", e.target.value)}
                placeholder="Digite a diretoria"
              />
            </div>

            <div className="input-group">
              <label className="input-label required">Grupamento</label>
              <select
                className="form-select"
                value={formData.grupamento}
                onChange={(e) => updateFormData("grupamento", e.target.value)}
              >
                <option value="">Selecione o grupamento</option>
                {GRUPAMENTOS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label required">Ponto Base</label>
              <input
                type="text"
                className="form-input"
                value={formData.pontoBase}
                onChange={(e) => updateFormData("pontoBase", e.target.value)}
                placeholder="Digite o ponto base"
              />
            </div>
          </section>

          {/* Ocorrência */}
          <section className="form-section">
            <h2 className="section-title">Ocorrência</h2>

            <div className="input-group">
              <label className="input-label required">Natureza da Ocorrência</label>
              <select
                className="form-select"
                value={formData.natureza}
                onChange={(e) => updateFormData("natureza", e.target.value)}
              >
                <option value="">Selecione a natureza</option>
                {NATUREZAS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label required">Grupo da Ocorrência</label>
              <select
                className="form-select"
                value={formData.grupoOcorrencia}
                onChange={(e) => updateFormData("grupoOcorrencia", e.target.value)}
              >
                <option value="">Selecione o grupo</option>
                {GRUPOS_OCORRENCIA.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label required">Subgrupo da Ocorrência</label>
              <select
                className="form-select"
                value={formData.subgrupoOcorrencia}
                onChange={(e) => updateFormData("subgrupoOcorrencia", e.target.value)}
              >
                <option value="">Selecione o subgrupo</option>
                {SUBGRUPOS_OCORRENCIA.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label required">Situação da Ocorrência</label>
              <select
                className="form-select"
                value={formData.situacao}
                onChange={(e) => updateFormData("situacao", e.target.value)}
              >
                <option value="">Selecione a situação</option>
                {SITUACOES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-row">
              <div className="input-group flex-1">
                <label className="input-label required">Saída do Quartel</label>
                <input
                  type="time"
                  className="form-input"
                  value={horaSaidaQuartel}
                  onChange={(e) => setHoraSaidaQuartel(e.target.value)}
                />
              </div>

              <div className="input-group flex-1">
                <label className="input-label required">Chegada no Local</label>
                <input
                  type="time"
                  className="form-input"
                  value={horaLocal}
                  onChange={(e) => setHoraLocal(e.target.value)}
                />
              </div>
            </div>

            {shouldShowMotivo && (
              <>
                <div className="input-group">
                  <label className="input-label">Motivo do Não Atendimento</label>
                  <select
                    className="form-select"
                    value={formData.motivoNaoAtendida}
                    onChange={(e) => updateFormData("motivoNaoAtendida", e.target.value)}
                  >
                    {MOTIVOS_NAO_ATENDIMENTO.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.motivoNaoAtendida === "Outro" && (
                  <div className="input-group">
                    <label className="input-label">Descreva o motivo (máx. 100 caracteres)</label>
                    <textarea
                      className="form-textarea"
                      value={formData.motivoOutro}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          updateFormData("motivoOutro", e.target.value);
                        }
                      }}
                      placeholder="Digite o motivo..."
                      maxLength={100}
                      rows={3}
                    />
                    <span className="char-counter">
                      {formData.motivoOutro.length}/100 caracteres
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="input-group">
              <label className="input-label required">Saída do Local</label>
              <input
                type="time"
                className="form-input"
                value={horaSaidaLocal}
                onChange={(e) => setHoraSaidaLocal(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Vítima socorrida pelo SAMU</label>
              <div className="button-group">
                <button
                  type="button"
                  className={`option-button ${formData.vitimaSamu ? "selected" : ""}`}
                  onClick={() => updateFormData("vitimaSamu", true)}
                >
                  SIM
                </button>
                <button
                  type="button"
                  className={`option-button ${!formData.vitimaSamu ? "selected" : ""}`}
                  onClick={() => updateFormData("vitimaSamu", false)}
                >
                  NÃO
                </button>
              </div>
            </div>
          </section>

{/* Informações da Vítima */}
<section className="form-section">
  <h2 className="section-title">Informações da Vítima</h2>

  <div className="input-group">
    <label className="input-label">Vítima Envolvida</label>
    <div className="button-group">
      <button
        type="button"
        className={`option-button ${formData.envolvida ? "selected" : ""}`}
        onClick={() => updateFormData("envolvida", true)}
      >
        SIM
      </button>
      <button
        type="button"
        className={`option-button ${!formData.envolvida ? "selected" : ""}`}
        onClick={() => updateFormData("envolvida", false)}
      >
        NÃO
      </button>
    </div>
  </div>

  {/* Mostrar os campos abaixo apenas se envolvida === true */}
  {formData.envolvida && (
    <>
      <div className="input-group">
        <label className="input-label">Sexo da Vítima</label>
        <select
          className="form-select"
          value={formData.sexo}
          onChange={(e) => updateFormData("sexo", e.target.value)}
        >
          {SEXOS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label className="input-label">Idade da Vítima</label>
        <input
          type="text"
          className="form-input"
          value={formData.idade}
          onChange={(e) => handleIdadeChange(e.target.value)}
          placeholder="Digite a idade (0-125)"
          maxLength={3}
        />
        <span className="helper-text">Idade limitada a 125 anos</span>
      </div>

      <div className="input-group">
        <label className="input-label">Classificação da Vítima</label>
        <select
          className="form-select"
          value={formData.classificacao}
          onChange={(e) => updateFormData("classificacao", e.target.value)}
        >
          {CLASSIFICACOES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label className="input-label">Destino da Vítima</label>
        <select
          className="form-select"
          value={formData.destino}
          onChange={(e) => updateFormData("destino", e.target.value)}
        >
          {DESTINOS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )}
</section>

{/* Endereço da Ocorrência */}
      <section className="form-section">
        <h2 className="section-title">Endereço da Ocorrência</h2>

        <button
          type="button"
          className="location-button"
          onClick={handleGetLocation}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <>
              <Loader className="spinning" size={20} />
              <span>Obtendo localização...</span>
            </>
          ) : (
            <>
              <MapPin size={20} />
              <span>Usar Minha Localização Atual</span>
            </>
          )}
        </button>

          <div className="input-group">
            <label className="input-label required">Município</label>
            <select
              className="form-select"
              value={formData.municipio}
              onChange={(e) => updateFormData("municipio", e.target.value)}
            >
              <option value="">Selecione o município</option>
              {MUNICIPIOS_PERNAMBUCO.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>          <div className="input-group">
            <label className="input-label required">Região</label>
            <select
              className="form-select"
              value={formData.regiao}
              onChange={(e) => updateFormData("regiao", e.target.value)}
            >
              <option value="">Selecione a região</option>
              {REGIOES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>        <div className="input-group">
          <label className="input-label">Bairro</label>
          <input
            type="text"
            className="form-input"
            value={formData.bairro}
            onChange={(e) => updateFormData("bairro", e.target.value)}
            placeholder="Digite o bairro"
          />
        </div>

          <div className="input-group">
            <label className="input-label required">Tipo de Logradouro</label>
            <select
              className="form-select"
              value={formData.tipoLogradouro}
              onChange={(e) => updateFormData("tipoLogradouro", e.target.value)}
            >
              <option value="">Selecione o tipo</option>
              {TIPOS_LOGRADOURO.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>        <div className="input-group">
          <label className="input-label">AIS</label>
          <input
            type="text"
            className="form-input"
            value={formData.ais}
            onChange={(e) => handleAISChange(e.target.value)}
            onBlur={handleAISBlur}
            placeholder="AIS 1-10"
            maxLength={2}
          />
          <span className="helper-text">AIS deve ser entre 1 e 10</span>
        </div>

        <div className="input-group">
          <label className="input-label required">Logradouro</label>
          <input
            type="text"
            className="form-input"
            value={formData.logradouro}
            onChange={(e) => updateFormData("logradouro", e.target.value)}
            placeholder="Digite o logradouro"
          />
        </div>

        <div className="input-row">
          <div className="input-group flex-1">
            <label className="input-label">Latitude</label>
            <input
              type="text"
              className="form-input"
              value={formData.latitude}
              onChange={(e) => updateFormData("latitude", e.target.value)}
              placeholder="Digite a latitude"
            />
          </div>

          <div className="input-group flex-1">
            <label className="input-label">Longitude</label>
            <input
              type="text"
              className="form-input"
              value={formData.longitude}
              onChange={(e) => updateFormData("longitude", e.target.value)}
              placeholder="Digite a longitude"
            />
          </div>
        </div>
      </section>

      {/* Registro Fotográfico */}
      <section className="form-section">
        <h2 className="section-title">Registro Fotográfico</h2>

        {fotoOcorrencia ? (
          <div className="photo-preview-container">
            <img
              src={fotoOcorrencia.uri}
              alt="Preview"
              className="photo-preview"
            />
            <p className="photo-info">
              Foto: {fotoOcorrencia.fileName || "sem nome"}
            </p>
            <div className="photo-actions">
              <label className="photo-button change-button">
                <Upload size={16} />
                <span>Alterar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
              <button
                type="button"
                className="photo-button remove-button"
                onClick={removerFoto}
              >
                <Trash2 size={16} />
                <span>Remover</span>
              </button>
            </div>
          </div>
        ) : (
          <label className="upload-button">
            <div className="upload-content">
              <Camera size={40} />
              <span className="upload-text">Adicionar Foto da Ocorrência</span>
              <span className="upload-subtext">
                Clique para selecionar uma foto
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        )}
      </section>

      {/* Botões de Ação */}
      <div className="button-container">
        <button
          type="button"
          className="action-button clear-button"
          onClick={handleClear}
        >
          Limpar
        </button>

        <button
          type="button"
          className="action-button save-button"
          onClick={handleSave}
          disabled={enviando}
        >
          {enviando ? "Salvando..." : "Salvar Ocorrência"}
        </button>
      </div>

      <div className="footer-note">
        <p className="required-note">* Campos obrigatórios</p>
        <p className="app-name">FIRE ALPHA</p>
      </div>
    </div>
  </div>
</div>
  );
};

export default CriarOcorrenciaScreen;