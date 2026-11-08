import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './UserLocationsMap.css';

function FitLocations({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 1) {
      map.setView(locations[0].position, 12);
    } else if (locations.length > 1) {
      map.fitBounds(locations.map((location) => location.position), {
        padding: [36, 36],
        maxZoom: 12,
      });
    }
  }, [locations, map]);

  return null;
}

function UserLocationsMap({ users }) {
  const locations = users
    .filter((user) => user.latitude !== null && user.latitude !== undefined
      && user.longitude !== null && user.longitude !== undefined)
    .map((user) => ({
      ...user,
      position: [Number(user.latitude), Number(user.longitude)],
    }))
    .filter((user) => user.position.every(Number.isFinite));

  return (
    <section className="user-locations" aria-label="Mapa de localização dos usuários">
      <div className="user-locations-heading">
        <h2>Localização dos usuários</h2>
        <span>{locations.length} de {users.length} com endereço localizado</span>
      </div>
      <MapContainer
        className="user-locations-map"
        center={[-14.235, -51.9253]}
        zoom={4}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitLocations locations={locations} />
        {locations.map((user) => (
          <CircleMarker
            key={user.id}
            center={user.position}
            radius={9}
            pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#c34b32', fillOpacity: 0.94 }}
          >
            <Popup>
              <strong>{user.nome}</strong>
              <br />
              {user.endereco}
              {user.precisaoLocalizacao && user.precisaoLocalizacao !== 'endereco' && (
                <>
                  <br />
                  <small>
                    Posição aproximada por {user.precisaoLocalizacao === 'bairro' ? 'bairro' : 'cidade'}
                  </small>
                </>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      {locations.length === 0 && (
        <div className="user-locations-empty">
          Nenhum endereço localizado. Preencha o endereço do usuário para adicionar um marcador.
        </div>
      )}
      <p className="user-locations-attribution">Endereços convertidos em coordenadas pelo Nominatim.</p>
    </section>
  );
}

export default UserLocationsMap;