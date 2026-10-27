
import { useEffect, useState } from 'react'

import {
  getRouteHistory,
  clearRouteHistory,
  deleteRouteHistoryItem,
} from './routeHistory'
import './RouteHistory.css'

function RouteHistory({ onSelectRoute }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getRouteHistory())
  }, [])

  const handleClearHistory = () => {
    clearRouteHistory()
    setHistory([])
  }

const handleDeleteRoute = (id) => {
  const updatedHistory = deleteRouteHistoryItem(id)
  setHistory(updatedHistory)
}


  if (history.length === 0) {
    return (
      <section className="route-history">
        <h2>Histórico de rotas</h2>
        <p>Nenhuma rota pesquisada ainda.</p>
      </section>
    )
  }

  return (
    <section className="route-history">
      <div className="route-history-header">
        <h2>Histórico de rotas</h2>

        <button type="button" onClick={handleClearHistory}>
          Limpar histórico
        </button>
      </div>

      <ul className="route-history-list">
        {history.map((item) => (
          <li key={item.id} className="route-history-item">
            <div>
              <strong>{item.origem}</strong>
              <span className="route-history-arrow"> → </span>
              <strong>{item.destino}</strong>

              <p>
                Transporte: {item.transporte}
              </p>

              <small>
                {new Date(item.createdAt).toLocaleString('pt-BR')}
              </small>
            </div>

           
            <div className="route-history-actions">
            <button
                type="button"
                onClick={() => onSelectRoute(item)}
            >
                Reutilizar
            </button>

            <button
                type="button"
                className="delete-route-button"
                onClick={() => handleDeleteRoute(item.id)}
                aria-label={`Excluir rota de ${item.origem} para ${item.destino}`}
            >
                Excluir
            </button>
            </div>

          </li>
        ))}
      </ul>
    </section>
  )
}

export default RouteHistory
