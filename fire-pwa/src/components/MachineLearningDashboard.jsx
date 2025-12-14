import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Brain, Clock, Ambulance, AlertTriangle, RefreshCw, TrendingUp, Activity, Calendar, MapPin } from 'lucide-react';

const MLDashboard = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [valoresPossiveis, setValoresPossiveis] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  
  const [formData, setFormData] = useState({
    natureza: 'APH',
    regiao: 'RMR',
    turno: 1,
    complexidade: 5,
    idade: 30,
    sexo: 'Masculino'
  });

  const API_URL = 'http://localhost:5000';
  const COLORS = ['#1976d2', '#43a047', '#fb8c00', '#e53935', '#8e24aa'];
  const NATUREZA_COLORS = {
    'APH': '#1976d2',
    'Incêndio': '#e53935',
    'Prevenção': '#43a047',
    'Produtos perigosos': '#fb8c00',
    'Resgate': '#8e24aa'
  };

  const scatterSeries = dashboardData?.scatter_tempo_complexidade
    ? Object.entries(
        dashboardData.scatter_tempo_complexidade.reduce((acc, item) => {
          if (!acc[item.natureza]) acc[item.natureza] = [];
          acc[item.natureza].push(item);
          return acc;
        }, {})
      ).map(([natureza, pontos]) => ({ natureza, pontos }))
    : [];

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setApiStatus('connected');
        loadValoresPossiveis();
        loadFeatureImportance();
        loadDashboardData();
        setLoading(false);
      } else {
        setApiStatus('error');
        setLoading(false);
      }
    } catch (error) {
      setApiStatus('disconnected');
      setLoading(false);
    }
  };

  const loadValoresPossiveis = async () => {
    try {
      const response = await fetch(`${API_URL}/valores-possiveis`);
      const data = await response.json();
      setValoresPossiveis(data);
    } catch (error) {
      console.error('Erro ao carregar valores possíveis:', error);
    }
  };

  const loadFeatureImportance = async () => {
    try {
      const response = await fetch(`${API_URL}/feature-importance`);
      const data = await response.json();
      const items = Array.isArray(data?.importance) ? data.importance : [];
      const sum = items.reduce((acc, cur) => acc + (cur.importance || 0), 0);
      // Se todos forem zero (dados homogêneos), mostrar pesos iguais para não sumir o gráfico
      if (items.length && sum === 0) {
        const equal = 1 / items.length;
        setFeatureImportance(items.map(i => ({ ...i, importance: equal })));
      } else {
        setFeatureImportance(items);
      }
    } catch (error) {
      console.error('Erro ao carregar importância das features:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/analytics/dashboard`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const fazerPredicao = async () => {
    setPredicting(true);
    try {
      const response = await fetch(`${API_URL}/predict/completo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      setResultado(data);
    } catch (error) {
      console.error('Erro ao fazer predição:', error);
      alert('Erro ao conectar com a API. Certifique-se de que o servidor Python está rodando.');
    } finally {
      setPredicting(false);
    }
  };

  const retreinarModelos = async () => {
    if (!confirm('Deseja retreinar os modelos de ML com os dados mais recentes do banco de dados?')) {
      return;
    }

    setRetraining(true);
    try {
      const response = await fetch(`${API_URL}/retrain`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Modelos retreinados com sucesso!');
        // Recarregar dados
        loadFeatureImportance();
        loadDashboardData();
      } else {
        alert('❌ Erro ao retreinar modelos: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao retreinar modelos:', error);
      alert('❌ Erro ao conectar com a API de ML.');
    } finally {
      setRetraining(false);
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

  const getTurnoLabel = (turno) => {
    const labels = {
      0: 'Madrugada',
      1: 'Manhã',
      2: 'Tarde',
      3: 'Noite'
    };
    return labels[turno] || 'Não informado';
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontWeight="bold" fontSize="14">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ animation: 'spin 1s linear infinite', width: '64px', height: '64px', border: '4px solid #e0e0e0', borderTop: '4px solid #1976d2', borderRadius: '50%', margin: '0 auto 16px' }}></div>
          <p style={{ color: '#757575', fontSize: '18px' }}>Conectando com servidor Python...</p>
        </div>
      </div>
    );
  }

  if (apiStatus === 'disconnected' || apiStatus === 'error') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '800px', width: '100%', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#ffebee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={32} color="#f44336" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#212121', marginBottom: '8px' }}>Servidor Python Não Encontrado</h2>
            <p style={{ color: '#757575', marginBottom: '24px' }}>
              Não foi possível conectar com a API. Siga os passos abaixo:
            </p>
            
            <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontWeight: '600', color: '#212121', marginBottom: '8px' }}>1. Instale as dependências:</h3>
                <code style={{ display: 'block', backgroundColor: '#263238', color: '#4caf50', padding: '12px', borderRadius: '4px', fontSize: '14px', overflowX: 'auto' }}>
                  pip install flask flask-cors xgboost numpy pandas scikit-learn
                </code>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontWeight: '600', color: '#212121', marginBottom: '8px' }}>2. Execute o servidor:</h3>
                <code style={{ display: 'block', backgroundColor: '#263238', color: '#4caf50', padding: '12px', borderRadius: '4px', fontSize: '14px' }}>
                  python app.py
                </code>
              </div>
              
              <div>
                <h3 style={{ fontWeight: '600', color: '#212121', marginBottom: '8px' }}>3. Servidor em:</h3>
                <code style={{ display: 'inline-block', backgroundColor: '#e0e0e0', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                  http://localhost:5000
                </code>
              </div>
            </div>
            
            <button
              onClick={checkAPIStatus}
              style={{ backgroundColor: '#1976d2', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}
            >
              Tentar Conectar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Brain size={40} color="#1976d2" />
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#212121' }}>
                Machine Learning - Predições
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={retreinarModelos}
                disabled={retraining}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: retraining ? '#9e9e9e' : '#ff9800',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: retraining ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <RefreshCw size={18} style={{ animation: retraining ? 'spin 1s linear infinite' : 'none' }} />
                {retraining ? 'Retreinando...' : 'Retreinar com Dados do Banco'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e8f5e9', padding: '8px 16px', borderRadius: '999px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#2e7d32' }}>API Conectada</span>
              </div>
            </div>
          </div>
          <p style={{ color: '#757575', fontSize: '16px' }}>
            Modelo XGBoost para predição de tempo de resposta, necessidade de SAMU e classificação de vítimas
          </p>
        </div>

        {/* Gráficos Analíticos */}
        {dashboardData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            
            {/* Gráfico Donut - Natureza da Ocorrência */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Activity size={24} color="#1976d2" />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#212121' }}>Natureza da Ocorrência</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.natureza_ocorrencia}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.natureza_ocorrencia.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico Vertical - Dias da Semana */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Calendar size={24} color="#43a047" />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#212121' }}>Incidentes por Dia da Semana</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.dias_semana}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#43a047" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico Horizontal - Óbitos por Região */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <MapPin size={24} color="#e53935" />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#212121' }}>Óbitos por Região</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.obitos_regiao} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="regiao" width={100} />
                  <Tooltip />
                  <Bar dataKey="obitos" fill="#e53935" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p style={{ fontSize: '14px', color: '#757575', marginTop: '12px', textAlign: 'center' }}>
                Total de óbitos: {dashboardData.total_obitos}
              </p>
            </div>

            {/* Gráfico Scatter - Tempo x Complexidade */}
            {scatterSeries.length > 0 && (
              <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <TrendingUp size={24} color="#8e24aa" />
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#212121' }}>Tempo x Complexidade (amostra)</h3>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <ScatterChart margin={{ top: 8, right: 12, bottom: 12, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="complexidade" name="Complexidade" domain={[0, 10]} />
                    <YAxis type="number" dataKey="tempo_resposta" name="Tempo de resposta (min)" />
                    <ZAxis type="category" dataKey="turno" name="Turno" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'tempo_resposta') return [`${value} min`, 'Tempo']
                        if (name === 'complexidade') return [value, 'Complexidade']
                        return [value, name]
                      }}
                      labelFormatter={() => 'Ponto da amostra'}
                    />
                    <Legend />
                    {scatterSeries.map((serie, index) => (
                      <Scatter
                        key={serie.natureza}
                        name={serie.natureza}
                        data={serie.pontos}
                        fill={NATUREZA_COLORS[serie.natureza] || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
                <p style={{ fontSize: '14px', color: '#757575', marginTop: '12px', textAlign: 'center' }}>
                  Relação entre complexidade e tempo estimado, colorido por natureza da ocorrência
                </p>
              </div>
            )}
          </div>
        )}

        {/* Feature Importance */}
        {featureImportance.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#212121', marginBottom: '20px' }}>
              Importância dos Fatores (Feature Importance)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={featureImportance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="feature" width={100} />
                <Tooltip formatter={(value) => value.toFixed(3)} />
                <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                  {featureImportance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#1e88e5', '#43a047', '#fb8c00', '#8e24aa', '#3949ab'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: '14px', color: '#757575', marginTop: '16px', textAlign: 'center' }}>
              Fatores que mais influenciam na predição do tempo de resposta
            </p>
          </div>
        )}

        {/* Formulário de Predição */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#212121', marginBottom: '20px' }}>
            🔮 Simular Nova Ocorrência
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#424242', marginBottom: '8px' }}>
                Natureza da Ocorrência
              </label>
              <select
                value={formData.natureza}
                onChange={(e) => setFormData({...formData, natureza: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
              >
                {valoresPossiveis?.naturezas.map(nat => (
                  <option key={nat} value={nat}>{nat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#424242', marginBottom: '8px' }}>
                Região
              </label>
              <select
                value={formData.regiao}
                onChange={(e) => setFormData({...formData, regiao: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
              >
                {valoresPossiveis?.regioes.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#424242', marginBottom: '8px' }}>
                Turno
              </label>
              <select
                value={formData.turno}
                onChange={(e) => setFormData({...formData, turno: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
              >
                <option value={0}>Madrugada (00h-06h)</option>
                <option value={1}>Manhã (06h-12h)</option>
                <option value={2}>Tarde (12h-18h)</option>
                <option value={3}>Noite (18h-00h)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#424242', marginBottom: '8px' }}>
                Complexidade (1-10)
              </label>
              <input
                type="number"
                value={formData.complexidade}
                onChange={(e) => setFormData({...formData, complexidade: parseInt(e.target.value)})}
                min="1"
                max="10"
                style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#424242', marginBottom: '8px' }}>
                Idade da Vítima
              </label>
              <input
                type="number"
                value={formData.idade}
                onChange={(e) => setFormData({...formData, idade: parseInt(e.target.value)})}
                min="0"
                max="120"
                style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#424242', marginBottom: '8px' }}>
                Sexo
              </label>
              <select
                value={formData.sexo}
                onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '14px' }}
              >
                {valoresPossiveis?.sexos.map(sex => (
                  <option key={sex} value={sex}>{sex}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={fazerPredicao}
            disabled={predicting}
            style={{ width: '100%', backgroundColor: predicting ? '#9e9e9e' : '#1976d2', color: 'white', padding: '14px', borderRadius: '4px', border: 'none', fontSize: '16px', fontWeight: '500', cursor: predicting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {predicting ? (
              <>
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Processando...
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                Fazer Predição com XGBoost
              </>
            )}
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            {/* Tempo de Resposta */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Clock size={24} color="#1976d2" />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#212121' }}>Tempo de Resposta</h3>
              </div>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1976d2' }}>
                  {resultado.tempo_resposta_estimado}
                </div>
                <div style={{ fontSize: '16px', color: '#757575', marginTop: '8px' }}>minutos estimados</div>
              </div>
            </div>

            {/* Necessidade SAMU */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Ambulance size={24} color="#f44336" />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#212121' }}>Necessidade de SAMU</h3>
              </div>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: resultado.necessita_samu ? '#f44336' : '#4caf50' }}>
                  {resultado.necessita_samu ? 'SIM' : 'NÃO'}
                </div>
                <div style={{ fontSize: '16px', color: '#757575', marginTop: '8px' }}>
                  Probabilidade: {resultado.probabilidade_samu}%
                </div>
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: resultado.necessita_samu ? '#ffebee' : '#e8f5e9', borderRadius: '4px' }}>
                  <span style={{ fontSize: '14px', color: resultado.necessita_samu ? '#c62828' : '#2e7d32', fontWeight: '500' }}>
                    {resultado.necessita_samu ? 'Acionar SAMU' : '✓ SAMU pode não ser necessário'}
                  </span>
                </div>
              </div>
            </div>

            {/* Classificação */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <AlertTriangle size={24} color="#ff9800" />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#212121' }}>Classificação Prevista</h3>
              </div>
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div 
                  style={{ 
                    display: 'inline-block',
                    padding: '16px 32px', 
                    borderRadius: '8px', 
                    backgroundColor: getClassificacaoColor(resultado.classificacao_prevista),
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}
                >
                  {getClassificacaoIcon(resultado.classificacao_prevista)} {resultado.classificacao_prevista}
                </div>
                <div style={{ fontSize: '14px', color: '#757575', marginTop: '12px' }}>
                  Classificação da vítima
                </div>
              </div>
            </div>
          </div>
        )}

        

        {/* Informações dos Modelos */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#212121', marginBottom: '20px' }}>
            ℹ️ Sobre os Modelos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '8px', borderLeft: '4px solid #1976d2' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1565c0', marginBottom: '8px' }}>Tempo de Resposta</h4>
              <p style={{ fontSize: '14px', color: '#424242' }}>Modelo de regressão XGBoost que prevê o tempo estimado de resposta em minutos</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#ffebee', borderRadius: '8px', borderLeft: '4px solid #f44336' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#c62828', marginBottom: '8px' }}>Necessidade SAMU</h4>
              <p style={{ fontSize: '14px', color: '#424242' }}>Modelo de classificação que determina se a ocorrência necessita de SAMU</p>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#e65100', marginBottom: '8px' }}>Classificação Vítima</h4>
              <p style={{ fontSize: '14px', color: '#424242' }}>Prevê a classificação (Ferida grave, Ferida leve, Óbito, Vítima ilesa)</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MLDashboard;