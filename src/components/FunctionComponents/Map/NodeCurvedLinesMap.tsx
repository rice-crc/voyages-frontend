import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { createNodeDict } from '@/utils/functions/createNodeDict';
import { getEdgesSize, getNodeSize } from '@/utils/functions/getNodeSize';
import * as d3 from 'd3';
import {
  getMaxValueNode,
  getMinValueNode,
} from '@/utils/functions/getMinMaxValueNode';
import { PolylineMapProps, Transportation } from '@/share/InterfaceTypesMap';
import { getNodeColorMapVoyagesStyle } from '@/utils/functions/getNodeColorStyle';
import '@elfalem/leaflet-curve';

const NodeCurvedLinesMap = (props: PolylineMapProps) => {
  const { transportation, nodesData, origination, disposition } = props;
  const minRadiusInpixels = 3;
  const maxRadiusInPixels = 20;
  const nodeLogValueScale = d3
    .scaleLog()
    .domain([getMinValueNode(nodesData), getMaxValueNode(nodesData)])
    .range([minRadiusInpixels, maxRadiusInPixels]);

  const map = useMap();
  const [lineCurves, setLineCurves] = useState<L.Curve[]>([]); // Use state to store line curves
  const nodesDict = createNodeDict(nodesData);

  const renderPolyline = (
    edge: Transportation,
    type: string,
    newLineCurves: L.Curve[]
  ) => {
    const source = nodesDict[edge?.s || 0.15];
    const target = nodesDict[edge?.t || 0.2];
    const typeColor =
      type === 'transportation'
        ? 'rgb(215, 153, 250)'
        : type === 'disposition'
        ? 'rgb(246,193,60)'
        : 'rgb(96, 192, 171)';

    const size = getEdgesSize(edge);
    const weight = size !== null ? nodeLogValueScale(size) / 4 : 0;

    if (source && target && weight) {
      const startLatLng: LatLngExpression = [source[0], source[1]];
      const endLatLng: LatLngExpression = [target[0], target[1]];
      const offsetX = endLatLng[1] - startLatLng[1],
        offsetY = endLatLng[0] - startLatLng[0];

      const round = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
        theta = Math.atan2(offsetY, offsetX);
      const thetaOffset = 3 / 9;

      const round2 = round / 3 / Math.cos(thetaOffset),
        theta2 = theta + thetaOffset;

      const midpointX = round2 * Math.cos(theta2) + startLatLng[1],
        midpointY = round2 * Math.sin(theta2) + startLatLng[0];
      const midpointLatLng: [number, number] = [midpointY, midpointX];

      const curve = L.curve(
        ['M', startLatLng, 'C', startLatLng, midpointLatLng, endLatLng],
        {
          color: typeColor,
          fill: false,
          weight: weight,
          stroke: true,
          // animate: { duration: 500, iterations: 1 },
        }
      );
      newLineCurves.push(curve);
    }
  };

  useEffect(() => {
    const animateCurvedLines = () => {
      const newLineCurves: L.Curve[] = [];
      transportation.forEach((edge) => {
        renderPolyline(edge, 'transportation', newLineCurves);
      });

      disposition?.forEach((edge) => {
        renderPolyline(edge, 'disposition', newLineCurves);
      });

      origination?.forEach((edge) => {
        renderPolyline(edge, 'origination', newLineCurves);
      });
      setLineCurves(newLineCurves);
    };

    animateCurvedLines();

    return () => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Curve) {
          map.removeLayer(layer);
        }
      });
    };
  }, [transportation, origination, disposition, nodesData, map]);

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
