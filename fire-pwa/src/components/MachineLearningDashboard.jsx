import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Brain, Clock, Ambulance, AlertTriangle, RefreshCw, TrendingUp } from 'lucide-react';

const MLDashboard = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [valoresPossiveis, setValoresPossiveis] = useState(null);
  const [resultado, setResultado] = useState(null);
  
  const [formData, setFormData] = useState({
    natureza: 'APH',
    regiao: 'RMR',
    turno: 1,
    complexidade: 5,
    idade: 30,
    sexo: 'Masculino'
  });

  const API_URL = 'http://localhost:5000';

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
      setFeatureImportance(data.importance);
    } catch (error) {
      console.error('Erro ao carregar importância das features:', error);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e8f5e9', padding: '8px 16px', borderRadius: '999px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#4caf50', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#2e7d32' }}>API Conectada</span>
            </div>
          </div>
          <p style={{ color: '#757575', fontSize: '16px' }}>
            Modelo XGBoost para predição de tempo de resposta, necessidade de SAMU e classificação de vítimas
          </p>
        </div>

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
                    {resultado.necessita_samu ? '🚨 Acionar SAMU' : '✓ SAMU pode não ser necessário'}
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

        {/* Feature Importance */}
        {featureImportance.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#212121', marginBottom: '20px' }}>
              📊 Importância dos Fatores (Feature Importance)
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
      `}</style>
    </div>
  );
};

export default MLDashboard;