import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CriarOcorrencia from './pages/CriarOcorrencia';
import ListarOcorrencias from './pages/ListarOcorrencias';
import OcorrenciaSucesso from './pages/OcorrenciaSucesso';
import Fire from './pages/Fire';
import Localizacao from './pages/Localizacao';
import './styles/App.css';

// Componente de rota protegida
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = localStorage.getItem('usuarioEmail');
    setIsAuthenticated(!!userEmail);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/criar-ocorrencia" 
          element={
            <ProtectedRoute>
              <CriarOcorrencia />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/listar-ocorrencias" 
          element={
            <ProtectedRoute>
              <ListarOcorrencias />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/ocorrencia-sucesso" 
          element={
            <ProtectedRoute>
              <OcorrenciaSucesso />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/fire" 
          element={
            <ProtectedRoute>
              <Fire />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/localizacao" 
          element={
            <ProtectedRoute>
              <Localizacao />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;