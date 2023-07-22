import { Transportation } from '@/share/InterfaceTypesMap';
import { getEdgesSize } from './getNodeSize';

export const getMinEdges = (edges: Transportation[]): number => {
    let minEdgesize = Infinity;
    edges.forEach((edge) => {
        const edgeSize = getEdgesSize(edge);
        if (edgeSize) {
            if (edgeSize < minEdgesize) {
                minEdgesize = edgeSize;
            }
        }
    });
    return minEdgesize;
};

export const getMaxEdges = (edges: Transportation[]): number => {
    let maxEdgesize = -Infinity;
    edges.forEach((edge) => {
        const edgeSize = getEdgesSize(edge);
        if (edgeSize) {
            if (edgeSize > maxEdgesize) {
                maxEdgesize = edgeSize;
            }
        }
    });

    return maxEdgesize;
};
