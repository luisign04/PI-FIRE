// contexts/SettingsContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from './ThemeContext';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null); // null enquanto carrega
  const [loading, setLoading] = useState(true);

  // Carregar configurações do AsyncStorage ao iniciar
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem("@settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings(parsed);
        } else {
          // Valores padrão
            const defaults = {
              notifications: true,
              darkMode: false,
              sound: true,
              vibration: true,
              // escala de fonte global (1 = padrão). Pode ser 0.9 (pequeno), 1.2 (grande).
              fontScale: 1,
            };
            setSettings(defaults);
        }
      } catch (e) {
          const defaults = {
            notifications: true,
            darkMode: false,
            sound: true,
            vibration: true,
            fontScale: 1,
          };
          setSettings(defaults);
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  // Atualizar configuração e salvar no AsyncStorage
  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await AsyncStorage.setItem("@settings", JSON.stringify(newSettings));
  };

  // Se `settings` estiver carregado, providenciar também o ThemeProvider
  // para que o tema leia `settings.darkMode` como fonte de verdade.
  if (!settings) {
    return (
      <SettingsContext.Provider value={{ settings, updateSetting, loading }}>
        {children}
      </SettingsContext.Provider>
    );
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, loading }}>
      <ThemeProvider
        initialDark={typeof settings.darkMode === 'boolean' ? settings.darkMode : undefined}
        onThemeChange={(v) => updateSetting('darkMode', v)}
      >
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);