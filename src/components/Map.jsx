
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from 'react-leaflet'

import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function MapUpdater({ route, originCoordinates, destinationCoordinates }) {
  const map = useMap()

  useEffect(() => {
    if (route?.geometry?.coordinates?.length) {
      const bounds = L.latLngBounds(
        route.geometry.coordinates.map(([longitude, latitude]) => [
          latitude,
          longitude,
        ])
      )

      map.fitBounds(bounds, { padding: [40, 40] })
    } else if (originCoordinates && destinationCoordinates) {
      map.fitBounds(
        [
          [originCoordinates.latitude, originCoordinates.longitude],
          [destinationCoordinates.latitude, destinationCoordinates.longitude],
        ],
        { padding: [40, 40] }
      )
    } else if (originCoordinates) {
      map.setView(
        [originCoordinates.latitude, originCoordinates.longitude],
        14
      )
    }
  }, [map, route, originCoordinates, destinationCoordinates])

  return null
}

function Map({
  route,
  routes = [],
  originCoordinates,
  destinationCoordinates,
}) {
  const initialPosition = [-19.9167, -43.9345]

  const getPositions = (item) =>
    item?.geometry?.coordinates?.map(
      ([longitude, latitude]) => [latitude, longitude]
    ) || []

  return (
    <MapContainer
      center={initialPosition}
      zoom={12}
      scrollWheelZoom={true}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater
        route={route}
        originCoordinates={originCoordinates}
        destinationCoordinates={destinationCoordinates}
      />

      {originCoordinates && (
        <Marker
          position={[
            originCoordinates.latitude,
            originCoordinates.longitude,
          ]}
        >
          <Popup>📍 Ponto de partida</Popup>
        </Marker>
      )}

      {destinationCoordinates && (
        <Marker
          position={[
            destinationCoordinates.latitude,
            destinationCoordinates.longitude,
          ]}
        >
          <Popup>🏁 Destino</Popup>
        </Marker>
      )}

      {routes.map((item, index) => {
        const positions = getPositions(item)

        if (positions.length === 0) return null

        const isSelected = item.id === route?.id

        return (
          <Polyline
            key={item.id ?? index}
            positions={positions}
            pathOptions={{
              color: isSelected ? '#2563eb' : '#64748b',
              weight: isSelected ? 6 : 4,
              opacity: isSelected ? 0.9 : 0.55,
            }}
          />
        )
      })}
    </MapContainer>
  )
}

export default Map