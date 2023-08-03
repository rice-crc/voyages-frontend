import { MapContainer } from 'react-leaflet';
import { LeafletMap } from './LeafletMap';

function VoyagesMaps() {
  return (
    <MapContainer className="map-container">
      <LeafletMap />
    </MapContainer>
  );
}

export default VoyagesMaps;
