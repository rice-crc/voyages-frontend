import { FunctionComponent, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
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
import {
  ZOOM_LEVEL_THRESHOLD,
  maxRadiusInPixels,
  minRadiusInPixels,
} from '@/share/CONST_DATA';
import { EdgesAggroutes, NodeAggroutes } from '@/share/InterfaceTypesMap';
import * as d3 from 'd3';
import { getNodeSize } from '@/utils/functions/getNodeSize';
import '@/style/map.scss';
import renderPolylineEdgesNodeMap from './renderPolylineEdgesNodeMap';
import renderEdgesAnimatedLines from './renderEdgesAnimatedLines';

class CustomMarker extends L.CircleMarker {
  nodeId: string;
  constructor(
    latlng: L.LatLngExpression,
    radius: number,
    color: string,
    fillColor: string,
    fillOpacity: number,
    nodeId: string
  ) {
    super(latlng, {
      radius: radius,
      weight: 1,
      color: color,
      fillColor: fillColor,
      fillOpacity: fillOpacity,
    });
    this.nodeId = nodeId;
  }
}
interface NodeEdgesCurvedLinesMapProps {
  zoomLevel: number;
}
const NodeEdgesCurvedLinesMap: FunctionComponent<
  NodeEdgesCurvedLinesMapProps
> = ({ zoomLevel }) => {
  const { nodesData, edgesData } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );

  const nodeLogValueScale = d3
    .scaleLog()
    .domain([getMinValueNode(nodesData), getMaxValueNode(nodesData)])
    .range([minRadiusInPixels, maxRadiusInPixels]);

  const map = useMap();
  const [lineCurves, setLineCurves] = useState<L.Curve[]>([]);

  const edgesNoOrigin = edgesData.filter(
    (edge) => edge.type !== 'origination' && edge.type !== 'disposition'
  );

  const newLineCurves: L.Curve[] = [];
  const animateEdgesCurvedLines = () => {
    edgesNoOrigin.forEach((edge: EdgesAggroutes) => {
      const curve = renderPolylineEdgesNodeMap(
        null,
        null,
        edge,
        edge.type,
        nodesData
      );
      const curveAnimated = renderEdgesAnimatedLines(
        null,
        null,
        edge,
        edge.type,
        nodesData
      );
      if (curve && curveAnimated) {
        curve.addTo(map);
        curveAnimated.addTo(map);
        newLineCurves.push(curve, curveAnimated);
      }
    });
    setLineCurves(newLineCurves);
  };

  useEffect(() => {
    animateEdgesCurvedLines();
    const handleZoomChange = () => {
      setLineCurves([]);
    };

    map.on('zoomend', handleZoomChange);
    return () => {
      map.off('zoomend', handleZoomChange);
    };
  }, [nodesData, edgesData, map]);

  const edgesWithOrigin = edgesData.filter(
    (edge) => edge.type === 'origination' || edge.type === 'disposition'
  );

  useEffect(() => {
    if (map && lineCurves.length > 0) {
      lineCurves.forEach((curve) => {
        curve.addTo(map);
      });
    }

    const hiddenEdgesLayer = L.layerGroup();

    const markerCluster = L.markerClusterGroup({
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
          iconSize: new L.Point(40, 40, true),
        });
      },
    })
      .on('clustermouseover', (event) => {
        const clusterLatLon = event.layer.getLatLng();

        const clusterChildMarkers = event.layer.getAllChildMarkers();
        const nodeIds = clusterChildMarkers.map(
          (childMarker: any) => childMarker.nodeId
        );

        const targetNodeMap = new Map<
          string,
          [NodeAggroutes, EdgesAggroutes]
        >();

        nodeIds.forEach((childNodeIdodeId: string) => {
          edgesWithOrigin
            .filter((edge) => edge.source === childNodeIdodeId)
            .forEach((edge) => {
              const nodes = nodesData.filter((node) => node.id === edge.target);
              for (const node of nodes) {
                targetNodeMap.set(node.id, [node, edge]);
              }
            });
        });

        for (const [, [node, edge]] of targetNodeMap) {
          const { lat, lng } = clusterLatLon;
          const curve = renderPolylineEdgesNodeMap(
            [lat, lng],
            [node.data.lat!, node.data.lon!],
            edge,
            edge.type,
            nodesData
          );
          const curveAnimated = renderEdgesAnimatedLines(
            [lat, lng],
            [node.data.lat!, node.data.lon!],
            edge,
            edge.type,
            nodesData
          );

          if (curve && curveAnimated) {
            hiddenEdgesLayer.addLayer(curve);
            hiddenEdgesLayer.addLayer(curveAnimated);
          }
        }
      })
      .on('clustermouseout', () => {
        hiddenEdgesLayer.clearLayers();
      });

    if (map) {
      map.addLayer(hiddenEdgesLayer);
    }

    nodesData.forEach((node) => {
      const { data, weights } = node;
      const { lat, lon, name } = data;
      const { origin } = weights;
      const size = getNodeSize(node);
      const nodeColor = getNodeColorMapVoyagesStyle(node);
      const radius = size !== null ? nodeLogValueScale(size) : 0;

      if (lat && lon && radius) {
        const latlon: LatLngExpression = [lat, lon];
        const circleMarker = new CustomMarker(
          latlon,
          radius,
          '#000000',
          nodeColor,
          0.8,
          node.id
        );

        const popupContent = `<p>${name}</p>`;
        circleMarker.bindPopup(popupContent);
        if (origin && origin > 0) {
          markerCluster.addLayer(circleMarker);
        } else {
          circleMarker.addTo(map).bringToFront();
        }
      }
    });

    if (map) {
      map.addLayer(markerCluster);
    }

    return () => {
      if (map) {
        map.removeLayer(hiddenEdgesLayer);
        map.removeLayer(markerCluster);
      }
    };
  }, [map, nodesData, nodeLogValueScale, edgesData, zoomLevel]);

  console.log('nodes-->', nodesData.length);
  console.log('edges-->', edgesData.length);
  console.log('zommmm-->', zoomLevel);

  return null;
};

export default NodeEdgesCurvedLinesMap;
