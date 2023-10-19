import { EdgesAggroutes, NodeAggroutes } from '@/share/InterfaceTypesMap';
import { createNodeDict } from '@/utils/functions/createNodeDict';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet.curve';
import * as d3 from 'd3';
import {
  getMaxValueNode,
  getMinValueNode,
} from '@/utils/functions/getMinMaxValueNode';
import { maxRadiusInPixels, minRadiusInpixels } from '@/share/CONST_DATA';

const renderPolylineNodeMap = (
  edge: EdgesAggroutes,
  type: string,
  newLineCurves: L.Curve[],
  nodesData: NodeAggroutes[]
) => {
  const nodeLogValueScale = d3
    .scaleLog()
    .domain([getMinValueNode(nodesData), getMaxValueNode(nodesData)])
    .range([minRadiusInpixels, maxRadiusInPixels]);

  const nodesDict = createNodeDict(nodesData);
  const source = nodesDict[edge?.source || 0.15];
  const target = nodesDict[edge?.target || 0.2];
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
    const startControlLatLng: number[] = edge.controls[0];
    const midpointControlLatLng: number[] = edge.controls[1];
    const curve = L.curve(
      [
        'M',
        startLatLng,
        'C',
        startControlLatLng as [number, number] | [number],
        midpointControlLatLng as [number, number] | [number],
        endLatLng,
      ],
      {
        color: typeColor,
        fill: false,
        weight: weight,
        stroke: true,
      }
    );
    newLineCurves.push(curve);
  }
};
export default renderPolylineNodeMap;
