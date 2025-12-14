// contexts/AuthContext.jsx
import React from 'react';

export const AuthContext = React.createContext();

// Usuários mockados para teste
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@admin.com',
    senha: 'admin',
    nome: 'Ademar',
    matricula: 'SB-2023-04567',
    telefone: '(11) 99999-9999',
    role: 'admin', //Usuário administrador
  },
  {
    id: 2,
    email: 'usuario@email.com',
    senha: 'teste123',
    nome: 'João Santos',
    matricula: 'BM-2023-04568',
    telefone: '(11) 98888-8888',
    role: 'user', //Usuário comum
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
      const storedUser = localStorage.getItem('@user_data');
      
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
      // 🚀 Tentativa de login REAL no backend
      const response = await fetch('http://localhost:3333/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha })
      });

      if (response.ok) {
        const data = await response.json();
        
        const userData = {
          id: data.user.id,
          email: data.user.email,
          nome: data.user.nome,
          matricula: data.user.matricula,
          role: data.user.role
        };
        
        localStorage.setItem('@user_data', JSON.stringify(userData));
        if (data.token) localStorage.setItem('@auth_token', data.token);
        console.log('✅ Login bem-sucedido (backend):', userData);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, message: 'Login realizado com sucesso!' };
      }

      // Se o backend falhar, usar mock como fallback
      await new Promise(resolve => setTimeout(resolve, 400));
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
      );

      if (foundUser) {
        const { senha: _, ...userWithoutPassword } = foundUser;
        localStorage.setItem('@user_data', JSON.stringify(userWithoutPassword));
        localStorage.setItem('@auth_token', 'mock-token');
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        return { success: true, message: 'Login mock realizado (fallback)' };
      }

      return { success: false, message: 'Email ou senha incorretos' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('@user_data');
      localStorage.removeItem('@auth_token');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateUser = async (newData) => {
    try {
      const updatedUser = { ...user, ...newData };
      localStorage.setItem('@user_data', JSON.stringify(updatedUser));
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
    isAdmin,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};