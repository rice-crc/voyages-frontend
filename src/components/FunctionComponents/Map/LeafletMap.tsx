import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMapEvents,
  useMapEvent,
} from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoyagesMap } from '@/fetchAPI/voyagesApi/fetchVoyagesMap';
import {
  Dispositions,
  NodeAggroutes,
  Originations,
  Transportation,
} from '@/share/InterfaceTypesMap';
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
  VOYAGESPAGE,
  mappingSpecialists,
  mappingSpecialistsCountries,
  mappingSpecialistsRivers,
} from '@/share/CONST_DATA';
import PolylineEnslavedMap from './PolylineMap';
import NodeMarkerEnslavedMap from '../../PastPeople/Enslaved/NodeMarkerEnslavedMap';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { fetchEnslavedMap } from '@/fetchAPI/pastEnslavedApi/fetchEnslavedMap';
import { getMapBackgroundColor } from '@/utils/functions/getMapBackgroundColor';

export const LeafletMap = () => {
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const pathNameArr = location.pathname.split('/');
  const pathName = pathNameArr[1];
  const [nodesData, setNodesData] = useState<NodeAggroutes[]>([]);
  const [transportation, setTransportation] = useState<Transportation[]>([]);
  const [disposition, setDisposition] = useState<Dispositions[]>([]);
  const [origination, setOrigination] = useState<Originations[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(3);
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

  const mapRef = useRef(null);
  function HandleZoomEvent() {
    const map = useMapEvent('zoomend', () => {
      const newZoom = map.getZoom();
      setZoomLevel(newZoom);
    });
    return null;
  }

  let subscribed = true;
  const mapEvents = useMapEvents({
    zoomend: () => {
      console.log(mapEvents.getZoom());
      setZoomLevel(mapEvents.getZoom());
    },
  });

  const fetchData = async () => {
    setLoading(true);
    const newFormData: FormData = new FormData();
    if (zoomLevel <= 6) {
      newFormData.append('zoomlevel', 'region');
    }
    if (zoomLevel > 6) {
      newFormData.append('zoomlevel', 'place');
    }
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

    if (subscribed) {
      let response;
      if (pathName === VOYAGESPAGE) {
        response = await dispatch(fetchVoyagesMap(newFormData)).unwrap();
      } else if (pathName === PASTHOMEPAGE) {
        response = await dispatch(fetchEnslavedMap(newFormData)).unwrap();
      }

      if (response) {
        const { nodes, edges } = response;
        const { transportation, disposition, origination } = edges;
        try {
          if (zoomLevel < 6) {
            localStorage.setItem('nodesData', JSON.stringify(nodes));
            localStorage.setItem(
              'transportation',
              JSON.stringify(transportation)
            );
            localStorage.setItem('disposition', JSON.stringify(disposition));
            localStorage.setItem('origination', JSON.stringify(origination));
          }

          setNodesData(nodes);
          setTransportation(transportation);
          setDisposition(disposition);
          setOrigination(origination);
          setLoading(false);
        } catch (error) {
          console.log('error', error);
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      subscribed = false;
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
  ]);

  useEffect(() => {
    const savedNodesData = localStorage.getItem('nodesData');
    const savedTransportation = localStorage.getItem('transportation');
    if (savedNodesData && savedTransportation) {
      setNodesData(JSON.parse(savedNodesData));
      setTransportation(JSON.parse(savedTransportation));
    }
    if (zoomLevel > 6) {
      fetchData();
    }
    return () => {
      subscribed = false;
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
          fadeAnimation
          zoom={zoomLevel}
          className="lealfetMap-container"
          maxZoom={MAXIMUM_ZOOM}
          minZoom={MINIMUM_ZOOM}
          attributionControl={false}
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
          </LayersControl>
          <PolylineEnslavedMap
            origination={origination}
            disposition={disposition}
            transportation={transportation}
            nodesData={nodesData}
          />
          <NodeMarkerEnslavedMap nodesData={nodesData} />
        </MapContainer>
      )}
    </div>
  );
};
