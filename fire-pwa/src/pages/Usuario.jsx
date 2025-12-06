import React from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

// Componente reutilizável para as linhas de informação
const InfoRow = ({ label, value }) => (
  <div className="info-row">
    <span className="info-label">{label}</span>
    <span className="info-value">{value || "Não informado"}</span>
  </div>
);

export default function Usuario() {
  const { logout, user } = React.useContext(AuthContext);
  
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
      <div className="scroll-content">
        {/* Nome do Usuário */}
        <div className="user-info-header">
          <h1 className="user-name">{userData?.nome || "Usuário"}</h1>
        </div>

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

      <style jsx>{`
        .usuario-container {
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 20px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #bc010c;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          margin-top: 10px;
          color: #666;
          font-size: 14px;
        }

        .scroll-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .user-info-header {
          background-color: #bc010c;
          padding: 30px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .user-name {
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          text-align: center;
        }

        .section {
          background-color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        .info-value {
          font-size: 14px;
          color: #333;
          text-align: right;
          max-width: 60%;
          word-wrap: break-word;
        }

        .logout-section {
          padding: 20px 0;
        }

        .logout-button {
          width: 100%;
          background-color: #bc010c;
          color: white;
          font-size: 16px;
          font-weight: 600;
          padding: 16px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(188, 1, 12, 0.3);
        }

        .logout-button:hover {
          background-color: #9a0109;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(188, 1, 12, 0.4);
        }

        .logout-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(188, 1, 12, 0.3);
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .usuario-container {
            padding: 16px;
          }

          .user-name {
            font-size: 24px;
          }

          .section-title {
            font-size: 16px;
          }

          .info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .info-value {
            max-width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}