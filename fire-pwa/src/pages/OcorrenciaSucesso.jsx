import { useNavigate } from 'react-router-dom';
import '../styles/OcorrenciaSucesso.css';

function OcorrenciaSucesso() {
  const navigate = useNavigate();

  const handleInicio = () => {
    navigate('/home');
  };

  const handleListarOcorrencias = () => {
    navigate('/lista-ocorrencias');
  };

  const handleNovaOcorrencia = () => {
    navigate('/criar-ocorrencia');
  };

  const handleExportarPDF = () => {
    // Lógica para exportar PDF
    alert('PDF Exportado - Ocorrência exportada em PDF com sucesso!');
    // Aqui você pode implementar a lógica real de exportação de PDF
  };

  return (
    <div className="ocorrencia-sucesso-container">
      <div className="ocorrencia-sucesso-content">
        {/* Ícone de sucesso */}
        <div className="success-icon">
          <span className="checkmark">✓</span>
        </div>

        {/* Mensagem de sucesso */}
        <h1 className="success-title">
          Ocorrência Registrada com Sucesso!
        </h1>
        <p className="success-message">
          A ocorrência foi salva no sistema e está disponível para consulta.
        </p>

        {/* Botões de ação */}
        <div className="button-container">
          <button
            className="btn btn-primary"
            onClick={handleInicio}
          >
            Início
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleListarOcorrencias}
          >
            Listar Ocorrências
          </button>

          <button
            className="btn btn-accent"
            onClick={handleNovaOcorrencia}
          >
            Registrar Nova Ocorrência
          </button>

          <button
            className="btn btn-pdf"
            onClick={handleExportarPDF}
          >
            Exportar Ocorrência em PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default OcorrenciaSucesso;