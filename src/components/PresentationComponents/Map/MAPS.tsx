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
import { ENSLAVEDNODE, ENSLAVERSNODE, ESTIMATES, VOYAGESTYPE } from '@/share/CONST_DATA';
import { LeafletMapURL } from './LeafletMapURL';

function MAPComponents() {
  const dispatch: AppDispatch = useDispatch();
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const mapRef = useRef(null);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage
  );
  const { styleName: styleNameRoute, nodeTypeURL } = usePageRouter()


  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const { nameIdURL } = useSelector((state: RootState) => state.getFilter);

  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );

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

  const calassNameMap = (nameIdURL || styleNameRoute === ESTIMATES) ? 'mobile-responsive-map-ur' : 'mobile-responsive-map'

  return (
    <div className={calassNameMap}>
      <MapContainer
        style={{ width: (styleNameRoute === 'map' || styleNameRoute === ESTIMATES) ? "100%" : '95%' }}
        className="map-container"
        ref={mapRef}
      >
        {nameIdURL ? <LeafletMapURL zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} /> : <LeafletMap zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
      </MapContainer>
    </div>
  );
}

export default MAPComponents;
