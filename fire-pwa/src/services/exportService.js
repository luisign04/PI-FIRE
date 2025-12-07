// src/services/exportService.js - Versão Web

// Função auxiliar para obter informações formatadas conforme Detalhes da Ocorrência
const getOcorrenciaInfo = (ocorrencia) => {
  // Formatar data e hora
  const formatarDataHora = (dataHoraString) => {
    if (!dataHoraString) return "Não informado";
    try {
      const data = new Date(dataHoraString);
      if (isNaN(data.getTime())) {
        return "Não informado";
      }
      return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch (error) {
      return "Não informado";
    }
  };

  // Função para formatar hora (aceita tanto string quanto Date)
  const formatarHora = (hora) => {
    if (!hora) return "Não informado";
    
    // Se já for uma string no formato HH:MM:SS
    if (typeof hora === 'string' && hora.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
      return hora;
    }
    
    // Se for um objeto Date
    if (hora instanceof Date) {
      const hours = String(hora.getHours()).padStart(2, '0');
      const minutes = String(hora.getMinutes()).padStart(2, '0');
      const seconds = String(hora.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
    
    return "Não informado";
  };

  return {
    // Dados Internos
    dataHora: formatarDataHora(ocorrencia.dataHora || ocorrencia.data || ocorrencia.dataCriacao),
    numeroAviso: ocorrencia.numeroAviso || ocorrencia.numero || ocorrencia.aviso || "Não informado",
    diretoria: ocorrencia.diretoria || ocorrencia.diretoriaRegiao || "Não informado",
    grupamento: ocorrencia.grupamento || ocorrencia.unidade || ocorrencia.equipe || "Não informado",
    pontoBase: ocorrencia.pontoBase || ocorrencia.base || "Não informado",

    // Ocorrência
    natureza: ocorrencia.natureza || ocorrencia.tipo || "Não informado",
    grupoOcorrencia: ocorrencia.grupoOcorrencia || ocorrencia.grupo || "Não informado",
    subgrupoOcorrencia: ocorrencia.subgrupoOcorrencia || ocorrencia.subgrupo || "Não informado",
    situacao: ocorrencia.situacao || ocorrencia.status || "Não informado",
    horaSaidaQuartel: formatarHora(ocorrencia.horaSaidaQuartel),
    horaChegadaLocal: formatarHora(ocorrencia.horaChegadaLocal || ocorrencia.horaLocal),
    horaSaidaLocal: formatarHora(ocorrencia.horaSaidaLocal),
    vitimaSocorridaSamu: ocorrencia.vitimaSocorridaSamu || ocorrencia.samu || ocorrencia.vitimaSamu ? "Sim" : "Não",

    // Informações da Vítima
    vitimaEnvolvida: ocorrencia.vitimaEnvolvida || ocorrencia.vitima || ocorrencia.envolvida ? "Sim" : "Não",
    sexo: ocorrencia.sexo || ocorrencia.genero || "Não informado",
    idade: ocorrencia.idade || "Não informado",
    classificacao: ocorrencia.classificacao || ocorrencia.tipoVitima || "Não informado",
    destino: ocorrencia.destino || ocorrencia.localDestino || "Não informado",

    // Viatura e Acionamento
    viaturaEmpregada: ocorrencia.viaturaEmpregada || ocorrencia.viatura || ocorrencia.veiculo || "Não informado",
    numeroViatura: ocorrencia.numeroViatura || ocorrencia.viaturaNumero || "Não informado",
    formaAcionamento: ocorrencia.formaAcionamento || ocorrencia.acionamento || ocorrencia.tipoAcionamento || "Não informado",
    localAcionamento: ocorrencia.localAcionamento || ocorrencia.origemAcionamento || "Não informado",

    // Endereço da Ocorrência
    municipio: ocorrencia.municipio || ocorrencia.cidade || "Não informado",
    regiao: ocorrencia.regiao || ocorrencia.zona || "Não informado",
    bairro: ocorrencia.bairro || "Não informado",
    tipoLogradouro: ocorrencia.tipoLogradouro || ocorrencia.tipoVia || "Não informado",
    ais: ocorrencia.ais || ocorrencia.area || "Não informado",
    logradouro: ocorrencia.logradouro || ocorrencia.endereco || ocorrencia.rua || "Não informado",
    numero: ocorrencia.numero || "Não informado",
    latitude: ocorrencia.latitude || ocorrencia.lat || "Não informado",
    longitude: ocorrencia.longitude || ocorrencia.lng || ocorrencia.lon || "Não informado",

    // Informações adicionais
    id: ocorrencia.id || ocorrencia._id || "N/A",
    descricao: ocorrencia.descricao || ocorrencia.observacao || "Sem descrição",
  };
};

// Serviço para exportar CSV
export const exportToCSV = (occurrences) => {
  try {
    // Cabeçalhos completos do CSV
    const headers = 'ID,DataHora,Numero Aviso,Diretoria,Grupamento,Ponto Base,Natureza,Grupo Ocorrencia,Subgrupo Ocorrencia,Situacao,Hora Saida Quartel,Hora Chegada Local,Hora Saida Local,Vitima Socorrida Samu,Vitima Envolvida,Sexo,Idade,Classificacao,Destino,Viatura Empregada,Numero Viatura,Forma Acionamento,Local Acionamento,Municipio,Regiao,Bairro,Tipo Logradouro,AIS,Logradouro,Numero,Latitude,Longitude,Descricao\n';
    
    // Dados completos das ocorrências
    const rows = occurrences.map(occ => {
      const info = getOcorrenciaInfo(occ);
      // Escapar aspas duplas e quebras de linha na descrição
      const descricaoLimpa = info.descricao.replace(/"/g, '""').replace(/\n/g, ' ');
      return `"${info.id}","${info.dataHora}","${info.numeroAviso}","${info.diretoria}","${info.grupamento}","${info.pontoBase}","${info.natureza}","${info.grupoOcorrencia}","${info.subgrupoOcorrencia}","${info.situacao}","${info.horaSaidaQuartel}","${info.horaChegadaLocal}","${info.horaSaidaLocal}","${info.vitimaSocorridaSamu}","${info.vitimaEnvolvida}","${info.sexo}","${info.idade}","${info.classificacao}","${info.destino}","${info.viaturaEmpregada}","${info.numeroViatura}","${info.formaAcionamento}","${info.localAcionamento}","${info.municipio}","${info.regiao}","${info.bairro}","${info.tipoLogradouro}","${info.ais}","${info.logradouro}","${info.numero}","${info.latitude}","${info.longitude}","${descricaoLimpa}"`;
    }).join('\n');
    
    const csvContent = '\uFEFF' + headers + rows; // BOM para UTF-8
    
    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ocorrencias_bombeiros_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    throw error;
  }
};

// Serviço para exportar PDF
export const exportToPDF = (occurrences) => {
  try {
    // HTML para o PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Relatório de Ocorrências - Corpo de Bombeiros</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 15px; 
              line-height: 1.4;
              color: #000;
              font-size: 10px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 15px;
              border-bottom: 2px solid #bc010c;
              padding-bottom: 8px;
            }
            .header h1 { 
              color: #bc010c; 
              margin: 0;
              font-size: 18px;
              font-weight: bold;
            }
            .header .subtitle {
              color: #333;
              font-size: 10px;
              margin-top: 4px;
            }
            .occurrence { 
              margin: 15px 0;
              page-break-inside: avoid;
              border: 1px solid #ddd;
            }
            .occurrence-header {
              background-color: #bc010c;
              color: white;
              padding: 8px 10px;
              font-weight: bold;
              font-size: 12px;
            }
            .section {
              margin: 0;
              border-bottom: 1px solid #eee;
            }
            .section:last-child {
              border-bottom: none;
            }
            .section-title {
              background-color: #f5f5f5;
              padding: 6px 10px;
              font-weight: bold;
              border-bottom: 1px solid #ddd;
              font-size: 10px;
              color: #bc010c;
            }
            .section-content {
              padding: 8px 10px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px;
            }
            .info-item {
              margin: 3px 0;
              display: flex;
              align-items: baseline;
            }
            .info-label {
              font-weight: bold;
              color: #555;
              font-size: 9px;
              min-width: 130px;
            }
            .info-value {
              color: #000;
              font-size: 9px;
              flex: 1;
            }
            .full-width {
              grid-column: 1 / -1;
            }
            .description-box {
              background-color: #fafafa;
              padding: 8px;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              margin: 4px 0;
              font-size: 9px;
              white-space: pre-line;
              line-height: 1.5;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 8px;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            @media print {
              body { margin: 10px; }
              .occurrence { 
                break-inside: avoid;
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RELATÓRIO DE OCORRÊNCIAS</h1>
            <h2 style="font-size: 14px; color: #bc010c; margin: 2px 0;">CORPO DE BOMBEIROS</h2>
            <div class="subtitle">
              Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} | 
              Total: ${occurrences.length} ocorrência(s)
            </div>
          </div>

          ${occurrences.map((occ, index) => {
            const info = getOcorrenciaInfo(occ);
            
            return `
              <div class="occurrence">
                <div class="occurrence-header">
                  OCORRÊNCIA #${index + 1} - ${info.natureza} - ID: ${info.id.slice(0, 8)}...
                </div>

                <!-- Dados Internos -->
                <div class="section">
                  <div class="section-title">DADOS INTERNOS</div>
                  <div class="section-content">
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Data e Hora:</div>
                        <div class="info-value">${info.dataHora}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Número do Aviso:</div>
                        <div class="info-value">${info.numeroAviso}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Diretoria:</div>
                        <div class="info-value">${info.diretoria}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Grupamento:</div>
                        <div class="info-value">${info.grupamento}</div>
                      </div>
                      <div class="info-item full-width">
                        <div class="info-label">Ponto Base:</div>
                        <div class="info-value">${info.pontoBase}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ocorrência -->
                <div class="section">
                  <div class="section-title">OCORRÊNCIA</div>
                  <div class="section-content">
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Natureza:</div>
                        <div class="info-value">${info.natureza}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Grupo da Ocorrência:</div>
                        <div class="info-value">${info.grupoOcorrencia}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Subgrupo:</div>
                        <div class="info-value">${info.subgrupoOcorrencia}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Situação:</div>
                        <div class="info-value">${info.situacao}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Hora Saída do Quartel:</div>
                        <div class="info-value">${info.horaSaidaQuartel}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Hora Chegada Local:</div>
                        <div class="info-value">${info.horaChegadaLocal}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Hora Saída Local:</div>
                        <div class="info-value">${info.horaSaidaLocal}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Vítima Socorrida SAMU:</div>
                        <div class="info-value">${info.vitimaSocorridaSamu}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Informações da Vítima -->
                <div class="section">
                  <div class="section-title">INFORMAÇÕES DA VÍTIMA</div>
                  <div class="section-content">
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Vítima Envolvida:</div>
                        <div class="info-value">${info.vitimaEnvolvida}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Sexo:</div>
                        <div class="info-value">${info.sexo}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Idade:</div>
                        <div class="info-value">${info.idade}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Classificação:</div>
                        <div class="info-value">${info.classificacao}</div>
                      </div>
                      <div class="info-item full-width">
                        <div class="info-label">Destino:</div>
                        <div class="info-value">${info.destino}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Viatura e Acionamento -->
                <div class="section">
                  <div class="section-title">VIATURA E ACIONAMENTO</div>
                  <div class="section-content">
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Viatura Empregada:</div>
                        <div class="info-value">${info.viaturaEmpregada}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Número da Viatura:</div>
                        <div class="info-value">${info.numeroViatura}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Forma de Acionamento:</div>
                        <div class="info-value">${info.formaAcionamento}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Local Acionamento:</div>
                        <div class="info-value">${info.localAcionamento}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Endereço da Ocorrência -->
                <div class="section">
                  <div class="section-title">ENDEREÇO DA OCORRÊNCIA</div>
                  <div class="section-content">
                    <div class="info-grid">
                      <div class="info-item">
                        <div class="info-label">Município:</div>
                        <div class="info-value">${info.municipio}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Região:</div>
                        <div class="info-value">${info.regiao}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Bairro:</div>
                        <div class="info-value">${info.bairro}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Tipo de Logradouro:</div>
                        <div class="info-value">${info.tipoLogradouro}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">AIS:</div>
                        <div class="info-value">${info.ais}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Número:</div>
                        <div class="info-value">${info.numero}</div>
                      </div>
                      <div class="info-item full-width">
                        <div class="info-label">Logradouro:</div>
                        <div class="info-value">${info.logradouro}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Latitude:</div>
                        <div class="info-value">${info.latitude}</div>
                      </div>
                      <div class="info-item">
                        <div class="info-label">Longitude:</div>
                        <div class="info-value">${info.longitude}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Descrição -->
                ${info.descricao !== "Sem descrição" ? `
                <div class="section">
                  <div class="section-title">DESCRIÇÃO</div>
                  <div class="section-content">
                    <div class="description-box">${info.descricao}</div>
                  </div>
                </div>
                ` : ''}
              </div>
            `;
          }).join('')}

          <div class="footer">
            Documento gerado automaticamente pelo Sistema de Ocorrências do Corpo de Bombeiros<br>
            Este documento contém informações detalhadas de ${occurrences.length} ocorrência(s)
          </div>
        </body>
      </html>
    `;
    
    // Abrir em nova janela para impressão/salvamento como PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Aguardar carregamento e acionar impressão
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
    
    return true;
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    throw error;
  }
};