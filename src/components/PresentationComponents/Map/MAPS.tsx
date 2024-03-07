import { MapContainer } from 'react-leaflet';

import { createTopPositionVoyages } from '@/utils/functions/createTopPositionVoyages';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { LeafletMap } from './LeafletMap';
import { useEffect, useRef, useState } from 'react';
import { usePageRouter } from '@/hooks/usePageRouter';
import { checkPagesRouteForEnslaved, checkPagesRouteForVoyages } from '@/utils/functions/checkPagesRoute';
import { createTopPositionEnslavedPage } from '@/utils/functions/createTopPositionEnslavedPage';
import { setVariableNameIdURL } from '@/redux/getFilterSlice';
import { ENSLAVEDNODE, ENSLAVERSNODE, VOYAGESTYPE } from '@/share/CONST_DATA';
import { LeafletMapURL } from './LeafletMapURL';

function VoyagesMaps() {
  const dispatch: AppDispatch = useDispatch();
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const mapRef = useRef(null);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage
  );
  const { styleName: styleNameRoute } = usePageRouter()

  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const { nameIdURL } = useSelector((state: RootState) => state.getFilter);
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const {
    nodeTypeURL,
  } = usePageRouter();
  useEffect(() => {
    if (nodeTypeURL === VOYAGESTYPE) {
      dispatch(setVariableNameIdURL('voyage_id'));
    } else if (nodeTypeURL === ENSLAVEDNODE) {
      dispatch(setVariableNameIdURL('enslaved_id'));
    } else if (nodeTypeURL === ENSLAVERSNODE) {
      dispatch(setVariableNameIdURL('voyage_enslavement_relations__relation_enslavers__enslaver_alias__identity__id'));

    }
  }, [])

  let topPositionPage = 0;
  if (checkPagesRouteForVoyages(styleNameRoute!)) {
    topPositionPage = createTopPositionVoyages(currentPage, inputSearchValue!);
  } else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
    topPositionPage = createTopPositionEnslavedPage(currentEnslavedPage, inputSearchValue!)
  }
  const paddingTop = currentEnslavedPage === 3 || styleNameRoute === 'map' ? 0 : topPositionPage

  return (
    <div className='mobile-responsive-map'>
      <MapContainer
        style={{ width: styleNameRoute === 'map' ? "100%" : '95%' }}
        className="map-container"
        ref={mapRef}
      >
        {nameIdURL ? <LeafletMapURL zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} /> : <LeafletMap zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
      </MapContainer>
    </div>
  );
}

export default VoyagesMaps;
