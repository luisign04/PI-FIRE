import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOcorrenciasContext } from '../contexts/OcorrenciasContext';

export default function DetalhesOcorrencia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ocorrencias } = useOcorrenciasContext();

  // Encontra a ocorrência pelo ID
  const ocorrencia = ocorrencias.find(oc => oc.id === id);

  // Se não encontrar, redireciona
  React.useEffect(() => {
    if (!ocorrencia) {
      navigate('/listar-ocorrencias');
    }
  }, [ocorrencia, navigate]);

  if (!ocorrencia) {
    return <div>Carregando...</div>;
  }

  // Função para obter a cor do status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'finalizada':
        return '#4CAF50';
      case 'registrada':
        return '#2196F3';
      case 'não atendida':
      case 'sem atuação':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  // Função para formatar data/hora
  const formatarDataHora = (dataHoraString) => {
    if (!dataHoraString) return 'Não informado';

    try {
      const data = new Date(dataHoraString);
      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para obter texto do status
  const getStatusText = (ocorrencia) => {
    if (ocorrencia.status) return ocorrencia.status;
    if (ocorrencia.situacao) return ocorrencia.situacao;
    return 'Registrada';
  };

  // Função para formatar valores booleanos
  const formatarBooleano = (valor) => {
    return valor ? 'SIM' : 'NÃO';
  };

  // Função para verificar se deve mostrar informações de não atendimento
  const mostrarMotivoNaoAtendimento = () => {
    return (
      ocorrencia.situacao === 'Não Atendida' ||
      ocorrencia.situacao === 'Sem Atuação'
    );
  };

  // Componente para renderizar uma linha de informação
  const InfoRow = ({ label, value, condition = true }) => {
    if (!condition || !value) return null;
    return (
      <div className="info-row">
        <span className="info-label">{label}:</span>
        <span className="info-value">{value}</span>
      </div>
    );
  };

  // Função para renderizar as fotos
  const renderFotos = () => {
    let fotosArray = [];

    if (ocorrencia.fotos && Array.isArray(ocorrencia.fotos)) {
      fotosArray = ocorrencia.fotos;
    } else if (ocorrencia.foto) {
      fotosArray = [ocorrencia.foto.uri || ocorrencia.foto];
    }

    if (fotosArray.length === 0) {
      return (
        <div className="no-photos-container">
          <span className="material-icons">photo_camera</span>
          <p className="no-photos-text">
            Não há registro fotográfico desta ocorrência
          </p>
        </div>
      );
    }

    return (
      <div className="photos-scroll">
        <div className="photos-container">
          {fotosArray.map((foto, index) => (
            <img
              key={index}
              src={typeof foto === 'string' ? foto : foto.uri || foto}
              alt={`Foto ${index + 1}`}
              className="photo"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="detalhes-container">
      {/* Botão voltar */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <span className="material-icons">arrow_back</span>
        Voltar
      </button>

      <div className="content">
        <div className="card">
          {/* Seção: Dados Internos */}
          <div className="section">
            <div className="section-header">
              <span className="material-icons">business</span>
              <h2 className="section-title">Dados Internos</h2>
            </div>

            <InfoRow label="Data e Hora" value={formatarDataHora(ocorrencia.dataHora)} />
            <InfoRow label="Número do Aviso" value={ocorrencia.numeroAviso} />
            <InfoRow label="Diretoria" value={ocorrencia.diretoria} />
            <InfoRow label="Grupamento" value={ocorrencia.grupamento} />
            <InfoRow label="Ponto Base" value={ocorrencia.pontoBase} />
          </div>

          {/* Seção: Ocorrência */}
          <div className="section">
            <div className="section-header">
              <span className="material-icons">warning</span>
              <h2 className="section-title">Ocorrência</h2>
            </div>

            <InfoRow label="Natureza" value={ocorrencia.natureza} />
            <InfoRow label="Grupo da Ocorrência" value={ocorrencia.grupoOcorrencia} />
            <InfoRow label="Subgrupo da Ocorrência" value={ocorrencia.subgrupoOcorrencia} />
            <InfoRow label="Situação" value={ocorrencia.situacao} />
            <InfoRow label="Hora Saída Quartel" value={ocorrencia.horaSaidaQuartel} />
            <InfoRow label="Hora Chegada Local" value={ocorrencia.horaLocal} />
            <InfoRow label="Hora Saída Local" value={ocorrencia.horaSaidaLocal} />

            {mostrarMotivoNaoAtendimento() && (
              <>
                <InfoRow label="Motivo Não Atendimento" value={ocorrencia.motivoNaoAtendida} />
                <InfoRow 
                  label="Outro Motivo" 
                  value={ocorrencia.motivoOutro}
                  condition={ocorrencia.motivoNaoAtendida === 'Outro'}
                />
              </>
            )}

            <InfoRow label="Vítima Socorrida pelo SAMU" value={formatarBooleano(ocorrencia.vitimaSamu)} />
          </div>

          {/* Seção: Informações da Vítima */}
          <div className="section">
            <div className="section-header">
              <span className="material-icons">person</span>
              <h2 className="section-title">Informações da Vítima</h2>
            </div>

            <InfoRow label="Vítima Envolvida" value={formatarBooleano(ocorrencia.envolvida)} />
            <InfoRow label="Sexo" value={ocorrencia.sexo} />
            <InfoRow label="Idade" value={ocorrencia.idade} />
            <InfoRow label="Classificação" value={ocorrencia.classificacao} />
            <InfoRow label="Destino" value={ocorrencia.destino} />
          </div>

          {/* Seção: Viatura e Acionamento */}
          <div className="section">
            <div className="section-header">
              <span className="material-icons">directions_car</span>
              <h2 className="section-title">Viatura e Acionamento</h2>
            </div>

            <InfoRow label="Viatura Empregada" value={ocorrencia.viatura} />
            <InfoRow label="Número da Viatura" value={ocorrencia.numeroViatura} />
            <InfoRow label="Forma de Acionamento" value={ocorrencia.acionamento} />
            <InfoRow label="Local do Acionamento" value={ocorrencia.localAcionamento} />
          </div>

          {/* Seção: Endereço */}
          <div className="section">
            <div className="section-header">
              <span className="material-icons">place</span>
              <h2 className="section-title">Endereço da Ocorrência</h2>
            </div>

            <InfoRow label="Município" value={ocorrencia.municipio} />
            <InfoRow label="Região" value={ocorrencia.regiao} />
            <InfoRow label="Bairro" value={ocorrencia.bairro} />
            <InfoRow label="Tipo de Logradouro" value={ocorrencia.tipoLogradouro} />
            <InfoRow label="AIS" value={ocorrencia.ais} />
            <InfoRow label="Logradouro" value={ocorrencia.logradouro} />
            <InfoRow label="Latitude" value={ocorrencia.latitude} />
            <InfoRow label="Longitude" value={ocorrencia.longitude} />
          </div>

          {/* Seção: Registro Fotográfico */}
          <div className="section">
            <div className="section-header">
              <span className="material-icons">photo_camera</span>
              <h2 className="section-title">Registro Fotográfico</h2>
            </div>

            {renderFotos()}
          </div>

          {/* Seção: Informações do Sistema */}
          <div className="section">
            <div className="section-header">
              <span className="material-icons">info</span>
              <h2 className="section-title">Informações do Sistema</h2>
            </div>

            <div className="info-row">
              <span className="info-label">Status:</span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(getStatusText(ocorrencia)) }}
              >
                {getStatusText(ocorrencia)}
              </span>
            </div>

            <InfoRow label="ID" value={ocorrencia.id} />
            <InfoRow label="Data de Registro" value={formatarDataHora(ocorrencia.dataRegistro)} />
          </div>
        </div>
      </div>

      <style jsx>{`
        .detalhes-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 20px 40px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #bc010c;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background-color: #9a0109;
          transform: translateX(-4px);
        }

        .back-button .material-icons {
          font-size: 20px;
        }

        .content {
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0 20px;
        }

        .card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 0;
        }

        .section {
          padding: 24px;
          border-bottom: 1px solid #e0e0e0;
          border-right: 1px solid #e0e0e0;
        }

        .section:last-child,
        .section:nth-last-child(-n+2) {
          border-bottom: none;
        }

        .section:nth-child(even) {
          border-right: none;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .section-header .material-icons {
          color: #bc010c;
          font-size: 24px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 14px;
          font-weight: 600;
          color: #666;
          flex: 0 0 40%;
        }

        .info-value {
          font-size: 14px;
          color: #333;
          text-align: right;
          flex: 1;
          word-wrap: break-word;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          color: white;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .photos-scroll {
          overflow-x: auto;
          margin-top: 16px;
        }

        .photos-container {
          display: flex;
          gap: 16px;
        }

        .photo {
          width: 400px;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .no-photos-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background-color: #f9f9f9;
          border-radius: 8px;
          margin-top: 16px;
        }

        .no-photos-container .material-icons {
          font-size: 48px;
          color: #ccc;
          margin-bottom: 12px;
        }

        .no-photos-text {
          font-size: 14px;
          color: #999;
          text-align: center;
          margin: 0;
        }

        /* Responsividade */
        @media (max-width: 1024px) {
          .card {
            grid-template-columns: 1fr;
          }

          .section {
            border-right: none;
          }

          .section:nth-last-child(-n+2) {
            border-bottom: 1px solid #e0e0e0;
          }

          .section:last-child {
            border-bottom: none;
          }
        }

        @media (max-width: 768px) {
          .detalhes-container {
            padding: 12px 16px;
          }

          .content {
            padding: 0 8px;
          }

          .section {
            padding: 16px;
          }

          .section-title {
            font-size: 18px;
          }

          .info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .info-label {
            flex: none;
          }

          .info-value {
            text-align: left;
          }

          .photo {
            width: 300px;
            height: 225px;
          }
        }
      `}</style>
    </div>
  );
}