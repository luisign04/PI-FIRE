import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Header({ title, showBackButton = true }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      {showBackButton ? (
        <button 
          className="menu" 
          aria-label="Ir para início"
          onClick={() => navigate('/')}
        >
          <i className="fas fa-home" aria-hidden="true"></i>
        </button>
      ) : (
        <button className="menu" aria-label="Início">
          <i className="fas fa-home" aria-hidden="true"></i>
        </button>
      )}

      <h1>{title}</h1>

      <button 
        className="usuario" 
        aria-label="Área do usuário"
        onClick={() => navigate('/usuario')}
      >
        <i className="fas fa-user-circle" aria-hidden="true"></i>
      </button>
    </header>
  );
}

export default Header;