
const STORAGE_KEY = 'rota-mais-historico'

export function getRouteHistory() {
  try {
    const history = localStorage.getItem(STORAGE_KEY)

    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    return []
  }
}

export function saveRouteHistory(route) {
  try {
    const history = getRouteHistory()

    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      origem: route.origem,
      destino: route.destino,
      transporte: route.transporte,
      createdAt: new Date().toISOString(),
    }

    const updatedHistory = [
      newEntry,
      ...history.filter(
        (item) =>
          item.origem !== newEntry.origem ||
          item.destino !== newEntry.destino ||
          item.transporte !== newEntry.transporte
      ),
    ].slice(0, 10)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedHistory)
    )

    return updatedHistory
  } catch (error) {
    console.error('Erro ao salvar histórico:', error)
    return getRouteHistory()
  }
}

export function clearRouteHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Erro ao limpar histórico:', error)
  }
}

export function deleteRouteHistoryItem(id) {
  try {
    const history = getRouteHistory()
    const updatedHistory = history.filter(
      (item) => item.id !== id
    )

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedHistory)
    )

    return updatedHistory
  } catch (error) {
    console.error('Erro ao excluir rota do histórico:', error)
    return getRouteHistory()
  }
}
