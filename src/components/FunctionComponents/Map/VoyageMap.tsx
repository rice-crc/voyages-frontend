import { MapContainer } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { LeafletMap } from './LeafletMap';
import { getMapBackgroundColor } from '@/utils/functions/getMapBackgroundColor';

function VoyagesMaps() {
  const location = useLocation();
  const pathNameArr = location.pathname.split('/');
  const pathName = pathNameArr[pathNameArr.length - 1];

  return (
    <MapContainer
      className="map-container"
      style={{ backgroundColor: getMapBackgroundColor(pathName) }}
    >
      <LeafletMap />
    </MapContainer>
  );
}

export default VoyagesMaps;
