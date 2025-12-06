// src/pages/Dashboard.jsx
import React, { useState, useMemo } from "react";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RefreshCw, Clock } from "lucide-react";
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
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-scroll">
        {/* Header do Dashboard */}
        <div className="dashboard-header">
          <div className="header-row">
            <h1 className="dashboard-title">Dashboard Operacional</h1>
            <button
              onClick={recarregarDados}
              className="sync-button"
              disabled={refreshing}
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={turnoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {turnoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
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