import { useState, useEffect } from 'react';
import Header from '../components/Header';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalOcorrencias: 0,
    emAndamento: 0,
    atendidas: 0,
    tempoMedio: '--'
  });

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setStats({
        totalOcorrencias: 127,
        emAndamento: 8,
        atendidas: 119,
        tempoMedio: '12 min'
      });
    }, 500);
  }, []);

  return (
    <div className="dashboard-page">
      <Header title="Dashboard Operacional" />

      <main className="dashboard-container">
        <section className="metric-cards-section">
          <h2>Visão Geral (Mês)</h2>
          
          <div className="metric-cards">
            <div className="card metric-card total-ocorrencias">
              <i className="fas fa-chart-bar card-icon"></i>
              <div className="card-content">
                <p className="metric-title">Total de Ocorrências</p>
                <p className="metric-value">{stats.totalOcorrencias || '--'}</p>
              </div>
            </div>

            <div className="card metric-card em-andamento">
              <i className="fas fa-hourglass-half card-icon"></i>
              <div className="card-content">
                <p className="metric-title">Em Andamento</p>
                <p className="metric-value">{stats.emAndamento || '--'}</p>
              </div>
            </div>

            <div className="card metric-card atendidas">
              <i className="fas fa-check-circle card-icon"></i>
              <div className="card-content">
                <p className="metric-title">Ocorrências Atendidas</p>
                <p className="metric-value">{stats.atendidas || '--'}</p>
              </div>
            </div>

            <div className="card metric-card tempo-resposta">
              <i className="fas fa-clock card-icon"></i>
              <div className="card-content">
                <p className="metric-title">Tempo Médio Resposta</p>
                <p className="metric-value">{stats.tempoMedio}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="analysis-section">
          <h2>Análise de Natureza</h2>

          <div className="charts-grid">
            <div className="card chart-card">
              <h3>Ocorrências por Natureza</h3>
              <div className="chart-placeholder">
                <p>Espaço para Gráfico de Pizza/Barra</p>
                <small>Integração com biblioteca de gráficos pendente</small>
              </div>
            </div>

            <div className="card chart-card">
              <h3>Ocorrências Semanais</h3>
              <div className="chart-placeholder">
                <p>Espaço para Gráfico de Linha</p>
                <small>Integração com biblioteca de gráficos pendente</small>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;