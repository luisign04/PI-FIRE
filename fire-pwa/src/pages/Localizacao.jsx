import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useScrollToTop from '../hooks/useScrollToTop';
import '../styles/Localizacao.css';

// Fix para o ícone do marcador do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Componente para centralizar o mapa
function MapController({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, 16, { animate: true });
    }
  }, [center, map]);
  
  return null;
}

function Localizacao() {
  useScrollToTop();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const mapRef = useRef(null);

  // Verificar permissões ao carregar
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocalização não é suportada pelo seu navegador');
    }
  }, []);

  // Centralizar o mapa na localização
  const centerMapOnLocation = () => {
    if (mapRef.current && location) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Obter endereço reverso
  const getReverseGeocode = async (latitude, longitude) => {
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
          const { road, suburb, city, state, town, village } = data.address;
          const street = road || suburb || '';
          const locality = city || town || village || '';
          return `${street}${street && locality ? ', ' : ''}${locality}${state ? ' - ' + state : ''}`;
        }
      }
    } catch (error) {
      console.log('Não foi possível obter o endereço:', error);
    }
    return null;
  };

  // Tentar obter localização com fallback
  const attemptGeolocation = (highAccuracy = true, timeout = 10000) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: highAccuracy,
          timeout: timeout,
          maximumAge: highAccuracy ? 0 : 300000, // 5 min cache se não for alta precisão
        }
      );
    });
  };

  // Obter localização atual com estratégia de fallback
  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    setAddress(null);

    if (!navigator.geolocation) {
      setErrorMsg('Geolocalização não é suportada pelo seu navegador');
      setLoading(false);
      return;
    }

    try {
      let position;
      
      // Estratégia 1: Tentar com alta precisão
      try {
        console.log('Tentativa 1: Alta precisão (GPS)...');
        position = await attemptGeolocation(true, 10000);
      } catch (error1) {
        console.warn('Tentativa 1 falhou:', error1.message);
        
        // Estratégia 2: Tentar com precisão média e timeout maior
        try {
          console.log('Tentativa 2: Precisão média (Wi-Fi/Rede)...');
          position = await attemptGeolocation(false, 15000);
        } catch (error2) {
          console.warn('Tentativa 2 falhou:', error2.message);
          
          // Estratégia 3: Última tentativa com configurações mais permissivas
          try {
            console.log('Tentativa 3: Modo permissivo...');
            position = await attemptGeolocation(false, 20000);
          } catch (error3) {
            // Todas as tentativas falharam
            throw error3;
          }
        }
      }

      // Sucesso! Processar localização
      const { latitude, longitude, accuracy } = position.coords;

      const newLocation = {
        latitude,
        longitude,
        accuracy,
        timestamp: new Date().toLocaleString('pt-BR'),
      };

      setLocation(newLocation);
      console.log('✅ Localização obtida:', newLocation);

      // Buscar endereço
      const fetchedAddress = await getReverseGeocode(latitude, longitude);
      if (fetchedAddress) {
        setAddress(fetchedAddress);
      }

      setLoading(false);
      setRetryCount(0);
      
      // Centralizar mapa
      setTimeout(() => {
        centerMapOnLocation();
      }, 500);

    } catch (error) {
      console.error('❌ Erro ao obter localização:', error);
      let message = '';
      
      switch (error.code) {
        case 1: // PERMISSION_DENIED
          message = '🚫 Permissão de localização negada. Por favor, permita o acesso à localização nas configurações do navegador.';
          break;
        case 2: // POSITION_UNAVAILABLE
          message = '📍 Não foi possível determinar sua localização. Verifique se:\n' +
                   '• O GPS está ativado\n' +
                   '• Você está em um local com sinal\n' +
                   '• O Wi-Fi ou dados móveis estão ativos';
          break;
        case 3: // TIMEOUT
          message = '⏱️ Tempo esgotado ao buscar localização. Tente novamente em um local com melhor sinal.';
          break;
        default:
          message = '❌ Erro desconhecido ao obter localização. Tente novamente.';
      }
      
      setErrorMsg(message);
      setLoading(false);
      setRetryCount(prev => prev + 1);
    }
  };

  // Compartilhar localização
  const shareLocation = async () => {
    if (!location) {
      alert('Obtenha a localização primeiro');
      return;
    }

    const googleMapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    const message = `📍 Minha localização:\n\n` +
                   `Latitude: ${location.latitude.toFixed(6)}\n` +
                   `Longitude: ${location.longitude.toFixed(6)}\n` +
                   `${address ? `Endereço: ${address}\n` : ''}` +
                   `\n🗺️ Ver no mapa: ${googleMapsLink}\n\n` +
                   `Enviado via App Bombeiros`;

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
        alert('📋 Localização copiada para a área de transferência!');
      },
      (err) => {
        console.error('Erro ao copiar:', err);
        alert('❌ Não foi possível copiar a localização');
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
            <p className="error-text" style={{ whiteSpace: 'pre-line' }}>{errorMsg}</p>
            {retryCount > 0 && retryCount < 3 && (
              <button 
                className="btn-retry" 
                onClick={getLocation}
                style={{ marginTop: '10px' }}
              >
                🔄 Tentar Novamente
              </button>
            )}
          </div>
        )}

        {/* Mapa Leaflet */}
        <div className="map-container" ref={mapRef}>
          {location ? (
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={16}
              style={{ height: '100%', width: '100%', borderRadius: '12px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>
                  <strong>📍 Você está aqui!</strong>
                  <br />
                  {address && <span>{address}</span>}
                  <br />
                  <small>Precisão: ±{location.accuracy.toFixed(1)}m</small>
                </Popup>
              </Marker>
              {/* Círculo de precisão */}
              <Circle
                center={[location.latitude, location.longitude]}
                radius={location.accuracy}
                pathOptions={{
                  fillColor: 'blue',
                  fillOpacity: 0.1,
                  color: 'blue',
                  weight: 2,
                  opacity: 0.5
                }}
              />
              <MapController center={[location.latitude, location.longitude]} />
            </MapContainer>
          ) : (
            <div className="map-placeholder">
              <p>📍 Clique em "Obter Minha Localização" para visualizar o mapa</p>
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
            <>
              <div className="loading-spinner"></div>
              <span style={{ marginLeft: '10px' }}>Localizando...</span>
            </>
          ) : (
            'Obter Minha Localização'
          )}
        </button>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner-small"></div>
            <p className="loading-text">
              Buscando sua localização...<br />
              <small>Isso pode levar alguns segundos</small>
            </p>
          </div>
        )}

        {location && (
          <div className="location-info">
            <h2 className="location-title">Localização Encontrada!</h2>

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
                <span className="address-label">📮 ENDEREÇO APROXIMADO</span>
                <p className="address-text">{address}</p>
              </div>
            )}

            {location.accuracy && (
              <div className="accuracy-container">
                <p className="accuracy-text">
                  Precisão: ±{location.accuracy.toFixed(1)} metros
                  {location.accuracy > 100 && ' (Baixa precisão - considere ativar GPS)'}
                </p>
              </div>
            )}

            <div className="action-buttons">
              <button
                className="btn-share"
                onClick={shareLocation}
              >
                📤 Compartilhar Localização
              </button>

              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-maps"
              >
                🗺️ Abrir no Google Maps
              </a>
            </div>

            <p style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginTop: '15px',
              textAlign: 'center' 
            }}>
              Atualizado em: {location.timestamp}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Localizacao;