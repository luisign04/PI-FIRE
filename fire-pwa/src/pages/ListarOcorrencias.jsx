// src/pages/ListarOcorrencias.jsx
import { exportToCSV, exportToPDF } from '../services/exportService';
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../hooks/useScrollToTop";
import {
  List,
  Calendar,
  X,
  LayoutDashboard,
  SearchX,
  MapPin,
  Clock,
  Info,
  CalendarDays,
  Edit,
  Trash2,
  FileDown,
  Table,
  FileText,
  Filter,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "../components/Header";
import { useOcorrenciasContext } from "../contexts/OcorrenciasContext";
import { AuthContext } from "../contexts/AuthContext";
import {
  NATUREZAS,
  SITUACOES,
  REGIOES,
  GRUPAMENTOS,
} from "../constants/pickerData";
import "../styles/ListarOcorrencias.css";

export default function ListarOcorrencias() {
  useScrollToTop();
  const navigate = useNavigate();
  const { ocorrencias, loading, removerOcorrencia } = useOcorrenciasContext();
  const { isAdmin } = useContext(AuthContext);

  // Estados de filtros
  const [filtros, setFiltros] = useState({
    data: "",
    situacao: "",
    natureza: "",
    regiao: "",
    grupamento: "",
    usuario: "",
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [selectedOccurrences, setSelectedOccurrences] = useState([]);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  // Função para atualizar filtros
  const updateFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setFiltros({
      data: "",
      situacao: "",
      natureza: "",
      regiao: "",
      grupamento: "",
      usuario: "",
    });
  };

  // Verificar se há filtros ativos
  const hasFiltrosAtivos = Object.values(filtros).some((valor) => valor !== "");

  // Filtrar ocorrências
  const ocorrenciasFiltradas = ocorrencias.filter((ocorrencia) => {
    // Filtro por data
    if (filtros.data) {
      const dataOcorrencia = ocorrencia.dataHora || ocorrencia.dataCriacao;
      if (!dataOcorrencia || !dataOcorrencia.startsWith(filtros.data)) {
        return false;
      }
    }

    // Filtro por situação
    if (filtros.situacao) {
      const situacao = (ocorrencia.situacao || ocorrencia.status || "").toLowerCase();
      if (situacao !== filtros.situacao.toLowerCase()) {
        return false;
      }
    }

    // Filtro por natureza
    if (filtros.natureza) {
      const natureza = (ocorrencia.natureza || ocorrencia.tipo || "").toLowerCase();
      if (natureza !== filtros.natureza.toLowerCase()) {
        return false;
      }
    }

    // Filtro por região
    if (filtros.regiao) {
      const regiao = (ocorrencia.regiao || "").toLowerCase();
      if (regiao !== filtros.regiao.toLowerCase()) {
        return false;
      }
    }

    // Filtro por grupamento
    if (filtros.grupamento) {
      const grupamento = (ocorrencia.grupamento || "").toLowerCase();
      if (grupamento !== filtros.grupamento.toLowerCase()) {
        return false;
      }
    }

    // Filtro por usuário
    if (filtros.usuario) {
      const usuario = (ocorrencia.criadoPor || "").toLowerCase();
      if (!usuario.includes(filtros.usuario.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  // Obter lista única de usuários
  const usuariosUnicos = [
    ...new Set(
      ocorrencias
        .map((occ) => occ.criadoPor)
        .filter(Boolean)
    ),
  ].sort();

  // Navegação
  const handleDashboard = () => navigate("/dashboard");
  const handleNovaOcorrencia = () => navigate("/criar-ocorrencia");
  
  // Navegar para detalhes
  const handleVerDetalhes = (ocorrencia) => {
    navigate(`/detalhes-ocorrencia/${ocorrencia.id}`);
  };

  // Deletar ocorrência
  const handleDelete = async (ocorrencia) => {
    if (window.confirm(`Deseja realmente excluir a ocorrência "${getTipoOcorrencia(ocorrencia)}"?\n\nEsta ação não pode ser desfeita.`)) {
      const result = await removerOcorrencia(ocorrencia.id);
      if (result.success) {
        alert("Ocorrência excluída com sucesso!");
      } else {
        alert(result.message || "Falha ao excluir ocorrência");
      }
    }
  };

  // Editar ocorrência
  const handleEdit = (ocorrencia) => {
    navigate("/editar-ocorrencia", { state: { ocorrencia } });
  };

  // Seleção
  const toggleOccurrenceSelection = (id) => {
    setSelectedOccurrences((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOccurrences.length === ocorrenciasFiltradas.length) {
      setSelectedOccurrences([]);
    } else {
      setSelectedOccurrences(ocorrenciasFiltradas.map((occ) => occ.id));
    }
  };

  const handleExportCSV = async () => {
    const selectedData =
      selectedOccurrences.length > 0
        ? ocorrenciasFiltradas.filter((occ) => selectedOccurrences.includes(occ.id))
        : ocorrenciasFiltradas;

    if (selectedData.length === 0) {
      alert("Não há ocorrências para exportar");
      return;
    }

    try {
      exportToCSV(selectedData);
      setExportModalVisible(false);
      setSelectedOccurrences([]);
      alert(`${selectedData.length} ocorrência(s) exportada(s) com sucesso em CSV!`);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      alert("Falha ao exportar CSV. Tente novamente.");
    }
  };

  const handleExportPDF = async () => {
    const selectedData =
      selectedOccurrences.length > 0
        ? ocorrenciasFiltradas.filter((occ) => selectedOccurrences.includes(occ.id))
        : ocorrenciasFiltradas;

    if (selectedData.length === 0) {
      alert("Não há ocorrências para exportar");
      return;
    }

    try {
      exportToPDF(selectedData);
      setExportModalVisible(false);
      setSelectedOccurrences([]);
      
      setTimeout(() => {
        alert(
          `Gerando PDF com ${selectedData.length} ocorrência(s)...\n\n` +
          `Uma janela de impressão será aberta.\n` +
          `Para salvar como PDF:\n` +
          `• Selecione "Salvar como PDF" no destino\n` +
          `• Clique em "Salvar"`
        );
      }, 300);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      alert("Falha ao exportar PDF. Tente novamente.");
    }
  };

  // Funções auxiliares
  const getStatusColor = (status) => {
    if (!status) return null;

    const statusNormalizado = status
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    switch (statusNormalizado) {
      case "atendida":
      case "atendidas":
        return "#4CAF50";
      case "nao atendida":
      case "não atendida":
      case "nao atendidas":
      case "não atendidas":
        return "#F44336";
      case "cancelada":
        return "#757575";
      case "sem atuacao":
      case "sem atuação":
        return "#FF9800";
      default:
        return null;
    }
  };

  const formatarDataHora = (dataHoraString) => {
    if (!dataHoraString) return "Data não informada";
    try {
      const data = new Date(dataHoraString);
      return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  const extrairHora = (dataHoraString) => {
    if (!dataHoraString) return "";
    try {
      const data = new Date(dataHoraString);
      return data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };

  const getStatusText = (ocorrencia) => {
    const status = ocorrencia.status || ocorrencia.situacao || "";

    const statusNormalizado = status
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const statusPermitidos = [
      "atendida",
      "atendidas",
      "nao atendida",
      "nao atendidas",
      "cancelada",
      "sem atuacao",
    ];

    if (statusPermitidos.includes(statusNormalizado)) {
      return status;
    }

    return null;
  };

  const getTipoOcorrencia = (ocorrencia) => {
    if (ocorrencia.tipo) return ocorrencia.tipo;
    if (ocorrencia.natureza) return ocorrencia.natureza;
    if (ocorrencia.grupoOcorrencia) return ocorrencia.grupoOcorrencia;
    return "Ocorrência";
  };

  const getLocalOcorrencia = (ocorrencia) => {
    if (ocorrencia.localizacao) return ocorrencia.localizacao;
    if (ocorrencia.logradouro) {
      return `${ocorrencia.tipoLogradouro || ""} ${ocorrencia.logradouro}${
        ocorrencia.numero ? `, ${ocorrencia.numero}` : ""
      }`.trim();
    }
    if (ocorrencia.bairro) return ocorrencia.bairro;
    if (ocorrencia.municipio) return ocorrencia.municipio;
    return "Local não informado";
  };

  if (loading) {
    return (
      <div className="listar-container">
        <Header title="Listar Ocorrências" />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando ocorrências...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="listar-container">
      <Header title="Listar Ocorrências" />

      {/* Header de seleção */}
      {selectedOccurrences.length > 0 && (
        <div className="selection-header">
          <p className="selection-text">
            {selectedOccurrences.length} ocorrência(s) selecionada(s)
          </p>
          <div className="selection-actions">
            <button onClick={toggleSelectAll} className="selection-button">
              {selectedOccurrences.length === ocorrenciasFiltradas.length
                ? "Desmarcar todas"
                : "Selecionar todas"}
            </button>
            <button
              onClick={() => setSelectedOccurrences([])}
              className="selection-button cancel"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="content">
        {/* Placeholder Section */}
        <div className="placeholder-section">
          <List size={80} color="#bc010c" />
          <h1 className="placeholder-title">Ocorrências</h1>
          <p className="placeholder-text">
            Lista de todas as ocorrências registradas no sistema
          </p>
          <p className="contador">
            {ocorrenciasFiltradas.length} de {ocorrencias.length} ocorrências
            {selectedOccurrences.length > 0 &&
              ` • ${selectedOccurrences.length} selecionadas`}
          </p>

          {selectedOccurrences.length === 0 && (
            <p className="export-hint">
              Clique no checkbox para selecionar ocorrências para exportação
            </p>
          )}
        </div>

        {/* Botão de Filtros */}
        <button
          className="filtros-toggle-button"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <Filter size={20} />
          <span>Filtros Avançados</span>
          {mostrarFiltros ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          {hasFiltrosAtivos && <span className="filtros-badge">●</span>}
        </button>

        {/* Painel de Filtros Avançados */}
        {mostrarFiltros && (
          <div className="filtros-panel">
            <div className="filtros-header">
              <h3>Filtrar Ocorrências</h3>
              {hasFiltrosAtivos && (
                <button className="limpar-filtros-button" onClick={limparFiltros}>
                  <X size={16} />
                  <span>Limpar Filtros</span>
                </button>
              )}
            </div>

            <div className="filtros-grid">
              {/* Filtro por Data */}
              <div className="filtro-group">
                <label className="filtro-label">
                  <Calendar size={16} />
                  <span>Data</span>
                </label>
                <input
                  type="date"
                  className="filtro-input-field"
                  value={filtros.data}
                  onChange={(e) => updateFiltro("data", e.target.value)}
                />
              </div>

              {/* Filtro por Situação */}
              <div className="filtro-group">
                <label className="filtro-label">
                  <Info size={16} />
                  <span>Situação</span>
                </label>
                <select
                  className="filtro-select"
                  value={filtros.situacao}
                  onChange={(e) => updateFiltro("situacao", e.target.value)}
                >
                  <option value="">Todas</option>
                  {SITUACOES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Natureza */}
              <div className="filtro-group">
                <label className="filtro-label">
                  <List size={16} />
                  <span>Natureza</span>
                </label>
                <select
                  className="filtro-select"
                  value={filtros.natureza}
                  onChange={(e) => updateFiltro("natureza", e.target.value)}
                >
                  <option value="">Todas</option>
                  {NATUREZAS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Região */}
              <div className="filtro-group">
                <label className="filtro-label">
                  <MapPin size={16} />
                  <span>Região</span>
                </label>
                <select
                  className="filtro-select"
                  value={filtros.regiao}
                  onChange={(e) => updateFiltro("regiao", e.target.value)}
                >
                  <option value="">Todas</option>
                  {REGIOES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Grupamento */}
              <div className="filtro-group">
                <label className="filtro-label">
                  <LayoutDashboard size={16} />
                  <span>Grupamento</span>
                </label>
                <select
                  className="filtro-select"
                  value={filtros.grupamento}
                  onChange={(e) => updateFiltro("grupamento", e.target.value)}
                >
                  <option value="">Todos</option>
                  {GRUPAMENTOS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Usuário */}
              <div className="filtro-group">
                <label className="filtro-label">
                  <User size={16} />
                  <span>Registrado por</span>
                </label>
                <select
                  className="filtro-select"
                  value={filtros.usuario}
                  onChange={(e) => updateFiltro("usuario", e.target.value)}
                >
                  <option value="">Todos</option>
                  {usuariosUnicos.map((usuario) => (
                    <option key={usuario} value={usuario}>
                      {usuario}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div className="action-buttons">
          <button className="dashboard-button" onClick={handleDashboard}>
            <LayoutDashboard size={20} />
            <span>Ver Dashboard</span>
          </button>

          <button
            className="export-button"
            onClick={() => setExportModalVisible(true)}
          >
            <FileDown size={20} />
            <span>Exportar</span>
          </button>
        </div>

        {/* Lista de ocorrências */}
        {ocorrenciasFiltradas.length === 0 ? (
          <div className="sem-resultados">
            <SearchX size={60} color="#ccc" />
            <p className="sem-resultados-text">
              {hasFiltrosAtivos
                ? "Nenhuma ocorrência encontrada com os filtros aplicados"
                : ocorrencias.length === 0
                ? "Nenhuma ocorrência registrada"
                : "Nenhuma ocorrência encontrada"}
            </p>
            {ocorrencias.length === 0 && (
              <button
                className="nova-ocorrencia-button"
                onClick={handleNovaOcorrencia}
              >
                Registrar Primeira Ocorrência
              </button>
            )}
          </div>
        ) : (
          ocorrenciasFiltradas.map((ocorrencia) => {
            const isSelected = selectedOccurrences.includes(ocorrencia.id);
            const statusText = getStatusText(ocorrencia);
            const statusColor = getStatusColor(statusText);

            return (
              <div
                key={ocorrencia.id}
                className={`ocorrencia-card ${isSelected ? "selected" : ""}`}
                onClick={() => handleVerDetalhes(ocorrencia)}
              >
                {/* Checkbox de seleção */}
                <div className="selection-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleOccurrenceSelection(ocorrencia.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="ocorrencia-content">
                  {/* Header */}
                  <div className="ocorrencia-header">
                    <div className="ocorrencia-title-section">
                      <h3 className="ocorrencia-tipo">
                        {getTipoOcorrencia(ocorrencia)}
                      </h3>
                      {ocorrencia.criadoPor && (
                        <p className="ocorrencia-usuario-header">
                          Por: <strong>{ocorrencia.criadoPor}</strong>
                        </p>
                      )}
                    </div>

                    {statusText && statusColor && (
                      <span
                        className="status-badge"
                        style={{ backgroundColor: statusColor }}
                      >
                        {statusText}
                      </span>
                    )}
                  </div>

                  {ocorrencia.descricao && (
                    <p className="ocorrencia-descricao">
                      {ocorrencia.descricao}
                    </p>
                  )}

                  <div className="ocorrencia-info">
                    <MapPin size={16} />
                    <span>{getLocalOcorrencia(ocorrencia)}</span>
                  </div>

                  <div className="ocorrencia-info">
                    <Clock size={16} />
                    <span>
                      {extrairHora(
                        ocorrencia.dataHora || ocorrencia.dataCriacao
                      )}
                    </span>
                  </div>

                  {(ocorrencia.regiao ||
                    ocorrencia.numeroAviso ||
                    ocorrencia.grupamento) && (
                    <div className="ocorrencia-info">
                      <Info size={16} />
                      <span className="ocorrencia-detalhes">
                        {[
                          ocorrencia.regiao,
                          ocorrencia.numeroAviso,
                          ocorrencia.grupamento,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    </div>
                  )}

                  <div className="ocorrencia-info">
                    <CalendarDays size={16} />
                    <span className="ocorrencia-data">
                      {formatarDataHora(
                        ocorrencia.dataHora || ocorrencia.dataCriacao
                      )}
                    </span>
                  </div>

                  {/* Botões Admin */}
                  {isAdmin() && (
                    <div className="admin-actions">
                      <button
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(ocorrencia);
                        }}
                      >
                        <Edit size={18} />
                        <span>Editar</span>
                      </button>

                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ocorrencia);
                        }}
                      >
                        <Trash2 size={18} />
                        <span>Excluir</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Exportação */}
      {exportModalVisible && (
        <div className="modal-overlay" onClick={() => setExportModalVisible(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Exportar Ocorrências</h2>
            <p className="modal-subtitle">
              {selectedOccurrences.length > 0
                ? `Exportar ${selectedOccurrences.length} ocorrência(s) selecionada(s)`
                : "Exportar todas as ocorrências visíveis"}
            </p>
            <p className="modal-info">
              A exportação incluirá TODOS os dados detalhados das ocorrências
            </p>

            <div className="modal-buttons">
              <button className="modal-button csv-button" onClick={handleExportCSV}>
                <Table size={24} />
                <span>Exportar CSV</span>
              </button>

              <button className="modal-button pdf-button" onClick={handleExportPDF}>
                <FileText size={24} />
                <span>Exportar PDF</span>
              </button>
            </div>

            <button
              className="cancel-button"
              onClick={() => setExportModalVisible(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}