import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import useScrollToTop from '../hooks/useScrollToTop';
import '../styles/Login.css';

function Login() {
  const [showRecovery, setShowRecovery] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // importa Auth Context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      //Usa a função login do AuthContext que valida os usuários mockados
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 350, textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, letterSpacing: 2, color: '#bc010c', margin: 0 }}>FIRE</h1>
        <p style={{ fontSize: 15, color: '#666', marginTop: 8, marginBottom: 0 }}>
          Ferramenta Integrada de Resposta a Emergências
        </p>
      </div>
      
      <form className="login-form" onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 350, background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* ✅ Mensagem de erro */}
        {error && (
          <div style={{ 
            width: '100%', 
            marginBottom: 16, 
            padding: 12, 
            background: '#fee', 
            border: '1px solid #fcc', 
            borderRadius: 8, 
            color: '#c00',
            fontSize: 14,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div className="form-group" style={{ width: '100%' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 8 }}>Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
        </div>
        
        <div style={{ marginTop: '24px', width: '100%' }} className="form-group">
          <label htmlFor="password" style={{ display: 'block', marginBottom: 8 }}>Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ccc', fontSize: 16 }}
          />
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <a
              href="#"
              style={{ color: '#bc010c', textDecoration: 'underline', fontSize: 14, fontWeight: 500 }}
              onClick={e => {
                e.preventDefault();
                setShowRecovery(true);
              }}
            >
              Recuperar Senha
            </a>
          </div>
          {showRecovery && (
            <div style={{ marginTop: 16, background: '#fff4f4', border: '1px solid #bc010c', borderRadius: 8, padding: 16, color: '#bc010c', fontSize: 15, textAlign: 'center' }}>
              Para recuperar a sua senha, entre em contato com a equipe de suporte técnico de seu batalhão.
            </div>
          )}
        </div>
        
        <div style={{ marginTop: '24px', width: '100%' }}>
          <button
            type="submit"
            className="login-button"
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 8,
              fontSize: 16,
              background: (email && password && !loading) ? '#bc010c' : '#cccccc',
              color: (email && password && !loading) ? '#fff' : '#888',
              border: (email && password && !loading) ? '1px solid #a0010a' : '1px solid #bbbbbb',
              cursor: (email && password && !loading) ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              boxShadow: (email && password && !loading)
                ? '0 6px 10px rgba(188, 1, 12, 0.3)'
                : '0 6px 10px rgba(204, 204, 204, 0.3)',
              transform: (email && password && !loading) ? undefined : 'none',
            }}
            disabled={!(email && password) || loading}
            onMouseOver={e => {
              if (email && password && !loading) {
                e.currentTarget.style.background = '#a0010a';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(188, 1, 12, 0.4)';
              }
            }}
            onMouseOut={e => {
              if (email && password && !loading) {
                e.currentTarget.style.background = '#bc010c';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 6px 10px rgba(188, 1, 12, 0.3)';
              }
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;