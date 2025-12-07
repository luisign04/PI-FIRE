import React from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OcorrenciasProvider } from './contexts/OcorrenciasContext';
import { AuthProvider } from './contexts/AuthContext';

import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CriarOcorrencia from './pages/CriarOcorrencia';
import ListarOcorrencias from './pages/ListarOcorrencias';
import OcorrenciaSucesso from './pages/OcorrenciaSucesso';
import Fire from './pages/Fire';
import Localizacao from './pages/Localizacao';
import Usuario from './pages/Usuario';
import DetalhesOcorrencia from './pages/DetalhesOcorrencia';
import EditarOcorrencias from './pages/EditarOcorrencia';
import './styles/App.css';


// Componente de rota protegida
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
    // 🆕 ADICIONAR AuthProvider envolvendo tudo
    <AuthProvider>
      <OcorrenciasProvider>
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
     path="/editar-ocorrencia" 
     element={
       <ProtectedRoute>
         <EditarOcorrencias />
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

            <Route 
  path="/detalhes-ocorrencia/:id" 
  element={
    <ProtectedRoute>
      <DetalhesOcorrencia />
    </ProtectedRoute>
  } 
/>

            {/* 🆕 ADICIONAR ROTA DO USUÁRIO */}
            <Route 
              path="/usuario" 
              element={
                <ProtectedRoute>
                  <Usuario />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </OcorrenciasProvider>
    </AuthProvider>
  );
}

export default App;