import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OcorrenciaSucesso.css";

const OcorrenciaSucesso = () => {
  const navigate = useNavigate();

  const handleInicio = () => {
    navigate("/home");
  };

  const handleListarOcorrencias = () => {
    navigate("/listar-ocorrencias");
  };

  const handleNovaOcorrencia = () => {
    navigate("/nova-ocorrencia");
  };

  const handleExportarPDF = () => {
    alert("PDF Exportado\nOcorrência exportada em PDF com sucesso!");
  };

  return (
    <div className="container">
      <div className="scrollContent">
        <div className="content">
          {/* Ícone de sucesso */}
          <div className="successIcon">
            <span className="checkmark">✓</span>
          </div>

          {/* Mensagem de sucesso */}
          <h1 className="successTitle">
            Ocorrência Registrada com Sucesso!
          </h1>
          <p className="successMessage">
            A ocorrência foi salva no sistema e está disponível para consulta.
          </p>

          {/* Botões de ação */}
          <div className="buttonContainer">
            <button
              className="button primaryButton"
              onClick={handleInicio}
            >
              Início
            </button>

            <button
              className="button secondaryButton"
              onClick={handleListarOcorrencias}
            >
              Listar Ocorrências
            </button>

            <button
              className="button accentButton"
              onClick={handleNovaOcorrencia}
            >
              Registrar Nova Ocorrência
            </button>

            <button
              className="button pdfButton"
              onClick={handleExportarPDF}
            >
              Exportar Ocorrência em PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OcorrenciaSucesso;