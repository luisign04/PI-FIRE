import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './ListaOcorrencias.css';

function ListaOcorrencias() {
  const navigate = useNavigate();
  const [ocorrencias, setOcorrencias] = useState([]);

  useEffect(() => {
    // Mock de dados
    const mock = [
      {
        id: 101,
        titulo: "Incêndio em São José",
        detalhe: "Próx ao galpão 02 do cais",
        data: "20/10",
        hora: "14:38",
        tipo: "Incêndio",
        registradoPor: "Sgt. Silva"
      },
      {
        id: 102,
        titulo: "Acidente em Getúlio Vargas",
        detalhe: "Em frente à faculdade",
        data: "19/10",
        hora: "13:12",
        tipo: "Resgate",
        registradoPor: "Cb. Mendes"
      },
      {
        id: 103,
        titulo: "Rua do Caririños",
        detalhe: "Cabo preso a árvore",
        data: "18/10",
        hora: "10:12",
        tipo: "Prevenção",
        registradoPor: "Ten. Costa"
      }
    ];
    setOcorrencias(mock);
  }, []);

  const handleEdit = (id) => {
    alert(`EDITAR OCORRÊNCIA: ID ${id}\nRedirecionando...`);
    // navigate(`/editar-ocorrencia/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Tem certeza que deseja DELETAR a ocorrência ID ${id}?`)) {
      return;
    }
    setOcorrencias(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="lista-ocorrencias-page">
      <Header title="Listagem de Ocorrências" />

      <Link to="/criar-ocorrencia" className="fab-button" title="Registrar Nova Ocorrência">
        <i className="fas fa-plus"></i>
      </Link>

      <main className="layout">
        <aside className="filtros">
          <h3>Filtros Rápidos</h3>
          <button className="chip">Data</button>
          <button className="chip">Horário</button>
          <button className="chip">Tipo</button>
          <button className="chip">Região</button>
          <button className="chip">Status</button>
        </aside>

        <section className="lista">
          <h2 className="titulo-lista">Todas as Ocorrências</h2>

          {ocorrencias.length === 0 ? (
            <div className="empty-message">Nenhuma ocorrência encontrada.</div>
          ) : (
            <ul className="ocorrencias">
              {ocorrencias.map(ocorrencia => (
                <li key={ocorrencia.id} className="item" data-id={ocorrencia.id}>
                  <div className="icone">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M13 3s-1 2-3 3c0 0 2-1 3-1 0 0-4 3-4 7a5 5 0 1 0 10 0c0-3-2-5-2-5s.5 2.5-1 4c0 0 .5-2.5-1-5-.5-1-1-2-1-3z"/>
                    </svg>
                  </div>
                  <div className="texto">
                    <div className="linha1">
                      <strong className="titulo">{ocorrencia.titulo}</strong>
                      <span className="hora">{ocorrencia.data} - {ocorrencia.hora}</span>
                    </div>
                    <div className="linha2">
                      <span className="detalhe">{ocorrencia.detalhe}</span>
                      <span className="badge">{ocorrencia.tipo}</span>
                    </div>
                    <div className="linha3">
                      <span className="registrado-por">
                        Registrado por: <strong>{ocorrencia.registradoPor}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="acoes">
                    <button
                      className="botao-editar"
                      onClick={() => handleEdit(ocorrencia.id)}
                      title="Editar Ocorrência"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/>
                      </svg>
                    </button>
                    <button
                      className="botao-deletar"
                      onClick={() => handleDelete(ocorrencia.id)}
                      title="Deletar Ocorrência"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default ListaOcorrencias;