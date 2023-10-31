import { MapContainer } from 'react-leaflet';

import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { LeafletMap } from './LeafletMap';
import { useRef, useState } from 'react';
import { MAP_CENTER, MAXIMUM_ZOOM, MINIMUM_ZOOM } from '@/share/CONST_DATA';

function MAPS() {
  const { isFilter } = useSelector((state: RootState) => state.getFilter);
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const mapRef = useRef(null);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const topPosition = createTopPositionVoyages(currentPage, isFilter);

  return (
    <div style={{ paddingTop: currentEnslavedPage === 3 ? 0 : topPosition }}>
      <MapContainer
        className="map-container"
        ref={mapRef}
      // center={MAP_CENTER}
      // zoom={zoomLevel}
      // maxZoom={MAXIMUM_ZOOM}
      // minZoom={MINIMUM_ZOOM}
      // attributionControl={false}
      // scrollWheelZoom={true}
      // zoomControl={true}
      >
        <LeafletMap zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      </MapContainer>
    </div>
  );
}

export default MAPS;
