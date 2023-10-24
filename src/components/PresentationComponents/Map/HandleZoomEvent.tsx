import { PLACE, REGION, ZOOM_LEVEL_THRESHOLD } from '@/share/CONST_DATA';
import { HandleZoomEventProps } from '@/share/InterfaceTypesMap';
import { useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

export const HandleZoomEvent: React.FC<HandleZoomEventProps> = ({
  setZoomLevel,
  setRegionPlace,
}) => {
  const map = useMap();
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
  }, [map, setZoomLevel]);

  useMapEvents({
    zoomend: () => {
      if (map) {
        const newZoomLevel = map.getZoom();
        setZoomLevel(newZoomLevel);
        if (newZoomLevel >= ZOOM_LEVEL_THRESHOLD) {
          setRegionPlace(PLACE);
        } else {
          setRegionPlace(REGION);
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
