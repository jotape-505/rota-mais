
function RouteCard({
  route,
  selected,
  onSelect,
  transporte = 'carro',
}) {
  const icones = {
    carro: '🚗',
    bicicleta: '🚲',
    caminhada: '🚶',
  }

  const icone = icones[transporte] || '📍'

  return (
    <div
      className={`route-card ${selected ? 'selected' : ''}`}
      aria-label={`${route.name}${selected ? ', rota selecionada' : ''}`}
    >
      <div className="route-card-info">
        <h3>
          <span aria-hidden="true">{icone}</span>{' '}
          {route.name}
          {selected && (
            <span className="route-selected-label">
              (Selecionada)
            </span>
          )}
        </h3>

        <p>
          <strong>Distância:</strong> {route.distance}
        </p>

        <p>
          <strong>Tempo estimado:</strong> {route.time}
        </p>
      </div>

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={
          selected
            ? `${route.name} já está selecionada`
            : `Selecionar ${route.name}`
        }
        disabled={selected}
      >
        {selected ? '✓ Rota selecionada' : 'Selecionar rota'}
      </button>
    </div>
  )
}

export default RouteCard
