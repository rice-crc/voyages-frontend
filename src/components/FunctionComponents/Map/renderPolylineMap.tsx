import {
  Dispositions,
  NodeAggroutes,
  Originations,
  Transportation,
} from '@/share/InterfaceTypesMap';
import { createNodeDict } from '@/utils/functions/createNodeDict';
import { getMaxEdges, getMinEdges } from '@/utils/functions/getMinMaxEdges';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import * as d3 from 'd3';
import { useMap } from 'react-leaflet';
import { default as bezierSpline } from '@turf/bezier-spline';
import * as helpers from '@turf/helpers';
import L, { LatLngExpression } from 'leaflet';
import '@elfalem/leaflet-curve';

export const renderPolylineMap = (
  nodesData: NodeAggroutes[],
  transportation: Transportation[] | Dispositions[] | Originations[],
  edge: Transportation,
  type: string
) => {
  const map = useMap();
  const minWeightInpixels = 3;
  const maxWeightInPixels = 10;
  const nodeLogValueWeight = d3
    .scaleLog()
    .domain([getMinEdges(transportation), getMaxEdges(transportation)])
    .range([minWeightInpixels, maxWeightInPixels]);

  const nodesDict = createNodeDict(nodesData);
  const source = nodesDict[edge?.s || 0.15];
  const target = nodesDict[edge?.t || 0.2];
  const size = getEdgesSize(edge);
  const weight = size !== null ? nodeLogValueWeight(size) / 2 : 0;

  if (source && target && weight) {
    const startLatLng: LatLngExpression = [source[0], source[1]];
    const endLatLng: LatLngExpression = [target[0], target[1]];
    const typeColor =
      type === 'transportation'
        ? 'rgb(215, 153, 250)'
        : type === 'disposition'
        ? 'rgb(246,193,60)'
        : 'rgb(96, 192, 171)';

    const offsetX = endLatLng[1] - startLatLng[1];
    const offsetY = endLatLng[0] - startLatLng[0];

    const round = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
      theta = Math.atan2(offsetY, offsetX);
    const thetaOffset = 3 / 9;

    const round2 = round / 3 / Math.cos(thetaOffset),
      theta2 = theta + thetaOffset;

    const midpointX = round2 * Math.cos(theta2) + startLatLng[1],
      midpointY = round2 * Math.sin(theta2) + startLatLng[0];
    const midpointLatLng: [number, number] = [midpointY, midpointX];

    // Create quadratic Bezier curve coordinates
    const quadraticCurve = [startLatLng, endLatLng];
    const line = helpers.lineString(
      quadraticCurve.map((lngLat) => [lngLat[1], lngLat[0]])
    );
    const curved = bezierSpline(line);
    curved.properties = { stroke: '#0F0', type: 'Polygon' };
    const curve = L.curve(
      ['M', startLatLng, 'C', startLatLng, midpointLatLng, endLatLng],
      {
        color: typeColor,
        fill: false,
        weight: weight,
        stroke: true,
      }
    );
    curve.addTo(map);
  }
};
