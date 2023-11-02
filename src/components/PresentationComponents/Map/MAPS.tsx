import { MapContainer } from 'react-leaflet';

import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { LeafletMap } from './LeafletMap';
import { useRef, useState } from 'react';

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
      >
        <LeafletMap zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      </MapContainer>
    </div>
  );
}

export default MAPS;
