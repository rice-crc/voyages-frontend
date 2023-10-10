import { EdgesAggroutes, NodeAggroutes } from '@/share/InterfaceTypesMap';
import { createNodeDict } from '@/utils/functions/createNodeDict';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import L, { CurveOptions, LatLngExpression } from 'leaflet';
import * as d3 from 'd3';
import {
  getMaxValueNode,
  getMinValueNode,
} from '@/utils/functions/getMinMaxValueNode';
import { maxRadiusInPixels, minRadiusInPixels } from '@/share/CONST_DATA';

const renderEdgesAnimatedLines = (
  clusterSource: [number, number] | null,
  targetNode: [number, number] | null,
  edge: EdgesAggroutes,
  type: string,
  nodesData: NodeAggroutes[]
): L.Curve | undefined => {
  const nodeLogValueScale = d3
    .scaleLog()
    .domain([getMinValueNode(nodesData), getMaxValueNode(nodesData)])
    .range([minRadiusInPixels, maxRadiusInPixels]);

  const nodesDict = createNodeDict(nodesData);
  const source = nodesDict[edge?.source || 0.15];
  const target = nodesDict[edge?.target || 0.2];
  const size = getEdgesSize(edge);
  const weight = size !== null ? nodeLogValueScale(size) / 4 : 0;

  if (source && target && weight) {
    const startLatLng: LatLngExpression | null = clusterSource
      ? clusterSource
      : [source[0], source[1]];
    const endLatLng: LatLngExpression | null = targetNode
      ? targetNode
      : [target[0], target[1]];
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
        dashArray: '1 9',
        fill: false,
        weight: clusterSource ? weight * 2 : weight / 2,
        color: '#0000FF',
        opacity: 0.7,
        stroke: true,
        interactive: false,
        animate: { duration: 1000, iterations: Infinity },
      } as CurveOptions
    );
    return curve;
  }
  return undefined;
};
export default renderEdgesAnimatedLines;
