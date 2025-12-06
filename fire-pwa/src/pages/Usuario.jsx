import React, { useEffect, useState, useMemo, useContext } from "react";
import "../styles/Usuario.css";
import { AuthContext } from "../contexts/AuthContext";

// Componente reutilizável para as linhas de informação
const InfoRow = ({ label, value }) => (
  <div className="usuario-info-row">
    <span className="usuario-info-label">{label}</span>
    <span className="usuario-info-value">{value || "Não informado"}</span>
  </div>
);

export default function Usuario() {
  const { logout, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      if (user) {
        setUserData({
          nome: user.nome || user.name,
          email: user.email,
          matricula: user.matricula,
          telefone: user.telefone || user.phone,
        });
      }
      // Para buscar de API, descomente abaixo:
      // const response = await fetch(`https://sua-api.com/usuarios/${user.id}`, {
      //   headers: { 'Authorization': `Bearer ${user.token}` }
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
    if (window.confirm("Tem certeza que deseja sair da sua conta?")) {
      try {
        logout();
      } catch (e) {
        console.warn("Erro ao tentar deslogar:", e);
      }
    }
  };

  if (loading) {
    return (
      <div className="usuario-container usuario-loading">
        <div className="usuario-spinner"></div>
        <span style={{ marginTop: 10, color: "#666" }}>Carregando dados...</span>
      </div>
    );
  }

  return (
    <div className="usuario-container">
      <div className="usuario-userinfo-header">
        <span className="usuario-username">{userData?.nome || "Usuário"}</span>
      </div>
      <div className="usuario-section">
        <span className="usuario-section-title">Informações da Conta</span>
        <InfoRow label="Nome Completo" value={userData?.nome} />
        <InfoRow label="E-mail" value={userData?.email} />
        <InfoRow label="Matrícula" value={userData?.matricula} />
        <InfoRow label="Telefone" value={userData?.telefone} />
      </div>
      <div className="usuario-logout-section">
        <button className="usuario-logout-button" onClick={handleLogout}>
          Sair da Conta
        </button>
      </div>
    </div>
  );
}