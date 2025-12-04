import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Fire.css';

function Fire() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [mostrarPesquisa, setMostrarPesquisa] = useState(false);
  const [cidade, setCidade] = useState('');
  const [mapUrl, setMapUrl] = useState('https://www.google.com/maps?q=Recife&output=embed');

  useEffect(() => {
    const usuarioEmail = localStorage.getItem('usuarioEmail');
    if (!usuarioEmail) {
      navigate('/login');
      return;
    }
    setUsuario(usuarioEmail);

    const cidadeSalva = localStorage.getItem('cidadeSelecionada');
    if (cidadeSalva) {
      setCidade(cidadeSalva);
      setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(cidadeSalva)}&output=embed`);
    }
  }, [navigate]);

  const handlePesquisar = () => {
    setMostrarPesquisa(true);
  };

  const handleVoltar = () => {
    setMostrarPesquisa(false);
  };

  const handleConfirmar = () => {
    const cidadeTrim = cidade.trim();
    if (!cidadeTrim) {
      alert('Por favor, digite o nome da cidade!');
      return;
    }

    localStorage.setItem('cidadeSelecionada', cidadeTrim);
    setMapUrl(`https://www.google.com/maps?q=${encodeURIComponent(cidadeTrim)}&output=embed`);
    navigate('/localizacao');
  };

  const handleLocalizacaoAtual = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada neste navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = `${latitude},${longitude}`;
        localStorage.setItem('cidadeSelecionada', coords);
        setMapUrl(`https://www.google.com/maps?q=${coords}&output=embed`);
      },
      () => alert('Não foi possível obter sua localização.')
    );
  };

  return (
    <div className="fire-page">
      <header>
        <h1>Bem vindo ao FIRE</h1>
        <div className="usuario">
          <img src="https://cdn-icons-png.flaticon.com/512/456/456212.png" alt="Usuário" />
          <span>
            <h2>Bem-vindo, {usuario}!</h2>
          </span>
        </div>
      </header>

      <main>
        <section className="conteudo">
          <div className="mapa-container">
            <iframe
              id="map"
              src={mapUrl}
              width="400"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Mapa"
            ></iframe>
          </div>

          <div className="opcoes">
            {!mostrarPesquisa ? (
              <>
                <p id="texto-principal">
                  Utilize a localização atual ou selecione a cidade da ocorrência:
                </p>
                <div className="botoes" id="botoes-principais">
                  <button className="btn localizacao" onClick={handleLocalizacaoAtual}>
                    📍 Localização Atual
                  </button>
                  <button className="btn pesquisar" onClick={handlePesquisar}>
                    🌐 Pesquisar local
                  </button>
                </div>
              </>
            ) : (
              <div className="pesquisa-cidade">
                <p>Digite o nome da cidade para efetuar o registro:</p>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirmar()}
                  placeholder="Digite aqui..."
                  autoFocus
                />
                <div className="botoes">
                  <button className="btn voltar" onClick={handleVoltar}>
                    🔙 Voltar
                  </button>
                  <button className="btn confirmar" onClick={handleConfirmar}>
                    ✅ Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Fire;