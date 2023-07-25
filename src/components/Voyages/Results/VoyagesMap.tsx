import { MapContainer } from 'react-leaflet';
import { LeafletMap } from './Map/LeafletMap';

function VoyagesMap() {
  return (
    <MapContainer className="map-container">
      <LeafletMap />
    </MapContainer>
  );
}

export default VoyagesMap;
