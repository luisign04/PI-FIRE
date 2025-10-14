import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Login from './pages/Login';
import OcorrenciaForm from './pages/OcorrenciaForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/nova-ocorrencia" element={<OcorrenciaForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;