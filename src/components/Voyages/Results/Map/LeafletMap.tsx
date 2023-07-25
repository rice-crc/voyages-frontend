import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMapEvents,
  useMapEvent,
} from 'react-leaflet';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoyagesMap } from '@/fetchAPI/voyagesApi/fetchVoyagesMap';
import {
  NodeAggroutes,
  PathOptions,
  Transportation,
} from '@/share/InterfaceTypesMap';
import '@/style/map.scss';
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import {
  MAP_CENTER,
  MAXIMUM_ZOOM,
  MINIMUM_ZOOM,
  mappingSpecialists,
  mappingSpecialistsCountries,
  mappingSpecialistsRivers,
} from '@/share/CONST_DATA';
import PolylineTransportationMap from './PolylineTransportationMap';
import NodeMarkerMap from './NodeMarkerMap';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';

export const LeafletMap = () => {
  const dispatch: AppDispatch = useDispatch();
  const [nodesData, setNodesData] = useState<NodeAggroutes[]>([]);
  const [transportation, setTransportation] = useState<Transportation[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [pathOptions, setPathOptions] = useState<PathOptions>({
    color: '#e286f1',
  });
  const {
    rangeSliderMinMax: rang,
    varName,
    isChange,
  } = useSelector((state: RootState) => state.rangeSlider as RangeSliderState);
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
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
    if (isChange && rang[varName] && currentPage === 7) {
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
      const response = await dispatch(fetchVoyagesMap(newFormData)).unwrap();
      if (response) {
        const { nodes, edges } = response;
        const { transportation } = edges;
        try {
          // Save the fetched data in localStorage
          if (zoomLevel < 6) {
            localStorage.setItem('nodesData', JSON.stringify(nodes));
            localStorage.setItem(
              'transportation',
              JSON.stringify(transportation)
            );
          }
          // Update the state with fetched data
          setNodesData(nodes);
          setTransportation(transportation);
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
  }, [rang, varName, isChange, autoCompleteValue, autoLabelName, currentPage]);

  // Effect to handle zoomLevel changes and check localStorage
  useEffect(() => {
    // Check if data is available in localStorage
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

  return loading ? (
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
      <PolylineTransportationMap
        transportation={transportation}
        nodesData={nodesData}
        pathOptions={pathOptions}
      />
      <NodeMarkerMap nodesData={nodesData} />
    </MapContainer>
  );
};
