import axios from 'axios'

async function geocodeAddress(address) {
  try {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          q: address,
          format: 'json',
          limit: 1,
        },
      }
    )

    if (response.data.length === 0) {
      return null
    }

    const result = response.data[0]

    return {
      latitude: Number(result.lat),
      longitude: Number(result.lon),
      displayName: result.display_name,
    }
  } catch (error) {
    console.error('Erro ao buscar endereço:', error)
    return null
  }
}

export default geocodeAddress