import { useEffect, useRef, useState } from 'react';

import { MapContainer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import { usePageRouter } from '@/hooks/usePageRouter';
import { setVariableNameIdURL } from '@/redux/getFilterSlice';
import { AppDispatch, RootState } from '@/redux/store';
import {
  ENSLAVEDNODE,
  ENSLAVERSNODE,
  ESTIMATES,
  VOYAGESNODECLASS,
  VOYAGESTYPE,
  ENSALVERSTYLE,
  TRANSATLANTIC,
  INTRAAMERICAN,
  ALLVOYAGES,
} from '@/share/CONST_DATA';
import {
  checkPagesRouteForEnslaved,
  checkRouteForVoyages,
} from '@/utils/functions/checkPagesRoute';

import { LeafletMap } from './LeafletMap';
import { LeafletMapURL } from './LeafletMapURL';

function MAPComponents() {
  const dispatch: AppDispatch = useDispatch();
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const mapRef = useRef(null);
  const {
    styleName: styleNameRoute,
    voyageURLID: ID,
    nodeTypeURL,
  } = usePageRouter();

  const { nameIdURL } = useSelector((state: RootState) => state.getFilter);
  let isUrLMap = false;

  useEffect(() => {
    const NUMBER = '0123456789';

    for (const num of ID!) {
      if (NUMBER.includes(num)) {
        isUrLMap = true;
      }
    }

    if (
      (nodeTypeURL === VOYAGESTYPE || nodeTypeURL === VOYAGESNODECLASS) &&
      isUrLMap
    ) {
      dispatch(setVariableNameIdURL('voyage_id'));
    } else if (nodeTypeURL === ENSLAVEDNODE && isUrLMap) {
      dispatch(setVariableNameIdURL('enslaved_id'));
    } else if (
      nodeTypeURL === ENSLAVERSNODE ||
      (nodeTypeURL === ENSALVERSTYLE && isUrLMap)
    ) {
      dispatch(
        setVariableNameIdURL(
          'voyage_enslavement_relations__relation_enslavers__enslaver_alias__identity__id',
        ),
      );
    }
  }, [nameIdURL, ID, nodeTypeURL, dispatch]);

  let classNameMap = 'mobile-responsive-map';
  if (styleNameRoute === ESTIMATES) {
    classNameMap = 'mobile-responsive-map-url';
  } else if (
    styleNameRoute === TRANSATLANTIC ||
    styleNameRoute === INTRAAMERICAN ||
    styleNameRoute === ALLVOYAGES
  ) {
    classNameMap = 'mobile-responsive-voyages';
  } else if (checkPagesRouteForEnslaved(styleNameRoute!)) {
    classNameMap = 'mobile-responsive-map-enslaved';
  } else if (styleNameRoute === ID) {
    classNameMap = 'mobile-responsive-map-url';
  }

  return (
    <div className={classNameMap}>
      <MapContainer
        style={{
          width:
            styleNameRoute === 'map' || styleNameRoute === ESTIMATES
              ? '100%'
              : '94%',
        }}
        className="map-container"
        ref={mapRef}
      >
        {nameIdURL ? (
          <LeafletMapURL zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
        ) : (
          <LeafletMap zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
        )}
      </MapContainer>
    </div>
  );
}

export default MAPComponents;
