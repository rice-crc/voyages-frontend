import { EdgesAggroutes, NodeAggroutes } from '@/share/InterfaceTypesMap';
import { getEdgesSize, getNodeSize } from './getNodeSize';

export const getMinValueEdge = (edgeData: EdgesAggroutes[]): number => {
  let minEdgeSize = Infinity;
  edgeData?.length > 0 &&
    edgeData.forEach((edge) => {
      const weight = getEdgesSize(edge);
      if (weight) {
        if (weight < minEdgeSize) {
          minEdgeSize = weight;
        }
      }
    });
  return minEdgeSize;
};

export const getMaxValueEdge = (edgeData: EdgesAggroutes[]): number => {
  let maxEdgeSize = -Infinity;
  edgeData?.length > 0 &&
    edgeData.forEach((edge) => {
      const weight = getEdgesSize(edge);
      if (weight) {
        if (weight > maxEdgeSize) {
          maxEdgeSize = weight;
        }
      }
    });
  return maxEdgeSize;
};
