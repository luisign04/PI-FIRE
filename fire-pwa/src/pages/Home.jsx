import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  // Funções de navegação
  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleListarOcorrencias = () => {
    navigate('/listar-ocorrencias');
  };

  const handleRegistrarOcorrencia = () => {
    navigate('/criar-ocorrencia');
  };

  const handleLocalizacao = () => {
    navigate('/localizacao');
  };

  const handleUsuario = () => {
    navigate('/usuario');
  };

  const handleConfiguracoes = () => {
    navigate('/configuracoes');
  };

  return (
    <div className="home-page">
      <Header 
        title="Início" 
        showSettings={true}
        onSettingsClick={handleConfiguracoes}
      />

      <div className="home-content">
        <h2 className="section-title">O que você deseja acessar?</h2>

        <div className="buttons-container">
          {/* Primeira linha: Dashboard e Listar Ocorrências */}
          <div className="button-row">
            <button 
              className="modern-button dashboard"
              onClick={handleDashboard}
            >
              <div className="button-content">
                <span className="material-icons">dashboard</span>
                <span className="button-text">Dashboard</span>
              </div>
            </button>

            <button 
              className="modern-button listar"
              onClick={handleListarOcorrencias}
            >
              <div className="button-content">
                <span className="material-icons">list</span>
                <span className="button-text">Listar Ocorrências</span>
              </div>
            </button>
          </div>

          {/* Segunda linha: Geolocalização e Registrar */}
          <div className="button-row">
            <button 
              className="modern-button localizacao"
              onClick={handleLocalizacao}
            >
              <div className="button-content">
                <span className="material-icons">place</span>
                <span className="button-text">Geolocalização</span>
              </div>
            </button>

            <button 
              className="modern-button registrar"
              onClick={handleRegistrarOcorrencia}
            >
              <div className="button-content">
                <span className="material-icons">add_circle</span>
                <span className="button-text">Registrar Nova Ocorrência</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Navegação Inferior */}
      <nav className="bottom-nav">
        <button className="nav-item active" onClick={() => navigate('/')}>
          <span className="material-icons">home</span>
          <span className="nav-label">Início</span>
        </button>

        <button className="nav-item" onClick={() => navigate('/criar-ocorrencia')}>
          <span className="material-icons">add_box</span>
          <span className="nav-label">Nova</span>
        </button>

        <button className="nav-item" onClick={handleUsuario}>
          <span className="material-icons">person</span>
          <span className="nav-label">Usuário</span>
        </button>
      </nav>
    </div>
  );
}

export default Home;