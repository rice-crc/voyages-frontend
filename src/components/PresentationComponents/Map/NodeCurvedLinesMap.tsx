import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { getNodeSize } from '@/utils/functions/getNodeSize';
import * as d3 from 'd3';
import {
  getMaxValueNode,
  getMinValueNode,
} from '@/utils/functions/getMinMaxValueNode';
import { getNodeColorMapVoyagesStyle } from '@/utils/functions/getNodeColorStyle';
// import 'leaflet.curve'; // '@elfalem/leaflet-curve';
import 'leaflet';
import 'leaflet.curve';
import renderPolylineNodeMap from './renderPolylineNodeMap';
import renderAnimatedLines from './renderAnimatedLines';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { maxRadiusInPixels, minRadiusInpixels } from '@/share/CONST_DATA';
import { EdgesAggroutes } from '@/share/InterfaceTypesMap';

const NodeCurvedLinesMap = () => {
  const { nodesData, edgesData } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );

  const nodeLogValueScale = d3
    .scaleLog()
    .domain([getMinValueNode(nodesData), getMaxValueNode(nodesData)])
    .range([minRadiusInpixels, maxRadiusInPixels]);

  const map = useMap();
  const [lineCurves, setLineCurves] = useState<L.Curve[]>([]); // Use state to store line curves

  useEffect(() => {
    animateCurvedLines();
    return () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Curve) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, nodesData]);

  const animateCurvedLines = () => {
    const newLineCurves: L.Curve[] = [];
    edgesData.forEach((edge: EdgesAggroutes) => {
      renderPolylineNodeMap(edge, edge.type, newLineCurves, nodesData);
      renderAnimatedLines(edge, newLineCurves, nodesData);
    });

    setLineCurves(newLineCurves);
  };

  useEffect(() => {
    if (map && lineCurves.length > 0) {
      lineCurves.forEach((curve) => {
        curve.addTo(map);
      });
    }

    const nodeMarkers: L.CircleMarker[] = [];

    // Render the CircleMarker elements after the line curves
    nodesData.forEach((node) => {
      const { data } = node;
      const { lat, lon, name } = data;
      const size = getNodeSize(node);
      const nodeColor = getNodeColorMapVoyagesStyle(node);
      const radius = size !== null ? nodeLogValueScale(size) : 0;

      if (lat && lon && radius) {
        const latlon: LatLngExpression = [lat, lon];
        const circleMarker = L.circleMarker(latlon, {
          radius,
          weight: 1.5,
          color: '#000000',
          fillColor: nodeColor,
          fillOpacity: 0.8,
        });
        nodeMarkers.push(circleMarker);
        const popupContent = `<p>${name}</p>`;
        circleMarker.bindPopup(popupContent);
      }
    });
    if (map && nodeMarkers.length > 0) {
      nodeMarkers.forEach((marker) => {
        marker.addTo(map).bringToFront();
      });
    }

    return () => {
      lineCurves.forEach((curve) => {
        map.removeLayer(curve);
      });
      nodeMarkers.forEach((marker) => {
        map.removeLayer(marker);
      });
    };
  }, [lineCurves, map, nodesData, nodeLogValueScale]);
  return null;
};

export default NodeCurvedLinesMap;
