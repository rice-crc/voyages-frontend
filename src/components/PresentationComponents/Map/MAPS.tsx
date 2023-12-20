import { MapContainer } from 'react-leaflet';

import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { LeafletMap } from './LeafletMap';
import { useRef, useState } from 'react';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForEnslaved, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { createTopPositionEnslavedPage } from '@/utils/functions/createTopPositionEnslavedPage';

function MAPS() {

  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const mapRef = useRef(null);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage
  );
  const { styleName: styleNameRoute } = usePageRouter()

  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

  let topPositionPage = 0;
  if (checkPagesRouteForVoyages(styleNameRoute!)) {
    topPositionPage = createTopPositionVoyages(currentPage, inputSearchValue!);
  } else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
    topPositionPage = createTopPositionEnslavedPage(currentEnslavedPage, inputSearchValue!)
  }
  const paddingTop = currentEnslavedPage === 3 || styleNameRoute === 'map' ? 0 : topPositionPage

  return (
    <div style={{ paddingTop: paddingTop }} className='mobile-responsive-map'>
      <MapContainer
        style={{ width: styleNameRoute === 'map' ? "100%" : '95%' }}
        className="map-container"
        ref={mapRef}
      >
        <LeafletMap zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      </MapContainer>
    </div>
  );
}

export default MAPS;
