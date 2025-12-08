// contexts/LocationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation deve ser usado dentro de um LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState({
    municipio: '',
    latitude: '',
    longitude: '',
    endereco: '',
    bairro: '',
    loading: false,
    error: null,
  });

  // Função para obter a localização atual
  const getCurrentLocation = async () => {
    try {
      setCurrentLocation(prev => ({ ...prev, loading: true, error: null }));

      // Solicitar permissões
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de localização negada');
      }

      // Obter localização
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocoding para obter endereço
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      console.log("📌 DADOS DE GEOLOCALIZAÇÃO COMPLETOS:", geocode);

      if (geocode.length > 0) {
        const address = geocode[0];
        
        // Tentar obter o município de diferentes campos
        let municipio = address.city || 
                       address.subregion || 
                       address.region || 
                       '';
        
        // Se ainda não encontrou, tenta extrair do nome ou district
        if (!municipio && address.district) {
          // Tenta inferir o município pelo bairro (para Recife)
          if (address.district.includes('Recife') || 
              address.district.includes('Casa Amarela') ||
              address.district.includes('Boa Vista') ||
              address.district.includes('Boa Viagem')) {
            municipio = 'Recife';
          }
        }

        console.log("📍 Município detectado:", municipio);
        console.log("🏘️ Bairro:", address.district);
        console.log("🛣️ Rua:", address.street);

        const locationData = {
          municipio: municipio,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          endereco: address.street || '',
          bairro: address.district || '',
          loading: false,
          error: null,
        };

        setCurrentLocation(locationData);
        return locationData;
      } else {
        throw new Error('Nenhum endereço encontrado para as coordenadas');
      }

    } catch (error) {
      const errorMessage = error.message || 'Erro ao obter localização';
      console.error("Erro na geolocalização:", error);
      
      setCurrentLocation(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // Função para atualizar manualmente a localização
  const updateLocation = (newLocation) => {
    setCurrentLocation(prev => ({
      ...prev,
      ...newLocation,
      error: null,
    }));
  };

  // Função para limpar a localização
  const clearLocation = () => {
    setCurrentLocation({
      municipio: '',
      latitude: '',
      longitude: '',
      endereco: '',
      bairro: '',
      loading: false,
      error: null,
    });
  };

  const value = {
    currentLocation,
    getCurrentLocation,
    updateLocation,
    clearLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;