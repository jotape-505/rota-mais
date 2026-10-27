
import axios from 'axios'

const routingProfiles = {
  carro: 'driving',
  bicicleta: 'biking',
  caminhada: 'foot',
}

async function getRoute(origin, destination, transporte = 'carro') {
  try {
    const profile = routingProfiles[transporte]

    if (!profile) {
      throw new Error('Meio de transporte inválido.')
    }

    const baseUrl =
      profile === 'driving'
        ? 'https://router.project-osrm.org'
        : 'https://routing.openstreetmap.de/routed-' +
          profile.replace('biking', 'bike') 

    const response = await axios.get(
      `${baseUrl}/route/v1/${profile}/` +
        `${origin.longitude},${origin.latitude};` +
        `${destination.longitude},${destination.latitude}`,
      {
        params: {
          overview: 'full',
          geometries: 'geojson',
          alternatives: true,
          steps: false,
        },
      }
    )

    if (
      response.data.code !== 'Ok' ||
      !response.data.routes?.length
    ) {
      return []
    }

    return response.data.routes.map((route) => ({
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry,
    }))
  } catch (error) {
    console.error('Erro ao calcular rotas:', error)
    throw error
  }
}

export default getRoute