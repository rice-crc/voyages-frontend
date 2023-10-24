import { EdgesAggroutes, NodeAggroutes } from '@/share/InterfaceTypesMap';
import { getEdgesSize } from '@/utils/functions/getNodeSize';
import L from 'leaflet';
import renderEdgesAnimatedLinesOnMap from './renderEdgesAnimatedLinesOnMap';
import {
    getMaxValueNode,
    getMinValueNode,
} from '@/utils/functions/getMinMaxValueNode';
import { maxRadiusInPixels, minRadiusInPixels } from '@/share/CONST_DATA';
import * as d3 from 'd3';
import renderEdgesLinesOnMap from './renderEdgesLinesOnMap';
import { createLogValueScale } from '@/utils/functions/createNodeLogValueScale';


export function handleHoverPostDisembarkationsMarkerCluster(
    event: L.LeafletEvent,
    hiddenEdgesLayer: L.LayerGroup<any>,
    edgesData: EdgesAggroutes[],
    nodesData: NodeAggroutes[]
) {
    hiddenEdgesLayer.clearLayers();
    const nodeLogValueScale = createLogValueScale(nodesData);

    const sourceEdgesMap = new Map<string, EdgesAggroutes[]>();
    const targetEdgesMap = new Map<string, EdgesAggroutes[]>();

    const nodesMap = new Map<string, NodeAggroutes>();

    nodesData.forEach((node) => {
        nodesMap.set(node.id, node);
    });
    edgesData.forEach((edge) => {
        if (!sourceEdgesMap.has(edge.source)) sourceEdgesMap.set(edge.source, []);
        sourceEdgesMap.get(edge.source)?.push(edge);

        if (!targetEdgesMap.has(edge.target)) targetEdgesMap.set(edge.target, []);
        targetEdgesMap.get(edge.target)?.push(edge);
    });
    const clusterLatLon = event.layer.getLatLng();
    const clusterChildMarkers = event.layer.getAllChildMarkers();
    const nodeIdsClusters = clusterChildMarkers.map(
        (childMarker: any) => childMarker.nodeId
    );

    const sourceNodes: [NodeAggroutes, EdgesAggroutes][] = [];
    const targetNodes: [NodeAggroutes, EdgesAggroutes][] = [];

    for (const childNodeId of nodeIdsClusters) {
        const targetEdges = targetEdgesMap.get(childNodeId);
        if (targetEdges) {
            for (const targetEdge of targetEdges) {
                const sourceNode = nodesMap.get(targetEdge.source);
                if (sourceNode) sourceNodes.push([sourceNode, targetEdge]);
            }
        }
        const sourceEdges = sourceEdgesMap.get(childNodeId);
        if (sourceEdges) {
            for (const sourceEdge of sourceEdges) {
                const targetNode = nodesMap.get(sourceEdge.target);
                if (targetNode) targetNodes.push([targetNode, sourceEdge]);
            }
        }
    }

    const { lat: clusterLat, lng: clusterLng } = clusterLatLon;

    // sourceNodes --> clusterNode to target
    for (const [sourceNode, targetEdge] of sourceNodes) {
        const { controls, type } = targetEdge;
        const { lat: sourceLat, lon: sourceLng } = sourceNode.data!;

        const size = getEdgesSize(targetEdge);
        const weightEddg = size !== null ? nodeLogValueScale(size) / 2 : 0;

        const curveAnimated = renderEdgesAnimatedLinesOnMap(
            [sourceLat!, sourceLng!],
            [clusterLat, clusterLng],
            weightEddg,
            controls
        );
        const curveLine = renderEdgesLinesOnMap(
            [sourceLat!, sourceLng!],
            [clusterLat, clusterLng],
            weightEddg,
            controls,
            type
        );
        if (curveLine && curveAnimated) {
            hiddenEdgesLayer.addLayer(curveLine);
            hiddenEdgesLayer.addLayer(curveAnimated);
        }
    }

    // targetNodes --> clusterNode to source
    for (const [targetNode, sourceEdge] of targetNodes) {
        const { controls, type } = sourceEdge;
        const { lat: targetLat, lon: targetLng } = targetNode.data!;

        const size = getEdgesSize(sourceEdge);
        const weightEddg = size !== null ? nodeLogValueScale(size) / 2 : 0;
        const curveAnimated = renderEdgesAnimatedLinesOnMap(
            [targetLat!, targetLng!],
            [clusterLat, clusterLng],
            weightEddg,
            controls
        );
        const curveLine = renderEdgesLinesOnMap(
            [targetLat!, targetLng!],
            [clusterLat, clusterLng],
            weightEddg,
            controls,
            type
        );

        if (curveLine && curveAnimated) {
            hiddenEdgesLayer.addLayer(curveLine);
            hiddenEdgesLayer.addLayer(curveAnimated);
        }
    }
}
