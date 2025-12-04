import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Header({ title, showBackButton = true }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      {showBackButton ? (
        <button 
          className="menu" 
          aria-label="Abrir menu"
          onClick={() => navigate('/')}
        >
          <i className="fas fa-bars" aria-hidden="true"></i>
        </button>
      ) : (
        <button className="menu" aria-label="Menu">
          <i className="fas fa-bars" aria-hidden="true"></i>
        </button>
      )}

      <h1>{title}</h1>

      <div className="usuario" aria-hidden="false" aria-label="Área do usuário">
        <i className="fas fa-user-circle" aria-hidden="true"></i>
      </div>
    </header>
  );
}

export default Header;