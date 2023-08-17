import { MapContainer } from 'react-leaflet';
import { LeafletMap } from './LeafletMap';

function MAPS() {
  return (
    <MapContainer className="map-container">
      <LeafletMap />
    </MapContainer>
  );
}

export default MAPS;
