import { EdgesAggroutes, NodeAggroutes } from '@/share/InterfaceTypesMap';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import L from 'leaflet';
import renderEdgesAnimatedLinesOnMap from './renderEdgesAnimatedLinesOnMap';
import renderEdgesLinesOnMap from './renderEdgesLinesOnMap';
import { createLogValueScale } from '@/utils/functions/createNodeLogValueScale';

export function handleHoverOriginMarkerCluster(
  event: L.LeafletEvent,
  hiddenEdgesLayer: L.LayerGroup<any>,
  hiddenEdges: EdgesAggroutes[],
  nodesData: NodeAggroutes[]
) {
  hiddenEdgesLayer.clearLayers();
  const targetNodeMap = new Map<string, [NodeAggroutes, EdgesAggroutes]>();

  const nodeLogValueScale = createLogValueScale(nodesData);

  const clusterLatLon = event.layer.getLatLng();
  const clusterChildMarkers = event.layer.getAllChildMarkers();
  const nodeIds = clusterChildMarkers.map(
    (childMarker: any) => childMarker.nodeId
  );
  nodeIds.forEach((childNodeId: string) => {
    hiddenEdges
      .filter((edge) => edge.source === childNodeId)
      .forEach((edge) => {
        const nodes = nodesData.filter((node) => node.id === edge.target);
        for (const node of nodes) {
          targetNodeMap.set(node.id, [node, edge]);
        }
      });
  });

  for (const [, [node, edge]] of targetNodeMap) {
    const { lat: clusterLat, lng: clusterLng } = clusterLatLon;
    const { lat: nodeLat, lon: nodeLng } = node.data;
    const size = getEdgesSize(edge);
    const weightEddg = size !== null ? nodeLogValueScale(size) / 2 : 0;
    const curveAnimated = renderEdgesAnimatedLinesOnMap(
      [clusterLat, clusterLng],
      [nodeLat!, nodeLng!],
      weightEddg,
      edge.controls
    );
    const curveLine = renderEdgesLinesOnMap(
      [clusterLat, clusterLng],
      [nodeLat!, nodeLng!],
      weightEddg,
      edge.controls,
      edge.type
    );
    if (curveAnimated && curveLine) {
      hiddenEdgesLayer.addLayer(curveLine);
      hiddenEdgesLayer.addLayer(curveAnimated);
    }
  }
}
