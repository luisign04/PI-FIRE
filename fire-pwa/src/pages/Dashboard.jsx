
// src/pages/Dashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RefreshCw, Clock, Brain, Ambulance, AlertTriangle, TrendingUp } from "lucide-react";
import { useOcorrenciasContext } from "../contexts/OcorrenciasContext";
import Header from "../components/Header";
import useScrollToTop from "../hooks/useScrollToTop";
import "../styles/Dashboard.css";

const DashboardScreen = () => {
  useScrollToTop();
  const {
    ocorrencias,
    loading,
    recarregarOcorrencias,
  } = useOcorrenciasContext();

  const [lastSync, setLastSync] = useState(new Date().toISOString());
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados do ML
  const [mlApiStatus, setMlApiStatus] = useState('checking');
  const [mlPredicting, setMlPredicting] = useState(false);
  const [mlFeatureImportance, setMlFeatureImportance] = useState([]);
  const [mlValoresPossiveis, setMlValoresPossiveis] = useState(null);
  const [mlResultado, setMlResultado] = useState(null);
  const [showMLSection, setShowMLSection] = useState(false);
  
  const [mlFormData, setMlFormData] = useState({
    natureza: 'APH',
    regiao: 'RMR',
    turno: 1,
    complexidade: 5,
    idade: 30,
    sexo: 'Masculino'
  });

  const ML_API_URL = 'http://localhost:5000';

  // Verificar status da API ML ao carregar
  useEffect(() => {
    checkMLAPIStatus();
  }, []);

  const checkMLAPIStatus = async () => {
    try {
      const response = await fetch(`${ML_API_URL}/health`);
      if (response.ok) {
        setMlApiStatus('connected');
        loadMLValoresPossiveis();
        loadMLFeatureImportance();
      } else {
        setMlApiStatus('error');
      }
    } catch (error) {
      setMlApiStatus('disconnected');
    }
  };

  const loadMLValoresPossiveis = async () => {
    try {
      const response = await fetch(`${ML_API_URL}/valores-possiveis`);
      const data = await response.json();
      setMlValoresPossiveis(data);
    } catch (error) {
      console.error('Erro ao carregar valores possíveis:', error);
    }
  };

  const loadMLFeatureImportance = async () => {
    try {
      const response = await fetch(`${ML_API_URL}/feature-importance`);
      const data = await response.json();
      setMlFeatureImportance(data.importance);
    } catch (error) {
      console.error('Erro ao carregar importância das features:', error);
    }
  };

  const fazerPredicaoML = async () => {
    setMlPredicting(true);
    try {
      const response = await fetch(`${ML_API_URL}/predict/completo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlFormData)
      });
      
      const data = await response.json();
      setMlResultado(data);
    } catch (error) {
      console.error('Erro ao fazer predição:', error);
      alert('Erro ao conectar com a API ML. Certifique-se de que o servidor Python está rodando.');
    } finally {
      setMlPredicting(false);
    }
  };

  const getClassificacaoColor = (classificacao) => {
    const colors = {
      'Ferida grave': '#F44336',
      'Ferida leve': '#FFC107',
      'Óbito': '#424242',
      'Vítima ilesa': '#4CAF50'
    };
    return colors[classificacao] || '#9E9E9E';
  };

  const getClassificacaoIcon = (classificacao) => {
    const icons = {
      'Ferida grave': '🔴',
      'Ferida leve': '🟡',
      'Óbito': '⚫',
      'Vítima ilesa': '🟢'
    };
    return icons[classificacao] || '⚪';
  };

  // Função para atualizar dados
  const atualizarDados = async () => {
    setRefreshing(true);
    try {
      await recarregarOcorrencias();
      setLastSync(new Date().toISOString());
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Função para recarregar dados (botão refresh)
  const recarregarDados = async () => {
    try {
      await recarregarOcorrencias();
      setLastSync(new Date().toISOString());
    } catch (error) {
      console.error('Erro ao recarregar:', error);
    }
  };

  const processarDadosDashboard = () => {
    if (!ocorrencias || ocorrencias.length === 0) {
      return {
        totalOcorrencias: "0",
        emAndamento: "0",
        ocorrenciasAtendidas: "0",
        naoAtendidas: "0",
        semAtuacao: "0",
        canceladas: "0",
        tempoMedioResposta: "0min",
      };
    }

    const totalOcorrencias = ocorrencias.length;
    
    const atendidas = ocorrencias.filter(
      (oc) => oc.status === "Atendidas"
    ).length;
    
    const naoAtendidas = ocorrencias.filter(
      (oc) => oc.status === "Não Atendidas"
    ).length;
    
    const semAtuacao = ocorrencias.filter(
      (oc) => oc.status === "Sem Atuação"
    ).length;
    
    const canceladas = ocorrencias.filter(
      (oc) => oc.status === "Cancelada"
    ).length;

    const tempos = ocorrencias
      .filter((o) => o.tempoResposta)
      .map((o) => o.tempoResposta);
    const tempoMedio =
      tempos.length > 0
        ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length)
        : 0;

    return {
      totalOcorrencias: totalOcorrencias.toString(),
      emAndamento: semAtuacao.toString(),
      ocorrenciasAtendidas: atendidas.toString(),
      naoAtendidas: naoAtendidas.toString(),
      semAtuacao: semAtuacao.toString(),
      canceladas: canceladas.toString(),
      tempoMedioResposta: `${tempoMedio}min`,
    };
  };

  const processarDadosPizza = () => {
    if (!ocorrencias || ocorrencias.length === 0) {
      return [
        {
          name: "Sem dados",
          value: 1,
          color: "#9e9e9e",
        },
      ];
    }

    const tiposCount = {};
    ocorrencias.forEach((oc) => {
      const tipo = oc.tipo || oc.natureza || "Outros";
      tiposCount[tipo] = (tiposCount[tipo] || 0) + 1;
    });

    const total = ocorrencias.length;
    const cores = [
      "#1e88e5",
      "#43a047",
      "#fb8c00",
      "#8e24aa",
      "#3949ab",
      "#00897b",
      "#f4511e",
      "#6d4c41",
    ];

    return Object.entries(tiposCount).map(([name, value], index) => {
      const pct = ((value / total) * 100).toFixed(1);
      return {
        name: `${name} (${pct}%)`,
        value,
        color: cores[index % cores.length],
      };
    });
  };

  const processarDadosBarras = () => {
    const regioes = {};
    if (!ocorrencias || ocorrencias.length === 0) {
      return [{ name: "Sem dados", value: 1, color: "#9e9e9e" }];
    }

    ocorrencias.forEach((oc) => {
      const regiao = oc.regiao || oc.bairro || "Não informada";
      regioes[regiao] = (regioes[regiao] || 0) + 1;
    });

    const coresRegioes = [
      "#1e88e5",
      "#43a047",
      "#fb8c00",
      "#8e24aa",
      "#3949ab",
      "#00897b",
      "#f4511e",
      "#6d4c41",
      "#546e7a",
      "#5e35b1",
    ];

    return Object.entries(regioes).map(([name, value], index) => ({
      name: name.length > 10 ? name.substring(0, 8) + "..." : name,
      value,
      color: coresRegioes[index % coresRegioes.length],
    }));
  };

  const processarDadosDiasSemana = () => {
    if (!ocorrencias || ocorrencias.length === 0) {
      return [{ name: "Sem dados", value: 1, color: "#9e9e9e" }];
    }

    const dias = {
      Domingo: 0,
      Segunda: 0,
      Terça: 0,
      Quarta: 0,
      Quinta: 0,
      Sexta: 0,
      Sábado: 0,
    };

    ocorrencias.forEach((oc) => {
      if (!oc.dataHora) return;
      const date = new Date(oc.dataHora);
      const dia = date.getDay();
      const nomes = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];
      dias[nomes[dia]]++;
    });

    const coresDias = [
      "#1e88e5",
      "#43a047",
      "#fb8c00",
      "#8e24aa",
      "#3949ab",
      "#00897b",
      "#f4511e",
    ];

    return Object.keys(dias).map((name, index) => ({
      name,
      value: dias[name],
      color: coresDias[index],
    }));
  };

  const processarDadosTurnos = () => {
    if (!ocorrencias || ocorrencias.length === 0) {
      return [
        {
          name: "Sem dados",
          value: 1,
          color: "#9e9e9e",
        },
      ];
    }

    const turnos = { Manhã: 0, Tarde: 0, Noite: 0, Madrugada: 0 };

    ocorrencias.forEach((oc) => {
      if (!oc.dataHora) return;
      const hora = new Date(oc.dataHora).getHours();
      if (hora >= 6 && hora < 12) turnos.Manhã++;
      else if (hora >= 12 && hora < 18) turnos.Tarde++;
      else if (hora >= 18 && hora < 24) turnos.Noite++;
      else turnos.Madrugada++;
    });

    const total = Object.values(turnos).reduce((a, b) => a + b, 0);
    const cores = ["#1e88e5", "#43a047", "#fb8c00", "#8e24aa"];

    return Object.entries(turnos).map(([name, value], index) => {
      const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
      return {
        name: `${name} (${pct}%)`,
        value,
        color: cores[index],
      };
    });
  };

  const dashboardData = useMemo(() => processarDadosDashboard(), [ocorrencias]);
  const pieData = useMemo(() => processarDadosPizza(), [ocorrencias]);
  const barData = useMemo(() => processarDadosBarras(), [ocorrencias]);
  const turnoData = useMemo(() => processarDadosTurnos(), [ocorrencias]);
  const diasSemanaData = useMemo(() => processarDadosDiasSemana(), [ocorrencias]);

  const formatarData = (timestamp) => {
    if (!timestamp) return "Nunca";
    return new Date(timestamp).toLocaleString("pt-BR");
  };

  const pctAtendidas =
    ocorrencias?.length > 0
      ? Math.round(
          (parseInt(dashboardData.ocorrenciasAtendidas) /
            parseInt(dashboardData.totalOcorrencias)) *
            100
        )
      : 0;

  const pctNaoAtendidas = 100 - pctAtendidas;

  if (loading && !refreshing) {
    return (
      <div className="dashboard-container">
        <Header title="Dashboard" />
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header title="Dashboard" />
      <div className="dashboard-scroll">
        {/* Header do Dashboard */}
        <div className="dashboard-header">
          <div className="header-row">
            <h1 className="dashboard-title">Dashboard Operacional</h1>
            <button
              onClick={recarregarDados}
              className="sync-button"
              disabled={refreshing}
              title="Atualizar dados"
            >
              <RefreshCw className={refreshing ? "spinning" : ""} size={24} />
            </button>
          </div>

          <p className="dashboard-subtitle">
            {ocorrencias?.length || 0} ocorrências registradas
          </p>

          <div className="sync-info">
            <Clock size={12} />
            <span className="sync-text">
              Última sincronização: {formatarData(lastSync)}
            </span>
          </div>
        </div>

        {/* Visão Geral */}
        <div className="dashboard-section">
          <h2 className="section-title">Visão Geral</h2>

          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-value">{dashboardData.totalOcorrencias}</div>
              <div className="stat-label">Total de Ocorrências</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: "#fb8c00" }}>
                {dashboardData.semAtuacao}
              </div>
              <div className="stat-label">Sem Atuação</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: "#43a047" }}>
                {dashboardData.ocorrenciasAtendidas}
              </div>
              <div className="stat-label">Atendidas</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: "#e53935" }}>
                {dashboardData.naoAtendidas}
              </div>
              <div className="stat-label">Não Atendidas</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: "#9e9e9e" }}>
                {dashboardData.canceladas}
              </div>
              <div className="stat-label">Canceladas</div>
            </div>

            <div className="stat-item stat-item-full">
              <div className="stat-value">{dashboardData.tempoMedioResposta}</div>
              <div className="stat-label">Tempo Médio de Resposta</div>
            </div>
          </div>
        </div>

        {/* Taxa de Atendimento */}
        <div className="dashboard-section">
          <h2 className="section-title">Taxa de Atendimento</h2>

          <div className="row-percent">
            <div className="percent-box">
              <div className="percent-value" style={{ color: "#43a047" }}>
                {pctAtendidas}%
              </div>
              <div className="percent-label">Atendidas</div>
            </div>

            <div className="percent-box">
              <div className="percent-value" style={{ color: "#e53935" }}>
                {pctNaoAtendidas}%
              </div>
              <div className="percent-label">Não Atendidas</div>
            </div>
          </div>
        </div>

        {/* SEÇÃO ML - Machine Learning */}
        {mlApiStatus === 'connected' && (
          <div className="dashboard-section" style={{ backgroundColor: '#f0f4ff', padding: '24px', borderRadius: '8px', border: '2px solid #1976d2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Brain size={28} color="#1976d2" />
                <h2 className="section-title" style={{ margin: 0 }}>
                  Machine Learning - Predições XGBoost
                </h2>
              </div>
              <button
                onClick={() => setShowMLSection(!showMLSection)}
                style={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {showMLSection ? 'Ocultar' : 'Mostrar'} Predições
              </button>
            </div>

            {showMLSection && (
              <>
                {/* Formulário de Predição ML */}
                <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                    🔮 Simular Nova Ocorrência
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                        Natureza
                      </label>
                      <select
                        value={mlFormData.natureza}
                        onChange={(e) => setMlFormData({...mlFormData, natureza: e.target.value})}
                        style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '13px' }}
                      >
                        {mlValoresPossiveis?.naturezas.map(nat => (
                          <option key={nat} value={nat}>{nat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                        Região
                      </label>
                      <select
                        value={mlFormData.regiao}
                        onChange={(e) => setMlFormData({...mlFormData, regiao: e.target.value})}
                        style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '13px' }}
                      >
                        {mlValoresPossiveis?.regioes.map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                        Turno
                      </label>
                      <select
                        value={mlFormData.turno}
                        onChange={(e) => setMlFormData({...mlFormData, turno: parseInt(e.target.value)})}
                        style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '13px' }}
                      >
                        <option value={0}>Madrugada</option>
                        <option value={1}>Manhã</option>
                        <option value={2}>Tarde</option>
                        <option value={3}>Noite</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                        Complexidade (1-10)
                      </label>
                      <input
                        type="number"
                        value={mlFormData.complexidade}
                        onChange={(e) => setMlFormData({...mlFormData, complexidade: parseInt(e.target.value)})}
                        min="1"
                        max="10"
                        style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                        Idade da Vítima
                      </label>
                      <input
                        type="number"
                        value={mlFormData.idade}
                        onChange={(e) => setMlFormData({...mlFormData, idade: parseInt(e.target.value)})}
                        min="0"
                        max="120"
                        style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                        Sexo
                      </label>
                      <select
                        value={mlFormData.sexo}
                        onChange={(e) => setMlFormData({...mlFormData, sexo: e.target.value})}
                        style={{ width: '100%', padding: '8px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '13px' }}
                      >
                        {mlValoresPossiveis?.sexos.map(sex => (
                          <option key={sex} value={sex}>{sex}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={fazerPredicaoML}
                    disabled={mlPredicting}
                    style={{
                      width: '100%',
                      backgroundColor: mlPredicting ? '#9e9e9e' : '#1976d2',
                      color: 'white',
                      padding: '12px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '15px',
                      fontWeight: '500',
                      cursor: mlPredicting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {mlPredicting ? (
                      <>
                        <RefreshCw size={18} className="spinning" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <TrendingUp size={18} />
                        Fazer Predição com XGBoost
                      </>
                    )}
                  </button>
                </div>

                {/* Resultados ML */}
                {mlResultado && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    {/* Tempo de Resposta */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Clock size={20} color="#1976d2" />
                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Tempo de Resposta</h4>
                      </div>
                      <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#1976d2' }}>
                          {mlResultado.tempo_resposta_estimado}
                        </div>
                        <div style={{ fontSize: '14px', color: '#757575', marginTop: '6px' }}>minutos estimados</div>
                      </div>
                    </div>

                    {/* Necessidade SAMU */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Ambulance size={20} color="#f44336" />
                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Necessidade SAMU</h4>
                      </div>
                      <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ fontSize: '40px', fontWeight: 'bold', color: mlResultado.necessita_samu ? '#f44336' : '#4caf50' }}>
                          {mlResultado.necessita_samu ? 'SIM' : 'NÃO'}
                        </div>
                        <div style={{ fontSize: '14px', color: '#757575', marginTop: '6px' }}>
                          Probabilidade: {mlResultado.probabilidade_samu}%
                        </div>
                        <div style={{
                          marginTop: '12px',
                          padding: '8px',
                          backgroundColor: mlResultado.necessita_samu ? '#ffebee' : '#e8f5e9',
                          borderRadius: '4px',
                          fontSize: '13px',
                          color: mlResultado.necessita_samu ? '#c62828' : '#2e7d32',
                          fontWeight: '500'
                        }}>
                          {mlResultado.necessita_samu ? '🚨 Acionar SAMU' : '✓ SAMU não necessário'}
                        </div>
                      </div>
                    </div>

                    {/* Classificação */}
                    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <AlertTriangle size={20} color="#ff9800" />
                        <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Classificação</h4>
                      </div>
                      <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div 
                          style={{ 
                            display: 'inline-block',
                            padding: '12px 24px', 
                            borderRadius: '8px', 
                            backgroundColor: getClassificacaoColor(mlResultado.classificacao_prevista),
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginBottom: '6px'
                          }}
                        >
                          {getClassificacaoIcon(mlResultado.classificacao_prevista)} {mlResultado.classificacao_prevista}
                        </div>
                        <div style={{ fontSize: '13px', color: '#757575', marginTop: '10px' }}>
                          Classificação da vítima
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feature Importance */}
                {mlFeatureImportance.length > 0 && (
                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
                      📊 Importância dos Fatores
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={mlFeatureImportance} layout="vertical">
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="feature" width={100} />
                        <Tooltip formatter={(value) => value.toFixed(3)} />
                        <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                          {mlFeatureImportance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#1e88e5', '#43a047', '#fb8c00', '#8e24aa', '#3949ab'][index % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Análises */}
        <div className="dashboard-section">
          <h2 className="section-title">Análises</h2>
          {/* Ocorrências por Natureza */}
      <div className="chart-section">
        <h3 className="chart-title">Ocorrências por Natureza</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => entry.name}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Ocorrências por Região */}
      <div className="chart-section">
        <h3 className="chart-title">Ocorrências por Região</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1e88e5">
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ocorrências por Dia da Semana */}
      <div className="chart-section">
        <h3 className="chart-title">Ocorrências por dia da Semana</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={diasSemanaData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1e88e5">
              {diasSemanaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Ocorrências por Turno */}
      <div className="chart-section">
        <h3 className="chart-title">Ocorrências por Turno</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={turnoData}
              cx="50%"
              cy="40%"
              labelLine={false}
              label={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {turnoData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              verticalAlign="bottom" 
              height={60}
              wrapperStyle={{ paddingTop: '30px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Info Section */}
    <div className="info-section">
      <p className="info-text">
        Dados atualizados automaticamente. Clique no botão de atualizar para recarregar.
      </p>
    </div>
  </div>
</div>
);
};

export default DashboardScreen;