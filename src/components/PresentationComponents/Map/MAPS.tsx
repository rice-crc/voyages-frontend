import { MapContainer } from 'react-leaflet';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { LeafletMap } from './LeafletMap';
import { useEffect, useRef, useState } from 'react';
import { usePageRouter } from '@/hooks/usePageRouter';
import { setVariableNameIdURL } from '@/redux/getFilterSlice';
import {
  ENSLAVEDNODE,
  ENSLAVERSNODE,
  ESTIMATES,
  VOYAGESNODECLASS,
  VOYAGESTYPE,
} from '@/share/CONST_DATA';
import { LeafletMapURL } from './LeafletMapURL';

function MAPComponents() {
  const dispatch: AppDispatch = useDispatch();
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const mapRef = useRef(null);
  const {
    styleName: styleNameRoute,
    voyageURLID: ID,
    typeOfPathURL,
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
    } else if (nodeTypeURL === ENSLAVERSNODE && isUrLMap) {
      dispatch(
        setVariableNameIdURL(
          'voyage_enslavement_relations__relation_enslavers__enslaver_alias__identity__id'
        )
      );
    }
  }, [nameIdURL]);

  const calassNameMap =
    nameIdURL || styleNameRoute === ESTIMATES
      ? 'mobile-responsive-map-url'
      : 'mobile-responsive-map';
  return (
    <div className={calassNameMap}>
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
