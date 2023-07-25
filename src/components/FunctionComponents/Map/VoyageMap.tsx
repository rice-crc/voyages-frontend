import { MapContainer } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { VOYAGESPAGE } from '@/share/CONST_DATA';
import { LeafletMap } from './LeafletMap';

function VoyagesMaps() {
  const location = useLocation();
  const pathNameArr = location.pathname.split('/');
  const pathName = pathNameArr[pathNameArr.length - 1];
  const bgColor = pathName === VOYAGESPAGE ? 'rgb(147, 208, 203)' : '#b29493';
  return (
    <MapContainer
      className="map-container"
      style={{ backgroundColor: bgColor }}
    >
      <LeafletMap />
    </MapContainer>
  );
}

export default VoyagesMaps;
