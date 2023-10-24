import {
  EdgesAggroutedSourceTarget,
  EdgesAggroutes,
  NodeAggroutes,
} from '@/share/InterfaceTypesMap';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import L from 'leaflet';
import renderEdgesAnimatedLinesOnMap from './renderEdgesAnimatedLinesOnMap';
import renderEdgesLinesOnMap from './renderEdgesLinesOnMap';
import { createSourceEdges } from './createSourceAndTargetDictionaries';
import { createLogValueScale } from '@/utils/functions/createNodeLogValueScale';

export function handleHoverCircleMarker(
  event: L.LeafletEvent,
  hiddenEdgesLayer: L.LayerGroup<any>,
  edgesData: EdgesAggroutes[],
  nodesData: NodeAggroutes[],
  originNodeMarkersMap: Map<string, L.Marker<any>>,
  originMarkerCluster: L.MarkerClusterGroup
) {
  const aggregatedEdges = new Map<string, EdgesAggroutedSourceTarget>();
  hiddenEdgesLayer.clearLayers();
  aggregatedEdges.clear();
  const nodeHoverID = event.target.nodeId;

  const hiddenEdgesData = edgesData.filter(
    (edge) =>
      (edge.target === nodeHoverID || edge.source === nodeHoverID) &&
      (edge.type === 'origination' || edge.type === 'disposition')
  );

  const nodeLogValueScale = createLogValueScale(nodesData);

  const sourceEdges = createSourceEdges(nodeHoverID, hiddenEdgesData);

  const targetNode = nodesData.find((node) => node.id === nodeHoverID)!;

  const { lat: targetLat, lon: targetLng } = targetNode?.data!;
  sourceEdges.forEach((sourceEdge) => {
    const sourceNodeId = sourceEdge.source;
    const originNode = originNodeMarkersMap.get(sourceNodeId);
    if (originNode) {
      const visibleParent = originMarkerCluster.getVisibleParent(originNode!);

      const { lat: sourceLat, lng: sourceLng } = visibleParent!.getLatLng();

      const parentKeyLeaflet = [sourceLat, sourceLng].join();

      if (!aggregatedEdges.has(parentKeyLeaflet)) {
        const newAggregatedEdge: EdgesAggroutedSourceTarget = {
          ...sourceEdge,
          sourceLatlng: [sourceLat, sourceLng],
          targetLatlng: [targetLat!, targetLng!],
          controls: sourceEdge.controls,
          weight: sourceEdge.weight,
        };
        aggregatedEdges.set(parentKeyLeaflet, newAggregatedEdge);
      }
    }
  });

  for (const [, edgeData] of aggregatedEdges) {
    const { sourceLatlng, targetLatlng, controls, type } = edgeData;

    const size = getEdgesSize(edgeData);
    const weightEddg = size !== null ? nodeLogValueScale(size) / 1.5 : 0;

    const curveAnimated = renderEdgesAnimatedLinesOnMap(
      sourceLatlng,
      targetLatlng,
      weightEddg,
      controls
    );
    const curveLine = renderEdgesLinesOnMap(
      targetLatlng,
      sourceLatlng,
      weightEddg,
      controls,
      type
    );
    if (curveAnimated && curveLine) {
      hiddenEdgesLayer.addLayer(curveLine);
      hiddenEdgesLayer.addLayer(curveAnimated);
    }
  }
}
