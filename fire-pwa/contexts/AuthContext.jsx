import React from 'react';

// Troque AsyncStorage por localStorage
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
    role: 'admin',
  },
  {
    id: 2,
    email: 'teste@bombeiros.gov.br',
    senha: 'teste123',
    nome: 'João Santos',
    matricula: 'BM-2023-04568',
    telefone: '(11) 98888-8888',
    role: 'user',
  },
];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
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
      await new Promise(resolve => setTimeout(resolve, 800));
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
      );
      if (foundUser) {
        const { senha: _, ...userWithoutPassword } = foundUser;
        localStorage.setItem('@user_data', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        return { success: true, message: 'Login realizado com sucesso!' };
      }
      return { success: false, message: 'Email ou senha incorretos' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('@user_data');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const updateUser = (newData) => {
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