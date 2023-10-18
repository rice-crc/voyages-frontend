import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLngExpression, Marker } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import { getNodeColorMapVoyagesStyle } from '@/utils/functions/getNodeColorStyle';
import '@johnconnor_mulligan/leaflet.curve';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import {
  EdgesAggroutes,
  CustomMarker,
  LatLng,
} from '@/share/InterfaceTypesMap';
import { getEdgesSize, getNodeSize } from '@/utils/functions/getNodeSize';
import '@/style/map.scss';
import renderEdgesAnimatedLinesOnMap from './renderEdgesAnimatedLinesOnMap';
import renderEdgesLinesOnMap from './renderEdgesLinesOnMap';
import { createNodeDict } from '@/utils/functions/createNodeDict';
import { handleHoverOriginMarkerCluster } from './handleHoverOriginMarkerCluster';
import { handleHoverPostDisembarkationsMarkerCluster } from './handleHoverPostDisembarkationsMarkerCluster';
import { createLogValueScale } from '@/utils/functions/createNodeLogValueScale';
import { handleHoverCircleMarker } from './handleHoverCircleMarker';

const NodeEdgesCurvedLinesMap = () => {
  const map = useMap();

  const { nodesData, edgesData } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );

  const updateEdgesAndNodes = () => {
    const hiddenEdgesLayer = L.layerGroup();
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
    const nodeLogValueScale = createLogValueScale(nodesData);
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
      handleHoverOriginMarkerCluster(
        event,
        hiddenEdgesLayer,
        hiddenEdges,
        nodesData
      );
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
      handleHoverPostDisembarkationsMarkerCluster(
        event,
        hiddenEdgesLayer,
        edgesData,
        nodesData
      );
    });

    const originNodeMarkersMap = new Map<string, Marker>();

    nodesData.forEach((node) => {
      const { data, weights, id: nodeID } = node;
      const { lat, lon, name } = data;
      const {
        origin,
        'post-disembarkation': postDisembarkation,
        disembarkation,
        embarkation,
      } = weights;
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
        circleMarker.on('mousemove', (event) => {
          handleHoverCircleMarker(
            event,
            hiddenEdgesLayer,
            edgesData,
            nodesData,
            originNodeMarkersMap,
            originMarkerCluster
          );
        });

        if (disembarkation !== 0 || embarkation !== 0) {
          circleMarker.addTo(map).bringToFront();
        } else if (origin && origin > 0) {
          originNodeMarkersMap.set(nodeID, originMarker);
          originMarkerCluster.addLayer(circleMarker);
          originMarkerCluster.addLayer(originMarker);
        } else if (
          Number(postDisembarkation) &&
          Number(postDisembarkation) > 0 &&
          disembarkation === 0 &&
          embarkation === 0
        ) {
          postDisembarkationsMarkerCluster.addLayer(circleMarker);
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
