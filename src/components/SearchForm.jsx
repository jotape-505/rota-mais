
import { useState } from 'react'

function SearchForm({ onCalculate, loading }) {
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null)
  const [origem, setOrigem] = useState('')
  const [mensagemLocalizacao, setMensagemLocalizacao] = useState('')
  const [buscandoLocalizacao, setBuscandoLocalizacao] = useState(false)

const handleLocation = () => {
  if (buscandoLocalizacao || loading) return
  setBuscandoLocalizacao(true)
    if (!navigator.geolocation) {
  setMensagemLocalizacao(
    'Seu navegador não oferece suporte à localização.'
  )
  setBuscandoLocalizacao(false)
  return
}

    setMensagemLocalizacao('Obtendo sua localização...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
	  setBuscandoLocalizacao(false)
  
        const coordenadas = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        console.log('Latitude:', position.coords.latitude)
        console.log('Longitude:', position.coords.longitude)
        console.log(
          'Precisão estimada (metros):',
          position.coords.accuracy
        )
        setLocalizacaoAtual(coordenadas)

        setOrigem(
          `${coordenadas.latitude}, ${coordenadas.longitude}`
        )

        setMensagemLocalizacao(
          'Localização obtida com sucesso!'
        )
      },
      (error) => {
        setBuscandoLocalizacao(false)
        
        console.error(
          'Erro de geolocalização:',
          error.code,
          error.message
        )

        const mensagens = {
          1: 'Permissão de localização negada. Verifique as permissões do navegador.',
          2: 'Não foi possível determinar sua localização. Tente novamente.',
          3: 'A localização demorou muito para responder. Tente novamente.',
        }

        setMensagemLocalizacao(
          mensagens[error.code] ||
          'Não foi possível obter sua localização.'
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const origemDigitada = formData.get('origem')?.trim()
    const destino = formData.get('destino')?.trim()
    const transporte = formData.get('transporte')

    if (!origemDigitada || !destino) {
      return
    }

    if (
      origemDigitada.toLowerCase() === destino.toLowerCase()
    ) {
      setMensagemLocalizacao(
        'A origem e o destino devem ser diferentes.'
      )
      return
    }

    onCalculate({
      origem: origemDigitada,
      destino,
      transporte,
      localizacaoAtual:
        origemDigitada === origem && localizacaoAtual
          ? localizacaoAtual
          : null,
    })
  }

  const handleOrigemChange = (event) => {
    setOrigem(event.target.value)
    setLocalizacaoAtual(null)
    setMensagemLocalizacao('')
  }

  return (
    <form
      className="search-section"
      onSubmit={handleSubmit}
    >
      <h1>Encontre sua rota</h1>

      <p className="subtitle">
        Informe o ponto de partida e o destino para encontrar as melhores rotas.
      </p>

      <div className="input-group">
        <label htmlFor="origem">📍 Partida</label>

        <input
          id="origem"
          name="origem"
          type="text"
          placeholder="Digite o endereço de partida"
          value={origem}
          onChange={handleOrigemChange}
          required
          disabled={loading}
        />

       <button
	  type="button"
	  onClick={handleLocation}
	  disabled={loading || buscandoLocalizacao}
	>
	  {buscandoLocalizacao
	    ? '⏳ Obtendo localização...'
	    : '📡 Usar minha localização atual'}
	</button>

        {mensagemLocalizacao && (
          <p role="status" aria-live="polite">
            {mensagemLocalizacao}
          </p>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="destino">🏁 Destino</label>

        <input
          id="destino"
          name="destino"
          type="text"
          placeholder="Digite o endereço de chegada"
          required
          disabled={loading}
        />
      </div>

      <div className="input-group">
        <label htmlFor="transporte">
          🚦 Meio de transporte
        </label>

        <select
          id="transporte"
          name="transporte"
          defaultValue="carro"
          disabled={loading}
        >
          <option value="carro">🚗 Carro</option>
          <option value="bicicleta">🚲 Bicicleta</option>
          <option value="caminhada">🚶 Caminhada</option>
        </select>
      </div>

      <button
        className="route-button"
        type="submit"
        disabled={loading}
      >
        {loading
          ? 'Calculando rota...'
          : '🔍 Calcular rota'}
      </button>
    </form>
  )
}

export default SearchForm
