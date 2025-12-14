// contexts/OcorrenciasContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

export const OcorrenciasContext = createContext(null);
const OCORRENCIAS_STORAGE_KEY = 'ocorrencias_data';

export function OcorrenciasProvider({ children }) {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔄 Limpa qualquer cache local para garantir base vazia
  useEffect(() => {
    localStorage.removeItem(OCORRENCIAS_STORAGE_KEY);
    setOcorrencias([]);
  }, []);

  // 🔄 Carregar ocorrências do localStorage ao iniciar
  useEffect(() => {
    carregarOcorrencias();
  }, []);

  // 📥 Carregar ocorrências do localStorage
  const carregarOcorrencias = async () => {
    try {
      console.log('📥 Carregando ocorrências do localStorage...');
      const dataString = localStorage.getItem(OCORRENCIAS_STORAGE_KEY);
      
      if (dataString) {
        const data = JSON.parse(dataString);
        setOcorrencias(data.ocorrencias || []);
        console.log('✅ Ocorrências carregadas:', data.ocorrencias?.length || 0);
      } else {
        console.log('⚠️ Nenhuma ocorrência local; buscando no backend...');
        await buscarDoBackend();
      }
    } catch (error) {
      console.error('❌ Erro ao carregar ocorrências:', error);
      setOcorrencias([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🌐 Buscar ocorrências do backend
  const buscarDoBackend = async () => {
    try {
      const token = localStorage.getItem('@auth_token');
      const resp = await fetch('http://localhost:3333/api/ocorrencias', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!resp.ok) {
        console.warn('⚠️ Falha ao buscar backend, status:', resp.status);
        setOcorrencias([]);
        return;
      }

      const data = await resp.json();
      const lista = Array.isArray(data) ? data : data.data || [];
      setOcorrencias(lista);
      await salvarOcorrencias(lista);
      console.log('✅ Ocorrências carregadas do backend:', lista.length);
    } catch (err) {
      console.error('❌ Erro ao buscar backend:', err);
      setOcorrencias([]);
    }
  };

  // 💾 Salvar ocorrências no localStorage
  const salvarOcorrencias = async (novasOcorrencias) => {
    try {
      const data = {
        ocorrencias: novasOcorrencias,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(OCORRENCIAS_STORAGE_KEY, JSON.stringify(data));
      console.log('💾 Ocorrências salvas no localStorage:', novasOcorrencias.length);
    } catch (error) {
      console.error('❌ Erro ao salvar ocorrências:', error);
      throw error;
    }
  };

// ➕ Adicionar nova ocorrência
const adicionarOcorrencia = async (ocorrencia) => {
  try {
    const novaOcorrencia = {
      ...ocorrencia,
      id: ocorrencia.id || `ocorrencia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dataRegistro: new Date().toISOString(),
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      sincronizado: false,
      fotos: ocorrencia.fotos || (ocorrencia.foto ? [ocorrencia.foto.uri] : [])
    };
    
    console.log('➕ Adicionando ocorrência:', novaOcorrencia.id);
    
    // 🚀 ENVIAR PARA O BACKEND
    try {
      const token = localStorage.getItem('@auth_token');
      
      const response = await fetch('http://localhost:3333/api/ocorrencias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(novaOcorrencia)
      });
      
      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status}`);
      }
      
      const ocorrenciaDoBackend = await response.json();
      console.log('✅ Ocorrência enviada para o backend:', ocorrenciaDoBackend);
      
      novaOcorrencia.id = ocorrenciaDoBackend.id || novaOcorrencia.id;
      novaOcorrencia.sincronizado = true;
    } catch (backendError) {
      console.warn('⚠️ Não foi possível enviar para o backend:', backendError.message);
    }
    
    const novasOcorrencias = [novaOcorrencia, ...ocorrencias];
    setOcorrencias(novasOcorrencias);
    
    await salvarOcorrencias(novasOcorrencias);
    
    console.log('✅ Ocorrência adicionada com sucesso!');
    return novaOcorrencia;
  } catch (error) {
    console.error('❌ Erro ao adicionar ocorrência:', error);
    throw error;
  }
}

  // 🗑️ Remover ocorrência
  const removerOcorrencia = async (id) => {
    try {
      console.log('🗑️ Removendo ocorrência:', id);
      
      const novasOcorrencias = ocorrencias.filter(oc => oc.id !== id);
      setOcorrencias(novasOcorrencias);
      
      await salvarOcorrencias(novasOcorrencias);
      
      console.log('✅ Ocorrência removida com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao remover ocorrência:', error);
      return { success: false, message: 'Erro ao remover ocorrência' };
    }
  };

  // ✏️ Editar ocorrência
  const editarOcorrencia = async (id, dadosAtualizados) => {
    try {
      console.log('✏️ Editando ocorrência:', id);
      
      const indice = ocorrencias.findIndex(oc => oc.id === id);
      
      if (indice === -1) {
        return { success: false, message: 'Ocorrência não encontrada' };
      }
      
      const novasOcorrencias = [...ocorrencias];
      novasOcorrencias[indice] = {
        ...novasOcorrencias[indice],
        ...dadosAtualizados,
        dataAtualizacao: new Date().toISOString(),
      };
      
      setOcorrencias(novasOcorrencias);
      await salvarOcorrencias(novasOcorrencias);
      
      console.log('✅ Ocorrência editada com sucesso!');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao editar ocorrência:', error);
      return { success: false, message: 'Erro ao editar ocorrência' };
    }
  };

  // ✏️ Atualizar ocorrência (mantém compatibilidade)
  const atualizarOcorrencia = async (id, dadosAtualizados) => {
    return await editarOcorrencia(id, dadosAtualizados);
  };

  // 🔄 Recarregar ocorrências com pull-to-refresh
  const atualizarDados = async () => {
    setRefreshing(true);
    await carregarOcorrencias();
  };

  // 🔄 Recarregar ocorrências
  const recarregarOcorrencias = async () => {
    // força buscar do backend e salvar em cache
    await buscarDoBackend();
  };

  const value = {
    ocorrencias,
    loading,
    refreshing,
    adicionarOcorrencia,
    removerOcorrencia,
    editarOcorrencia,
    atualizarOcorrencia,
    recarregarOcorrencias,
    carregarOcorrencias,
    atualizarDados,
  };

  return (
    <OcorrenciasContext.Provider value={value}>
      {children}
    </OcorrenciasContext.Provider>
  );
};

export function useOcorrenciasContext() {
  const context = useContext(OcorrenciasContext);
  if (!context) {
    throw new Error('useOcorrenciasContext deve ser usado dentro de OcorrenciasProvider');
  }
  return context;
}

export default OcorrenciasProvider;

