import {
  EdgesAggroutedSourceTarget,
  EdgesAggroutes,
  NodeAggroutes,
} from '@/share/InterfaceTypesMap';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import L from 'leaflet';
import renderEdgesAnimatedLinesOnMap from './renderEdgesAnimatedLinesOnMap';
import renderEdgesLinesOnMap from './renderEdgesLinesOnMap';
import { createSourceAndTargetDictionariesNodeEdges } from '../../../utils/functions/createSourceAndTargetDictionariesNodeEdges';
import { createLogValueScale } from '@/utils/functions/createNodeLogValueScale';
import { createRoot } from 'react-dom/client';
import { TooltipHoverTableOnNode } from './TooltipHoverTableOnNode';

export function handleHoverCircleMarker(
  event: L.LeafletEvent,
  hiddenEdgesLayer: L.LayerGroup<any>,
  edgesData: EdgesAggroutes[],
  nodesData: NodeAggroutes[],
  originNodeMarkersMap: Map<string, L.Marker<any>>,
  originMarkerCluster: L.MarkerClusterGroup,
  handleSetClusterKeyValue: (value: string, nodeType: string) => void,
  map: L.Map
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

  const sourceEdges = createSourceAndTargetDictionariesNodeEdges(
    nodeHoverID,
    hiddenEdgesData
  );

  const targetNode = nodesData.find((node) => node.id === nodeHoverID)!;

  const { lat: targetLat, lon: targetLng } = targetNode?.data!;
  sourceEdges.forEach((sourceEdge: EdgesAggroutes) => {
    const sourceNodeId = sourceEdge.source;
    const originNode = originNodeMarkersMap.get(sourceNodeId);
    if (originNode) {
      const visibleParent = originMarkerCluster.getVisibleParent(originNode!);
      if (visibleParent) {
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
    }
  });
  /**
   ====  WAIT To discuss Keep the labes for now ===== 
   const popupContainer = document.createElement('center');
   popupContainer.className = 'tablePopup'
  popupContainer.style.width = '300px'
  const popupRoot = createRoot(popupContainer);
  popupRoot.render(
    <TooltipHoverTableOnNode
      nodesDatas={nodesData}
      nodeType={''}
      handleSetClusterKeyValue={handleSetClusterKeyValue}
    />
  );
  event.target.bindPopup(popupContainer).openPopup();
   **/


  for (const [, edgeData] of aggregatedEdges) {
    const { sourceLatlng, targetLatlng, controls, type } = edgeData;

    const size = getEdgesSize(edgeData);
    const weightEddg = size !== null ? nodeLogValueScale(size) : 0;

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
      hiddenEdgesLayer.addLayer(curveLine.addTo(map).bringToBack());
      hiddenEdgesLayer.addLayer(curveAnimated);
    }
  }
}
