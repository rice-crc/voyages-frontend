import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVoyagesMap } from '@/fetch/voyagesFetch/fetchVoyagesMap';
import '@/style/map.scss';
import {
  AutoCompleteInitialState,
  CurrentPageInitialState,
  Filter,
  MapPropsRequest,
  RangeSliderState,
} from '@/share/InterfaceTypes';
import {
  MAP_CENTER,
  MAXIMUM_ZOOM,
  MINIMUM_ZOOM,
  ZOOM_LEVEL_THRESHOLD,
  mappingSpecialists,
  mappingSpecialistsCountries,
  mappingSpecialistsRivers,
  PLACE,
  ESTIMATES,
  REGION,
  broadRegion,
} from '@/share/CONST_DATA';
import LOADINGLOGO from '@/assets/sv-logo_v2_notext.svg';
import { fetchEnslavedMap } from '@/fetch/pastEnslavedFetch/fetchEnslavedMap';
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
import {
  checkPagesRouteForEnslaved,
  checkPagesRouteForVoyages,
  checkPagesRouteMapEstimates,
  checkPagesRouteMapURLForEnslaved,
  checkPagesRouteMapURLForVoyages,
} from '@/utils/functions/checkPagesRoute';
import { setFilterObject } from '@/redux/getFilterSlice';
import { fetchEstimatesMap } from '@/fetch/estimateFetch/fetchEstimatesMap';
import { filtersDataSend } from '@/utils/functions/filtersDataSend';
import { getColorBackgroundHeader } from '@/utils/functions/getColorStyle';

interface LeafletMapProps {
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  zoomLevel: number;
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

