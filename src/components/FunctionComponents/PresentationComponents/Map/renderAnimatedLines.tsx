import { NodeAggroutes, Transportation } from '@/share/InterfaceTypesMap';
import { createNodeDict } from '@/utils/functions/createNodeDict';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import L, { LatLngExpression } from 'leaflet';
import * as d3 from 'd3';
import {
  getMaxValueNode,
  getMinValueNode,
} from '@/utils/functions/getMinMaxValueNode';
import { maxRadiusInPixels, minRadiusInpixels } from '@/share/CONST_DATA';

const renderAnimatedLines = (
  edge: Transportation,
  type: string,
  newLineCurves: L.Curve[],
  nodesData: NodeAggroutes[]
) => {
  const nodeLogValueScale = d3
    .scaleLog()
    .domain([getMinValueNode(nodesData), getMaxValueNode(nodesData)])
    .range([minRadiusInpixels, maxRadiusInPixels]);

  const nodesDict = createNodeDict(nodesData);
  const source = nodesDict[edge?.s || 0.15];
  const target = nodesDict[edge?.t || 0.2];
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
        dashArray: [5, 10, 5],
        fill: false,
        weight: weight / 6,
        color: '#0000FF',
        opacity: 0.5,
        stroke: true,
        interactive: false,
        animate: { duration: 12000, iterations: Infinity },
      }
    );
    newLineCurves.push(curve);
  }
};
export default renderAnimatedLines;
