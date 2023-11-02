import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoyagesMap } from '@/fetch/voyagesFetch/fetchVoyagesMap';
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
  PLACE,
  REGION,
  AFRICANORIGINS,
} from '@/share/CONST_DATA';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { fetchEnslavedMap } from '@/fetch/pastEnslavedFetch/fetchEnslavedMap';
import { getMapBackgroundColor } from '@/utils/functions/getMapBackgroundColor';
import {
  setEdgesDataPlace,
  setEdgesDataRegion,
  setHasFetchedRegion,
  setMapData,
  setNodesDataPlace,
  setNodesDataRegion,
  setPathsData,
} from '@/redux/getNodeEdgesAggroutesMapDataSlice';
import { HandleZoomEvent } from './HandleZoomEvent';
import NodeEdgesCurvedLinesMap from './NodeEdgesCurvedLinesMap';
import ShowsColoredNodeOnMap from './ShowsColoredNodeOnMap';
import { usePageRouter } from '@/hooks/usePageRouter';

interface LeafletMapProps {
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>
  zoomLevel: number
}

export const LeafletMap = ({ setZoomLevel, zoomLevel }: LeafletMapProps) => {
  const dispatch: AppDispatch = useDispatch();
  const mapRef = useRef(null);
  const location = useLocation();
  const pathNameArr = location.pathname.split('/');
  const pathName = pathNameArr[1];
  const { nodesData } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );

  const [regionPlace, setRegionPlace] = useState<string>('region');
  const [loading, setLoading] = useState<boolean>(false);
  const hasFetchedPlaceRef = useRef(false);
  const { dataSetKey, dataSetValue, styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { styleNamePeople } = useSelector(
    (state: RootState) => state.getPeopleEnlavedDataSetCollection
  );

  const { hasFetchedRegion, clusterNodeKeyVariable, clusterNodeValue } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
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
  const { isChangeGeoTree, geoTreeValue } = useSelector(
    (state: RootState) => state.getGeoTreeData
  );

  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );


  useEffect(() => {
    const savedNodesDataRegion = localStorage.getItem('nodesDataregion');
    const saveEdgesDataRegion = localStorage.getItem('edgesDataregion');
    const savedNodesDataPlace = localStorage.getItem('nodesDataplace');
    const saveEdgesDataPlace = localStorage.getItem('edgesDataplace');

    if (
      savedNodesDataRegion &&
      saveEdgesDataRegion &&
      saveEdgesDataPlace &&
      savedNodesDataPlace
    ) {
      if (zoomLevel >= ZOOM_LEVEL_THRESHOLD) {
        dispatch(setNodesDataPlace(JSON.parse(savedNodesDataPlace)));
        dispatch(setEdgesDataPlace(JSON.parse(saveEdgesDataPlace)));
        setLoading(false);
      } else {
        dispatch(setNodesDataRegion(JSON.parse(savedNodesDataRegion)));
        dispatch(setEdgesDataRegion(JSON.parse(saveEdgesDataRegion)));
        setLoading(false);
      }
    }

  }, [zoomLevel]);


  const fetchData = async (regionOrPlace: string) => {
    const dataSend: { [key: string]: (string | number)[] } = {};

    dataSend['zoomlevel'] = [regionOrPlace];
    if (clusterNodeKeyVariable && clusterNodeValue) {
      dataSend[clusterNodeKeyVariable] = [clusterNodeValue]
    }

    if (styleName !== TYPESOFDATASET.allVoyages) {
      for (const value of dataSetValue) {
        dataSend[dataSetKey] = [String(value)];
      }
    }

    if (inputSearchValue) {
      dataSend['global_search'] = [String(inputSearchValue)];
    }
    if (isChange && rang && currentPage === 7 && pathName === VOYAGESPAGE) {
      for (const rangKey in rang) {
        dataSend[rangKey] = [rang[rangKey][0]];
        dataSend[rangKey] = [rang[rangKey][1]];
      }
    }
    if (
      isChange &&
      rang &&
      currentEnslavedPage === 3 &&
      pathName === PASTHOMEPAGE
    ) {
      for (const rangKey in rang) {
        dataSend[rangKey] = [rang[rangKey][0]];
        dataSend[rangKey] = [rang[rangKey][1]];
      }
    }

    if (
      autoCompleteValue &&
      isChangeAuto &&
      currentPage === 7 &&
      pathName === VOYAGESPAGE
    ) {
      for (const autoKey in autoCompleteValue) {
        for (const autoCompleteOption of autoCompleteValue[autoKey]) {
          if (typeof autoCompleteOption !== 'string') {
            const { label } = autoCompleteOption;

            dataSend[autoKey] = [label];
          }
        }
      }
    }

    if (
      autoCompleteValue &&
      isChangeAuto &&
      currentEnslavedPage === 3 &&
      pathName === PASTHOMEPAGE
    ) {
      for (const autoKey in autoCompleteValue) {
        for (const autoCompleteOption of autoCompleteValue[autoKey]) {
          if (typeof autoCompleteOption !== 'string') {
            const { label } = autoCompleteOption;
            dataSend[autoKey] = [label];
          }
        }
      }
    }

    if (
      isChangeGeoTree &&
      geoTreeValue &&
      currentPage === 7 &&
      pathName === VOYAGESPAGE
    ) {
      for (const keyValue in geoTreeValue) {
        for (const keyGeoValue of geoTreeValue[keyValue]) {
          dataSend[keyValue] = [String(keyGeoValue)];
        }
      }
    }

    if (
      isChangeGeoTree &&
      geoTreeValue &&
      currentEnslavedPage === 3 &&
      pathName === PASTHOMEPAGE
    ) {
      for (const keyValue in geoTreeValue) {
        for (const keyGeoValue of geoTreeValue[keyValue]) {
          dataSend[keyValue] = [String(keyGeoValue)];
        }
      }
    }

    hasFetchedRegion ? setLoading(true) : setLoading(false);

    let response;
    if (pathName === VOYAGESPAGE) {
      response = await dispatch(fetchVoyagesMap(dataSend)).unwrap();
    } else if (pathName === PASTHOMEPAGE) {
      response = await dispatch(fetchEnslavedMap(dataSend)).unwrap();
    }

    if (response) {
      handleDataResponse(response, regionOrPlace);
      dispatch(setHasFetchedRegion(false));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRegion) {
      fetchData(REGION);
    } else if (clusterNodeKeyVariable && clusterNodeValue) {
      fetchData(REGION);
    }
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
    geoTreeValue,
    inputSearchValue,
    regionPlace, clusterNodeKeyVariable, clusterNodeValue
  ]);

  const handleDataResponse = (response: any, regionOrPlace: string) => {
    if (response) {
      const { nodes, edges, paths } = response;
      if (zoomLevel < ZOOM_LEVEL_THRESHOLD) {
        localStorage.setItem(
          `nodesData${regionOrPlace}`,
          JSON.stringify(nodes)
        );
        localStorage.setItem(
          `edgesData${regionOrPlace}`,
          JSON.stringify(edges)
        );
      }
      dispatch(setMapData(response));
      if (regionOrPlace === 'region') {
        setLoading(false);
        dispatch(setNodesDataRegion(nodes));
        dispatch(setEdgesDataRegion(edges));
      } else if (regionOrPlace === 'place') {
        localStorage.setItem(
          `nodesData${regionOrPlace}`,
          JSON.stringify(nodes)
        );
        localStorage.setItem(
          `edgesData${regionOrPlace}`,
          JSON.stringify(edges)
        );
      }
      dispatch(setPathsData(paths));
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (!hasFetchedPlaceRef.current) {
      timeout = setTimeout(() => {
        setLoading(false);
        fetchData(PLACE);
        hasFetchedPlaceRef.current = true;
      }, 3000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [hasFetchedRegion]);

  const map = useMap();

  map.on('zoomend', () => {
    const newZoomLevel = map.getZoom();
    setZoomLevel(newZoomLevel);
    fetchData(regionPlace);
  });

  let backgroundColor = styleNamePeople;
  if (styleName === TYPESOFDATASET.allVoyages || styleName === TYPESOFDATASET.intraAmerican || styleName === TYPESOFDATASET.transatlantic || styleName === TYPESOFDATASET.texas) {
    backgroundColor = styleName
  }
  if (styleNamePeople === AFRICANORIGINS) {
    backgroundColor = styleNamePeople;
  }


  return (
    <div style={{ backgroundColor: getMapBackgroundColor(backgroundColor) }}>
      {loading || nodesData.length === 0 ? (
        <div className="loading-logo">
          <img src={LOADINGLOGO} />
        </div>
      ) : (
        <>
          <MapContainer
            ref={mapRef}
            center={MAP_CENTER}
            zoom={zoomLevel}
            className="lealfetMap-container"
            maxZoom={MAXIMUM_ZOOM}
            minZoom={MINIMUM_ZOOM}
            attributionControl={false}
            scrollWheelZoom={true}
            zoomControl={true}
          >
            <HandleZoomEvent
              setZoomLevel={setZoomLevel}
              setRegionPlace={setRegionPlace}
              zoomLevel={zoomLevel}
            />
            <TileLayer url={mappingSpecialists} />
            <LayersControl position="topright">
              <LayersControl.Overlay name="River">
                <TileLayer url={mappingSpecialistsRivers} />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Modern Countries">
                <TileLayer url={mappingSpecialistsCountries} />
              </LayersControl.Overlay>
            </LayersControl>
            <NodeEdgesCurvedLinesMap />
          </MapContainer>
          <ShowsColoredNodeOnMap />
        </>
      )}
    </div>
  );
};
