import {
  ESTIMATES,
  PLACE,
  REGION,
  ZOOM_LEVEL_REGION_ESTIMATE_MIN,
  ZOOM_LEVEL_THRESHOLD,
  broadRegion,
} from '@/share/CONST_DATA';
import { HandleZoomEventProps } from '@/share/InterfaceTypesMap';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setHasFetchedRegion } from '@/redux/getNodeEdgesAggroutesMapDataSlice';

export const HandleZoomEvent: React.FC<HandleZoomEventProps> = ({
  setZoomLevel,
  setRegionPlace,
  zoomLevel,
  styleRouteName,
}) => {
  const map = useMap();
  const dispatch: AppDispatch = useDispatch();
  const { nodesData } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );
  const oceanic_animation_edges_layer_group = L.layerGroup();
  const oceanic_main_edges_layer_group = L.layerGroup();
  const oceanic_edges_holding_layer_group = L.layerGroup();
  const endpoint_animation_edges_layer_group = L.layerGroup();
  const endpoint_main_edges_layer_group = L.layerGroup();

  useEffect(() => {
    if (!map) return;
    if (map) {
      oceanic_edges_holding_layer_group.addTo(map);
      oceanic_main_edges_layer_group.addTo(oceanic_edges_holding_layer_group);
      oceanic_animation_edges_layer_group.addTo(
        oceanic_edges_holding_layer_group
      );
      endpoint_main_edges_layer_group.addTo(map);
      endpoint_animation_edges_layer_group.addTo(map);
      const initialZoomLevel = map.getZoom();
      setZoomLevel(initialZoomLevel);
    }
    return () => {
      if (map) {
        map.removeLayer(endpoint_animation_edges_layer_group);
        map.removeLayer(endpoint_main_edges_layer_group);
        map.removeLayer(oceanic_animation_edges_layer_group);
        map.removeLayer(oceanic_main_edges_layer_group);
        map.removeLayer(oceanic_edges_holding_layer_group);
      }
    };
  }, [map, setZoomLevel, zoomLevel]);

  useMapEvents({
    zoomend: () => {
      if (map) {
        const newZoomLevel = map.getZoom();
        setZoomLevel(newZoomLevel);
        if (nodesData.length === 0) {
          dispatch(setHasFetchedRegion(true));
        } else {
          dispatch(setHasFetchedRegion(false));
        }
        if (styleRouteName !== ESTIMATES) {
          if (newZoomLevel >= ZOOM_LEVEL_THRESHOLD) {
            setRegionPlace(PLACE);
          } else {
            setRegionPlace(REGION);
          }
        } else if (styleRouteName === ESTIMATES) {
          if (newZoomLevel >= ZOOM_LEVEL_REGION_ESTIMATE_MIN) {
            setRegionPlace(REGION);
          } else {
            setRegionPlace(broadRegion);
          }
        }
      }
    },
    zoomstart: () => {
      oceanic_main_edges_layer_group.clearLayers();
      oceanic_animation_edges_layer_group.clearLayers();
      endpoint_main_edges_layer_group.clearLayers();
      endpoint_animation_edges_layer_group.clearLayers();
    },
  });

  return null;
};
