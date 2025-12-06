// contexts/AuthContext.js
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = React.createContext();

// Usuários mockados para teste
const MOCK_USERS = [
  {
    id: 1,
    email: 'danilo87@sport.com',
    senha: 'sportseriea',
    nome: 'Danilo',
    matricula: 'SB-2023-04567',
    telefone: '(11) 99999-9999',
    role: 'admin', // ⭐ Usuário administrador
  },
  {
    id: 2,
    email: 'teste@bombeiros.gov.br',
    senha: 'teste123',
    nome: 'João Santos',
    matricula: 'BM-2023-04568',
    telefone: '(11) 98888-8888',
    role: 'user', // 👤 Usuário comum
  },
];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user_data');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));

      // Busca usuário nos dados mockados
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
      );

      if (foundUser) {
        // Remove a senha antes de salvar
        const { senha: _, ...userWithoutPassword } = foundUser;
        
        // Salva os dados localmente
        await AsyncStorage.setItem('@user_data', JSON.stringify(userWithoutPassword));
        
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        
        return { success: true, message: 'Login realizado com sucesso!' };
      }

      return { 
        success: false, 
        message: 'Email ou senha incorretos' 
      };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: 'Erro ao fazer login. Tente novamente.' 
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user_data');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateUser = async (newData) => {
    try {
      const updatedUser = { ...user, ...newData };
      await AsyncStorage.setItem('@user_data', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return { success: false };
    }
  };

  // ✨ Função helper para verificar se é admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const authContextValue = {
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    isLoading,
    user,
    setUser,
    updateUser,
    isAdmin, // Nova função exportada
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};