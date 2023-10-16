import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLngExpression, Marker } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import {
  getMaxValueNode,
  getMinValueNode,
} from '@/utils/functions/getMinMaxValueNode';
import { getNodeColorMapVoyagesStyle } from '@/utils/functions/getNodeColorStyle';
import '@johnconnor_mulligan/leaflet.curve';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { maxRadiusInPixels, minRadiusInPixels } from '@/share/CONST_DATA';
import {
  EdgesAggroutes,
  EdgesAggroutedSourceTarget,
  NodeAggroutes,
  CustomMarker,
  LatLng,
} from '@/share/InterfaceTypesMap';
import * as d3 from 'd3';
import { getEdgesSize, getNodeSize } from '@/utils/functions/getNodeSize';
import '@/style/map.scss';
import { createSourceEdges } from './createSourceAndTargetDictionaries';
import renderEdgesAnimatedLinesOnMap from './renderEdgesAnimatedLinesOnMap';
import renderEdgesLinesOnMap from './renderEdgesLinesOnMap';
import { createNodeDict } from '@/utils/functions/createNodeDict';

const NodeEdgesCurvedLinesMap = () => {
  const map = useMap();

  const { nodesData, edgesData } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );

  const nodesMap = new Map<string, NodeAggroutes>();

  nodesData.forEach((node) => {
    nodesMap.set(node.id, node);
  });

  const sourceEdgesMap = new Map<string, EdgesAggroutes[]>();
  const targetEdgesMap = new Map<string, EdgesAggroutes[]>();
  edgesData.forEach((edge) => {
    if (!sourceEdgesMap.has(edge.source)) sourceEdgesMap.set(edge.source, []);
    sourceEdgesMap.get(edge.source)?.push(edge);

    if (!targetEdgesMap.has(edge.target)) targetEdgesMap.set(edge.target, []);
    targetEdgesMap.get(edge.target)?.push(edge);
  });
  const hiddenEdgesLayer = L.layerGroup();
  const updateEdgesAndNodes = () => {
    map.eachLayer((layer) => {
      if (
        layer instanceof L.Curve ||
        layer instanceof L.MarkerClusterGroup ||
        layer instanceof L.CircleMarker ||
        layer instanceof L.Marker
      ) {
        map.removeLayer(layer);
      }
    });

    const domainRanges = [
      getMinValueNode(nodesData),
      getMaxValueNode(nodesData),
    ];

    const nodeLogValueScale = d3
      .scaleLog()
      .domain(domainRanges)
      .range([minRadiusInPixels, maxRadiusInPixels]);
    const hiddenEdges = edgesData.filter(
      (edge) => edge.type === 'origination' || edge.type === 'disposition'
    );

    const edgesToRender = edgesData.filter(
      (edge) => edge.type !== 'origination' && edge.type !== 'disposition'
    );

    const nodesDict = createNodeDict(nodesData);

    edgesToRender.forEach((edge: EdgesAggroutes) => {
      const { controls, weight, type } = edge;
      const source = nodesDict[edge?.source || 0.15];
      const target = nodesDict[edge?.target || 0.2];

      const size = getEdgesSize(edge);
      const weightEddg = size !== null ? nodeLogValueScale(size) / 4 : 0;

      if (source && target && weight) {
        const startLatLng: LatLng = [source[0], source[1]];
        const endLatLng: LatLng = [target[0], target[1]];
        const curveAnimated = renderEdgesAnimatedLinesOnMap(
          startLatLng,
          endLatLng,
          weightEddg,
          controls
        );
        const curveLine = renderEdgesLinesOnMap(
          startLatLng,
          endLatLng,
          weightEddg,
          controls,
          type
        );
        if (curveAnimated && curveLine) {
          curveLine.addTo(map);
          curveAnimated.addTo(map);
        }
      }
    });

    //  Render originMarkerCluster
    const originMarkerCluster = L.markerClusterGroup({
      zoomToBoundsOnClick: false,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false,
      iconCreateFunction: function (cluster) {
        const childCount = cluster.getChildCount();
        let c = ' marker-cluster-';
        if (childCount < 10) {
          c += 'large';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'small';
        }
        const backgroundColor = 'rgb(96, 192, 171)';
        const borderColor = 'black';
        const opacity = 1.5;
        return new L.DivIcon({
          html:
            '<div style="background-color:' +
            backgroundColor +
            '; border: 1px solid ' +
            borderColor +
            '; opacity: ' +
            opacity +
            ';"></div>',
          className: 'marker-cluster' + c,
          iconSize: new L.Point(50, 50, true),
        });
      },
    }).on('clustermouseover', async (event) => {
      hiddenEdgesLayer.clearLayers();
      const clusterLatLon = event.layer.getLatLng();
      const clusterChildMarkers = event.layer.getAllChildMarkers();
      const nodeIds = clusterChildMarkers.map(
        (childMarker: any) => childMarker.nodeId
      );

      const targetNodeMap = new Map<string, [NodeAggroutes, EdgesAggroutes]>();

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
    });

    // Render postDisembarkationsMarkerCluster
    const postDisembarkationsMarkerCluster = L.markerClusterGroup({
      zoomToBoundsOnClick: false,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: false,
      iconCreateFunction: function (cluster) {
        const childCount = cluster.getChildCount();
        let c = ' marker-cluster-';
        if (childCount < 10) {
          c += 'large';
        } else if (childCount < 100) {
          c += 'medium';
        } else {
          c += 'small';
        }
        const backgroundColor = 'rgb(246,193,60)';
        const borderColor = 'black';
        const opacity = 1.5;
        return new L.DivIcon({
          html:
            '<div style="background-color:' +
            backgroundColor +
            '; border: 1px solid ' +
            borderColor +
            '; opacity: ' +
            opacity +
            ';"></div>',
          className: 'marker-cluster' + c,
          iconSize: new L.Point(40, 40, true),
        });
      },
    }).on('clustermouseover', (event) => {
      hiddenEdgesLayer.clearLayers();
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
    });

    const aggregatedEdges = new Map<string, EdgesAggroutedSourceTarget>();
    const originNodeMarkersMap = new Map<string, Marker>();

    nodesData.forEach((node) => {
      const { data, weights, id: nodeID } = node;
      const { lat, lon, name } = data;
      const { origin, 'post-disembarkation': postDisembarkation } = weights;
      const size = getNodeSize(node);
      const nodeColor = getNodeColorMapVoyagesStyle(node);
      const logSize = nodeLogValueScale(size);
      const radius = isNaN(logSize) ? 0 : (logSize as number);

      if (lat && lon) {
        const latlon: LatLngExpression = [lat, lon];
        const circleMarker = new CustomMarker(
          latlon,
          radius,
          radius === 0 ? 'transparent' : '#000',
          radius === 0 ? 'transparent' : nodeColor,
          0.8,
          nodeID
        );
        const originMarker = L.marker(latlon);

        const popupContent = `<p>${name}</p>`;
        circleMarker.bindPopup(popupContent);

        circleMarker.on('mouseover', (event) => {
          hiddenEdgesLayer.clearLayers();

          const nodeHoverID = event.target.nodeId;

          const hiddenEdgesData = edgesData.filter(
            (edge) =>
              (edge.target === nodeHoverID || edge.source === nodeHoverID) &&
              (edge.type === 'origination' || edge.type === 'disposition')
          );

          const sourceEdges = createSourceEdges(nodeHoverID, hiddenEdgesData);

          const targetNode = nodesData.find((node) => node.id === nodeHoverID)!;

          const { lat: targetLat, lon: targetLng } = targetNode?.data!;
          sourceEdges.forEach((sourceEdge) => {
            const sourceNodeId = sourceEdge.source;
            const originNode = originNodeMarkersMap.get(sourceNodeId);
            const visibleParent = originMarkerCluster.getVisibleParent(
              originNode!
            );

            const { lat: sourceLat, lng: sourceLng } =
              visibleParent.getLatLng();

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
          });

          for (const [, edgeData] of aggregatedEdges) {
            const { sourceLatlng, targetLatlng, controls, type } = edgeData;

            const size = getEdgesSize(edgeData);
            const weightEddg =
              size !== null ? nodeLogValueScale(size) / 1.5 : 0;

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
        });

        if (origin && origin > 0) {
          originNodeMarkersMap.set(nodeID, originMarker);
          originMarkerCluster.addLayer(circleMarker);
          originMarkerCluster.addLayer(originMarker);
        } else if (postDisembarkation && postDisembarkation > 0) {
          postDisembarkationsMarkerCluster.addLayer(circleMarker);
        } else {
          circleMarker.addTo(map).bringToFront();
        }
      }
    });

    if (map) {
      map.addLayer(originMarkerCluster);
      map.addLayer(postDisembarkationsMarkerCluster);
      map.addLayer(hiddenEdgesLayer);
    }
  };

  useEffect(() => {
    if (map) {
      updateEdgesAndNodes();
    }
  }, [nodesData, edgesData, map]);

  return null;
};

export default NodeEdgesCurvedLinesMap;
