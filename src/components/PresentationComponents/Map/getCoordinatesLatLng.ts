import { nodeTypeOrigin, nodeTypePostDisembarkation } from "@/share/CONST_DATA";
import { LatLng } from "@/share/InterfaceTypesMap";

export function getCoordinatesLatLng(nodeType: string, clusterLat: number, clusterLng: number, nodeLat: number, nodeLng: number): [LatLng, LatLng] {
    if (nodeType === nodeTypeOrigin) {
        return [[clusterLat, clusterLng], [nodeLat, nodeLng]];
    } else if (nodeType === nodeTypePostDisembarkation) {
        return [[nodeLat, nodeLng], [clusterLat, clusterLng]];
    } else {
        return [[0, 1], [1, 2]];
    }
}