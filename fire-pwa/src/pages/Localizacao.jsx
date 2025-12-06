import { useState, useEffect, useRef } from 'react';
import '../styles/Localizacao.css';

function Localizacao() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const mapRef = useRef(null);

  // Verificar permissões ao carregar
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocalização não é suportada pelo seu navegador');
    }
  }, []);

  // Centralizar o mapa na localização (usando Google Maps API se disponível)
  const centerMapOnLocation = () => {
    if (mapRef.current && location) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Obter localização atual
  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg('Geolocalização não é suportada pelo seu navegador');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        const newLocation = {
          latitude,
          longitude,
          accuracy,
          timestamp: new Date().toLocaleString('pt-BR'),
        };

        setLocation(newLocation);

        // Tentar obter endereço reverso usando Nominatim (OpenStreetMap)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'FirePWA/1.0'
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.address) {
              const { road, suburb, city, state } = data.address;
              const formattedAddress = `${road || suburb || ''}, ${city || ''} - ${state || ''}`;
              setAddress(formattedAddress);
            }
          }
        } catch (geocodeError) {
          console.log('Não foi possível obter o endereço:', geocodeError);
        }

        setLoading(false);
        
        // Centralizar mapa
        setTimeout(() => {
          centerMapOnLocation();
        }, 500);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        let message = 'Erro ao obter localização. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += 'Permissão de localização negada.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Informação de localização indisponível.';
            break;
          case error.TIMEOUT:
            message += 'Tempo esgotado ao obter localização.';
            break;
          default:
            message += 'Erro desconhecido.';
        }
        
        setErrorMsg(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // Compartilhar localização
  const shareLocation = async () => {
    if (!location) {
      alert('Obtenha a localização primeiro');
      return;
    }

    const message = `Minha localização:\nLatitude: ${location.latitude.toFixed(6)}\nLongitude: ${location.longitude.toFixed(6)}${
      address ? `\nEndereço: ${address}` : ''
    }\n\nEnviado via App Bombeiros`;

    // Verificar se a API Web Share está disponível
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha Localização',
          text: message,
        });
        console.log('Localização compartilhada com sucesso');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Erro ao compartilhar:', error);
          copyToClipboard(message);
        }
      }
    } else {
      // Fallback: copiar para área de transferência
      copyToClipboard(message);
    }
  };

  // Copiar para área de transferência
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert('Localização copiada para a área de transferência!');
      },
      (err) => {
        console.error('Erro ao copiar:', err);
        alert('Não foi possível copiar a localização');
      }
    );
  };

  // URL do Google Maps
  const getGoogleMapsUrl = () => {
    if (!location) return '#';
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  };

  return (
    <div className="localizacao-container">
      <div className="localizacao-content">
        {errorMsg && (
          <div className="error-container">
            <p className="error-text">{errorMsg}</p>
          </div>
        )}

        {/* Mapa */}
        <div className="map-container" ref={mapRef}>
          {location ? (
            <iframe
              className="map-iframe"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.01},${location.latitude - 0.01},${location.longitude + 0.01},${location.latitude + 0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`}
              title="Mapa de Localização"
            />
          ) : (
            <div className="map-placeholder">
              <p>Clique em "Obter Minha Localização" para visualizar o mapa</p>
            </div>
          )}
        </div>

        {/* Botão de obter localização */}
        <button
          className="btn-obter-localizacao"
          onClick={getLocation}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            'Obter Minha Localização'
          )}
        </button>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner-small"></div>
            <p className="loading-text">Obtendo localização...</p>
          </div>
        )}

        {location && (
          <div className="location-info">
            <h2 className="location-title">Localização Encontrada</h2>

            <div className="coordinates-container">
              <div className="coordinate-box">
                <span className="coordinate-label">LATITUDE</span>
                <span className="coordinate-value">
                  {location.latitude.toFixed(6)}
                </span>
              </div>
              <div className="coordinate-box">
                <span className="coordinate-label">LONGITUDE</span>
                <span className="coordinate-value">
                  {location.longitude.toFixed(6)}
                </span>
              </div>
            </div>

            {address && (
              <div className="address-container">
                <span className="address-label">ENDEREÇO APROXIMADO</span>
                <p className="address-text">{address}</p>
              </div>
            )}

            {location.accuracy && (
              <div className="accuracy-container">
                <p className="accuracy-text">
                  Precisão: ±{location.accuracy.toFixed(1)} metros
                </p>
              </div>
            )}

            <div className="action-buttons">
              <button
                className="btn-share"
                onClick={shareLocation}
              >
                Compartilhar Localização
              </button>

              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-maps"
              >
                Abrir no Google Maps
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Localizacao;