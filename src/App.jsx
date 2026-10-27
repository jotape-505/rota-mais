import { useState } from "react";
import "./App.css";

import RouteCard from "./components/RouteCard";
import SearchForm from './components/SearchForm'
import Map from './components/Map'
import geocodeAddress from './components/Geocoding'
import getRoute from './components/Routing'
import { saveRouteHistory } from './routeHistory'
import RouteHistory from './RouteHistory'
import Login from './components/Login'



const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }

  return `${(meters / 1000).toFixed(1)} km`
}

const formatDuration = (seconds) => {
  const minutes = Math.round(seconds / 60)

  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return `${hours}h ${remainingMinutes}min`
}

function App() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [search, setSearch] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [usuario, setUsuario] = useState(() => {
  const usuarioSalvo = localStorage.getItem('rota_usuario')

  return usuarioSalvo ? JSON.parse(usuarioSalvo) : null
}) 
 const [perfilAberto, setPerfilAberto] = useState(false)

  const [originCoordinates, setOriginCoordinates] = useState(null)
  const [destinationCoordinates, setDestinationCoordinates] = useState(null)

  const selectedRouteData = selectedRoute || routeData?.[0]

     
const handleCalculate = async (data) => {
  setLoading(true)
  setErrorMessage('')
  setSearch(data)
  setSelectedRoute(null)
  setRouteData([])
  setOriginCoordinates(null)
  setDestinationCoordinates(null)

  
try {
  const origem = data.localizacaoAtual
    ? {
        latitude: data.localizacaoAtual.latitude,
        longitude: data.localizacaoAtual.longitude,
      }
    : await geocodeAddress(data.origem)

  const destino = await geocodeAddress(data.destino)

    if (!origem || !destino) {
      setErrorMessage(
        'Não foi possível localizar um dos endereços. Confira os dados e tente novamente.'
      )
      return
    }

    setOriginCoordinates(origem)
    setDestinationCoordinates(destino)

    const routes = await getRoute(
      origem,
      destino,
      data.transporte
    )

    if (!routes || routes.length === 0) {
      setErrorMessage(
        'Não encontramos uma rota entre esses locais. Tente outros endereços.'
      )
      return
    }

   
      const formattedRoutes = routes.map((route, index) => ({
        ...route,
        id: index + 1,
        name: `Rota ${index + 1}`,
      }))


    setRouteData(formattedRoutes)
    setSelectedRoute(formattedRoutes[0])

    saveRouteHistory(data)

  } catch (error) {
  console.error('Erro ao calcular a rota:', error)
  console.error('Detalhes:', error.response?.data || error.message)

  setErrorMessage(
    error.response?.data?.message ||
    error.message ||
    'Ocorreu um erro ao consultar o serviço de rotas.'
  )
} finally {
  setLoading(false)
}
}
 
const routes = (routeData || []).map((route, index) => ({
  ...route,
  id: route.id ?? index + 1,
  name: route.name ?? `Rota ${index + 1}`,
  distance: formatDistance(route.distance),
  time: formatDuration(route.duration),
}))

if (!usuario) {
  return (
    <Login
      onLogin={(dadosUsuario) => {
        localStorage.setItem(
          'rota_usuario',
          JSON.stringify(dadosUsuario)
        )

        setUsuario(dadosUsuario)
      }}
    />
  )
}

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">ROTA+</div>

      <div className="user">
  <button
    type="button"
    className="profile-button"
    onClick={() => setPerfilAberto(!perfilAberto)}
  >
    👤 {usuario?.email || 'Usuário'}
  </button>

  
<button
  type="button"
  onClick={() => {
    localStorage.removeItem('rota_usuario')
    setUsuario(null)
    setPerfilAberto(false)
  }}
  className="logout-button"
>
  Sair
</button>

</div>
{perfilAberto && (
  <div className="profile-panel">
    <h3>Meu perfil</h3>

    <div className="profile-avatar">👤</div>

    <p className="profile-label">E-mail da conta</p>
    <p className="profile-email">{usuario?.email}</p>

    <p className="profile-note">
      Seu perfil está no modo demonstrativo.
    </p>

    <button
      type="button"
      className="profile-close"
      onClick={() => setPerfilAberto(false)}
    >
      Fechar perfil
    </button>
  </div>
)}
      </header>

      <main className="main-content">

       <SearchForm
        onCalculate={handleCalculate}
        loading={loading}
      />

      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}

      {search && (
        <div className="search-summary">
          <h2>Pesquisa atual</h2>

          <div className="search-summary-content">
            {selectedRouteData && (
      <div className="route-info">

    <div className="route-info-item">
      <span>📏 Distância</span>
     <strong>{selectedRouteData?.distance}</strong>
    </div>

    <div className="route-info-item">
      <span>⏱️ Tempo estimado</span>
     <strong>{selectedRouteData?.time}</strong>
    </div>

  </div>
)}
            <div>
              <span>📍 Partida</span>
              <strong>{search.origem}</strong>
            </div>

            <div>
              <span>🏁 Destino</span>
              <strong>{search.destino}</strong>
            </div>
          </div>
        </div>
      )}

        <section className="route-area">
              <div className="map-container">
     <Map
      route={selectedRouteData}
      routes={routes}
      originCoordinates={originCoordinates}
      destinationCoordinates={destinationCoordinates}
    />
      </div>

          <aside className="routes-panel">
            <h2>Rotas disponíveis</h2>

                
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          selected={selectedRoute?.id === route.id}
          onSelect={() => setSelectedRoute(route)}
          transporte={search?.transporte || 'carro'}
        />
      ))}

            {selectedRouteData && (
              <div className="route-details">
                <h2>Rota selecionada</h2>

                {(() => {
                 const route = selectedRouteData;

                  const formatDistance = (meters) => {
                if (meters < 1000) {
                  return `${Math.round(meters)} m`
                }

                return `${(meters / 1000).toFixed(1)} km`
              }

              const formatDuration = (seconds) => {
                const minutes = Math.round(seconds / 60)

                if (minutes < 60) {
                  return `${minutes} min`
                }

                const hours = Math.floor(minutes / 60)
                const remainingMinutes = minutes % 60
                
                return `${hours}h ${remainingMinutes}min`
              }
                  return (
                    <>
                      <h3>
                  {search?.transporte === 'bicicleta'
                    ? '🚲'
                    : search?.transporte === 'caminhada'
                      ? '🚶'
                      : '🚗'}{' '}
                  {route.name}
                </h3>

                      <div className="detail-item">
                        <span>📏 Distância</span>
                        <strong>{route.distance}</strong>
                      </div>

                      <div className="detail-item">
                        <span>⏱️ Tempo estimado</span>
                        <strong>{route.time}</strong>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </aside>
        
        </section>

       
        <RouteHistory
          onSelectRoute={(item) => {
            handleCalculate({
              origem: item.origem,
              destino: item.destino,
              transporte: item.transporte,
            })
          }}
        />

      </main>

    </div>
  );
}

export default App
