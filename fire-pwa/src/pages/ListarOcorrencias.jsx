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
} from "lucide-react";
import Header from "../components/Header";
import { useOcorrenciasContext } from "../contexts/OcorrenciasContext";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/ListarOcorrencias.css";

export default function ListarOcorrencias() {
  useScrollToTop();
  const navigate = useNavigate();
  const { ocorrencias, loading, removerOcorrencia } = useOcorrenciasContext();
  const { isAdmin } = useContext(AuthContext);

  const [dataFiltro, setDataFiltro] = useState("");
  const [selectedOccurrences, setSelectedOccurrences] = useState([]);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  const ocorrenciasFiltradas = ocorrencias.filter((ocorrencia) => {
    if (!dataFiltro) return true;
    if (ocorrencia.dataHora) {
      return ocorrencia.dataHora.startsWith(dataFiltro);
    }
    if (ocorrencia.dataCriacao) {
      return ocorrencia.dataCriacao.startsWith(dataFiltro);
    }
    return false;
  });

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
    
    // Mensagem informativa
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

        {/* Filtro por data */}
        <div className="filtro-container">
          <Calendar size={20} color="#bc010c" />
          <input
            type="text"
            className="filtro-input"
            placeholder="Filtrar por data (AAAA-MM-DD)"
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
          />
          {dataFiltro && (
            <button
              onClick={() => setDataFiltro("")}
              className="limpar-filtro"
            >
              <X size={20} />
            </button>
          )}
        </div>

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
              {dataFiltro
                ? `Nenhuma ocorrência encontrada para ${dataFiltro}`
                : "Nenhuma ocorrência registrada"}
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
                    <h3 className="ocorrencia-tipo">
                      {getTipoOcorrencia(ocorrencia)}
                    </h3>

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