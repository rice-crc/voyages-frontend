import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMapEvents,
} from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoyagesMap } from '@/fetchAPI/voyagesApi/fetchVoyagesMap';
import '@/style/map.scss';
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  RangeSliderState,
  TYPESOFDATASET,
} from '@/share/InterfaceTypes';
import {
  PASTHOMEPAGE,
  MAP_CENTER,
  MAXIMUM_ZOOM,
  MINIMUM_ZOOM,
  ZOOM_LEVEL_THRESHOLD,
  VOYAGESPAGE,
  mappingSpecialists,
  mappingSpecialistsCountries,
  mappingSpecialistsRivers,
} from '@/share/CONST_DATA';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { fetchEnslavedMap } from '@/fetchAPI/pastEnslavedApi/fetchEnslavedMap';
import { getMapBackgroundColor } from '@/utils/functions/getMapBackgroundColor';
import NodeCurvedLinesMap from './NodeCurvedLinesMap';
import {
  setDisposition,
  setNodesData,
  setOrigination,
  setTransportation,
} from '@/redux/getNodeEdgesAggroutesMapDataSlice';

export const LeafletMap = () => {
  const dispatch: AppDispatch = useDispatch();
  const mapRef = useRef(null);
  const location = useLocation();
  const pathNameArr = location.pathname.split('/');
  const pathName = pathNameArr[1];

  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const [isCallFetchData, setIsCallFetchData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { dataSetKey, dataSetValue, styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const {
    rangeSliderMinMax: rang,
    varName,
    isChange,
  } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { currentEnslavedPage } = useSelector(
    (state: RootState) => state.getScrollEnslavedPage
  );
  const { autoCompleteValue, autoLabelName, isChangeAuto } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  const { isChangeGeoTree, geoTreeValue, geoTreeSelectValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );
  const HandleZoomEvent = () => {
    const map = useMapEvents({
      zoomend: () => {
        const newZoomLevel = map.getZoom();
        setZoomLevel(newZoomLevel);
        if (newZoomLevel >= ZOOM_LEVEL_THRESHOLD) {
          setIsCallFetchData(true);
        } else {
          setIsCallFetchData(false);
        }
      },
    });
    return null;
  };

  const fetchData = async () => {
    setLoading(true);
    const newFormData = new FormData();
    newFormData.append('zoomlevel', isCallFetchData ? 'place' : 'region');
    // PASS dataSetKey only for intra-american / trans-atlantic / texas bound
    if (styleName !== TYPESOFDATASET.allVoyages) {
      for (const value of dataSetValue) {
        newFormData.append(dataSetKey, String(value));
      }
    }
    if (
      isChange &&
      rang[varName] &&
      currentPage === 7 &&
      pathName === VOYAGESPAGE
    ) {
      newFormData.append(varName, String(rang[varName][0]));
      newFormData.append(varName, String(rang[varName][1]));
    }
    if (
      isChange &&
      rang[varName] &&
      currentEnslavedPage === 3 &&
      pathName === PASTHOMEPAGE
    ) {
      newFormData.append(varName, String(rang[varName][0]));
      newFormData.append(varName, String(rang[varName][1]));
    }
    if (autoCompleteValue && varName && isChangeAuto) {
      for (let i = 0; i < autoLabelName.length; i++) {
        const label = autoLabelName[i];
        newFormData.append(varName, label);
      }
    }
    if (isChangeGeoTree && varName && geoTreeValue) {
      for (const value of geoTreeSelectValue) {
        newFormData.append(varName, value);
      }
    }
    let response;
    if (pathName === VOYAGESPAGE) {
      response = await dispatch(fetchVoyagesMap(newFormData)).unwrap();
    } else if (pathName === PASTHOMEPAGE) {
      response = await dispatch(fetchEnslavedMap(newFormData)).unwrap();
    }

    if (response) {
      setLoading(false);
      const { nodes, edges } = response;
      const { transportation, disposition, origination } = edges;
      try {
        if (zoomLevel < ZOOM_LEVEL_THRESHOLD) {
          localStorage.setItem('nodesData', JSON.stringify(nodes));
          localStorage.setItem(
            'transportation',
            JSON.stringify(transportation)
          );
        }

        dispatch(setNodesData(nodes));
        dispatch(setTransportation(transportation));
        dispatch(setDisposition(disposition));
        dispatch(setOrigination(origination));
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      dispatch(setNodesData([]));
      dispatch(setTransportation([]));
      dispatch(setDisposition([]));
      dispatch(setOrigination([]));
    };
  }, [
    rang,
    varName,
    isChange,
    autoCompleteValue,
    autoLabelName,
    currentPage,
    pathName,
    dataSetKey,
    dataSetValue,
    styleName,
    isCallFetchData,
    geoTreeValue,
  ]);

  useEffect(() => {
    const savedNodesData = localStorage.getItem('nodesData');
    const savedTransportation = localStorage.getItem('transportation');
    if (savedNodesData && savedTransportation) {
      setNodesData(JSON.parse(savedNodesData));
      setTransportation(JSON.parse(savedTransportation));
    }
    if (zoomLevel === MAXIMUM_ZOOM) {
      fetchData();
    }
    return () => {
      setNodesData([]);
    };
  }, [zoomLevel]);

  return (
    <div style={{ backgroundColor: getMapBackgroundColor(styleName) }}>
      {loading ? (
        <div className="loading-logo">
          <img src={LOADINGLOGO} />
        </div>
      ) : (
        <MapContainer
          ref={mapRef}
          center={MAP_CENTER}
          zoom={zoomLevel}
          className="lealfetMap-container"
          maxZoom={MAXIMUM_ZOOM}
          minZoom={MINIMUM_ZOOM}
          attributionControl={false}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <HandleZoomEvent />
          <TileLayer url={mappingSpecialists} />
          <LayersControl position="topright">
            <LayersControl.Overlay name="River">
              <TileLayer url={mappingSpecialistsRivers} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Modern Countries">
              <TileLayer url={mappingSpecialistsCountries} />
            </LayersControl.Overlay>
            {/*<LayersControl.Overlay checked name="Voyages">
              HOW TO ADD 
              <div>HOW TO ADD Component Here</div>
            </LayersControl.Overlay>*/}
          </LayersControl>
          <NodeCurvedLinesMap />

          {/* 
           ===== POLY Line without curve =====
          <PolylineMap />
          ===== POLY Line with curve =====
           <CurvedPolyLine />
          ===== NODE Marker =====
            <NodeMarkerMap/>
         */}
        </MapContainer>
      )}
    </div>
  );
};