  const effectOnce = useRef(false);
  const { styleName: styleNamePage, nodeTypeURL, currentBlockName } = usePageRouter();
  const zoomlevelValue = styleNamePage !== ESTIMATES ? REGION : broadRegion;
  const [regionPlace, setRegionPlace] = useState<string>(zoomlevelValue);
  const [loading, setLoading] = useState<boolean>(false);
  const hasFetchedPlaceRef = useRef(false);
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );

  const { hasFetchedRegion, clusterNodeKeyVariable, clusterNodeValue } =
    useSelector((state: RootState) => state.getNodeEdgesAggroutesMapData);
  const { filtersObj } = useSelector((state: RootState) => state.getFilter);

  const { rangeSliderMinMax: rang, varName } = useSelector(
    (state: RootState) => state.rangeSlider as RangeSliderState
  );
  const { currentPage } = useSelector(
    (state: RootState) => state.getScrollPage as CurrentPageInitialState
  );
  const { inputSearchValue } = useSelector(
    (state: RootState) => state.getCommonGlobalSearch
  );
  const { autoCompleteValue, autoLabelName } = useSelector(
    (state: RootState) => state.autoCompleteList as AutoCompleteInitialState
  );
  useEffect(() => {
    const storedValue = localStorage.getItem('filterObject');
    if (!storedValue) return;
    const parsedValue = JSON.parse(storedValue);
    const filter: Filter[] = parsedValue.filter;
    if (!filter) return;
    dispatch(setFilterObject(filter));
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    // check if route is voyages, enslaved, enslaver , will not call zoom place
    if (!hasFetchedPlaceRef.current && styleNamePage !== ESTIMATES) {
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
  }, [hasFetchedRegion])

  useEffect(() => {
    const savedNodesDataRegion = localStorage.getItem('nodesDataregion');
    const saveEdgesDataRegion = localStorage.getItem('edgesDataregion');
    const savedNodesDataBroadRegion = localStorage.getItem('nodesDatabroad_region');
    const saveEdgesDataBroadRegion = localStorage.getItem('edgesDatabroad_region');
    const savedNodesDataPlace = localStorage.getItem('nodesDataplace');
    const saveEdgesDataPlace = localStorage.getItem('edgesDataplace');
    /** ToSetZoom:  Voyages, Enslaved , Enslaver Map  with broad_region and region form localStorage */
    if (saveEdgesDataPlace && savedNodesDataPlace && savedNodesDataRegion && saveEdgesDataRegion) {

      if (zoomLevel >= ZOOM_LEVEL_THRESHOLD && !varName && !clusterNodeValue && !clusterNodeKeyVariable && styleNamePage !== ESTIMATES) {
        dispatch(setNodesDataPlace(JSON.parse(savedNodesDataPlace!)));
        dispatch(setEdgesDataPlace(JSON.parse(saveEdgesDataPlace!)));
        setLoading(false);
      } else if (zoomLevel < ZOOM_LEVEL_THRESHOLD && !varName && !clusterNodeValue && !clusterNodeKeyVariable && styleNamePage !== ESTIMATES
      ) {
        dispatch(setNodesDataRegion(JSON.parse(savedNodesDataRegion!)));
        dispatch(setEdgesDataRegion(JSON.parse(saveEdgesDataRegion!)));
        setLoading(false);
      }
    } else if (savedNodesDataBroadRegion && saveEdgesDataBroadRegion && styleNamePage === ESTIMATES) {
      if (zoomLevel >= ZOOM_LEVEL_THRESHOLD) {
        if (savedNodesDataRegion && saveEdgesDataRegion) {
          dispatch(setNodesDataRegion(JSON.parse(savedNodesDataRegion!)));
          dispatch(setEdgesDataRegion(JSON.parse(saveEdgesDataRegion!)));
          setLoading(false);
        } else if (currentBlockName !== 'tables' || 'timeline') {
          fetchData(regionPlace);
        }
      } else if (zoomLevel < ZOOM_LEVEL_THRESHOLD) {
        dispatch(setNodesDataRegion(JSON.parse(savedNodesDataBroadRegion!)));
        dispatch(setEdgesDataRegion(JSON.parse(saveEdgesDataBroadRegion!)));
        setLoading(false);
      }
    }
  }, [zoomLevel, styleNamePage]);


  const filters = filtersDataSend(filtersObj, styleNamePage!, clusterNodeKeyVariable, clusterNodeValue)
  const dataSend: MapPropsRequest = {
    filter: filters || [],
  };

  if (inputSearchValue) {
    dataSend['global_search'] = inputSearchValue;
  }

  const fetchData = async (regionOrPlace: string) => {
    (dataSend['zoomlevel'] = regionOrPlace),
      hasFetchedRegion ? setLoading(true) : setLoading(false);
    let response;
    if (checkPagesRouteForVoyages(styleNamePage! || nodeTypeURL!)) {
      response = await dispatch(fetchVoyagesMap(dataSend)).unwrap();
    } else if (checkPagesRouteMapURLForVoyages(nodeTypeURL!)) {
      response = await dispatch(fetchVoyagesMap(dataSend)).unwrap();
    } else if (checkPagesRouteForEnslaved(styleNamePage!)) {
      response = await dispatch(fetchEnslavedMap(dataSend)).unwrap();
    } else if (checkPagesRouteMapURLForEnslaved(nodeTypeURL!)) {
      response = await dispatch(fetchEnslavedMap(dataSend)).unwrap();
    } else if (checkPagesRouteMapEstimates(styleNamePage!)) {
      response = await dispatch(fetchEstimatesMap(dataSend)).unwrap();
    }
    if (response) {
      handleDataResponse(response, regionOrPlace);
      dispatch(setHasFetchedRegion(false));
    }
    setLoading(false);
  };

  useEffect(() => {

    if (currentBlockName !== 'tables' && currentBlockName !== 'timeline') {
      if (!effectOnce.current || hasFetchedRegion || (clusterNodeKeyVariable !== '' && clusterNodeValue !== '') || varName) {
        fetchData(regionPlace);
      }
    }

  }, [
    nodeTypeURL,
    rang,
    varName,
    autoCompleteValue,
    autoLabelName,
    currentPage,
    pathName,
    styleName,
    styleNamePage,
    inputSearchValue,
    clusterNodeKeyVariable,
    clusterNodeValue,
    filtersObj,
  ]);

  const handleDataResponse = (response: any, regionOrPlace: string) => {
    if (response) {
      const { nodes, edges, paths } = response;
      dispatch(setMapData(response));
      if (regionOrPlace === broadRegion) {
        setLoading(false);
        dispatch(setNodesDataRegion(nodes));
        dispatch(setEdgesDataRegion(edges));
        localStorage.setItem(
          `nodesData${regionOrPlace}`,
          JSON.stringify(nodes)
        );
        localStorage.setItem(
          `edgesData${regionOrPlace}`,
          JSON.stringify(edges)
        );
      } else if (regionOrPlace === REGION) {
        setLoading(false);
        dispatch(setNodesDataRegion(nodes));
        dispatch(setEdgesDataRegion(edges));
        localStorage.setItem(
          `nodesData${regionOrPlace}`,
          JSON.stringify(nodes)
        );
        localStorage.setItem(
          `edgesData${regionOrPlace}`,
          JSON.stringify(edges)
        );
      } else if (regionOrPlace === PLACE && varName === '') {
        localStorage.setItem(
          `nodesData${regionOrPlace}`,
          JSON.stringify(nodes)
        );
        localStorage.setItem(
          `edgesData${regionOrPlace}`,
          JSON.stringify(edges)
        );
        if (varName || clusterNodeKeyVariable || clusterNodeValue) {
          dispatch(setNodesDataPlace(nodes));
          dispatch(setEdgesDataPlace(edges));
        }
      }
      dispatch(setPathsData(paths));
    }
  };


  const map = useMap();

  map.on('zoomend', () => {
    const newZoomLevel = map.getZoom();
    setZoomLevel(newZoomLevel);
  });

  return (
    <div style={{ backgroundColor: getColorBackgroundHeader(styleNamePage!) }}>
      {loading || nodesData?.length === 0 ? (
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
              styleRouteName={styleNamePage}
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
