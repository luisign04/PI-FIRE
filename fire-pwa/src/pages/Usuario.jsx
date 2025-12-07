
import React from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import useScrollToTop from '../hooks/useScrollToTop';

import '../styles/Usuario.css'

// Componente reutilizável para as linhas de informação
const InfoRow = ({ label, value }) => (
  <div className="info-row">
    <span className="info-label">{label}</span>
    <span className="info-value">{value || "Não informado"}</span>
  </div>
);


export default function Usuario() {
  useScrollToTop();
  const { logout, user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  // Carrega os dados do usuário ao montar o componente
  React.useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // OPÇÃO 1: Se os dados já vêm do AuthContext
      if (user) {
        setUserData({
          nome: user.nome || user.name,
          email: user.email,
          matricula: user.matricula,
          telefone: user.telefone || user.phone,
        });
      }
      
      // OPÇÃO 2: Se precisar buscar dados adicionais da API
      // const response = await fetch(`https://sua-api.com/usuarios/${user.id}`, {
      //   headers: {
      //     'Authorization': `Bearer ${user.token}`
      //   }
      // });
      // const data = await response.json();
      // setUserData({
      //   nome: data.nome,
      //   email: data.email,
      //   matricula: data.matricula,
      //   telefone: data.telefone,
      // });
      
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      alert("Não foi possível carregar os dados do usuário.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Tem certeza que deseja sair da sua conta?"
    );
    
    if (confirmLogout) {
      try {
        logout();
        navigate('/login');
      } catch (e) {
        console.warn("Erro ao tentar deslogar:", e);
      }
    }
  };

  if (loading) {
    return (
      <div className="usuario-container loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="usuario-container">
      <Header title="Usuário" showBackButton={true} />
      <div className="scroll-content">
        {/* Nome do Usuário removido conforme solicitado */}

        {/* Informações do Usuário */}
        <div className="section">
          <h2 className="section-title">Informações da Conta</h2>

          <InfoRow 
            label="Nome Completo" 
            value={userData?.nome} 
          />
          <InfoRow 
            label="E-mail" 
            value={userData?.email} 
          />
          <InfoRow 
            label="Matrícula" 
            value={userData?.matricula} 
          />
          <InfoRow 
            label="Telefone" 
            value={userData?.telefone} 
          />
        </div>

        {/* Botão Sair */}
        <div className="logout-section">
          <button 
            className="logout-button" 
            onClick={handleLogout}
          >
            Sair da Conta
          </button>
        </div>
      </div>

      {/* Barra de Navegação Inferior */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate('/')}> 
          <span className="material-icons">home</span>
          <span className="nav-label">Início</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/criar-ocorrencia')}>
          <span className="material-icons">add_box</span>
          <span className="nav-label">Nova Ocorrência</span>
        </button>
        <button className="nav-item active" onClick={() => navigate('/usuario')}>
          <span className="material-icons">person</span>
          <span className="nav-label">Usuário</span>
        </button>
      </nav>
    </div>
  );
}