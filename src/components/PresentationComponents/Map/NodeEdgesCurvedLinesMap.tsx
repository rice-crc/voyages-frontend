import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLngExpression, Marker } from 'leaflet';
import '@/style/table-popup.scss';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet/dist/leaflet.css';
import { getNodeColorMapVoyagesStyle } from '@/utils/functions/getNodeColorStyle';
import '@johnconnor_mulligan/leaflet.curve';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { CustomMarker, EdgesAggroutes } from '@/share/InterfaceTypesMap';
import { getNodeSize } from '@/utils/functions/getNodeSize';
import '@/style/map.scss';
import { createLogValueScale } from '@/utils/functions/createNodeLogValueScale';
import { handleHoverCircleMarker } from './handleHoverCircleMarker';
import { handleHoverMarkerCluster } from './handleHoverMarkerCluster';
import { DISPOSTIONNODE, ORIGINATIONNODE, ORIGINLanguageGroupKEY, nodeTypeOrigin, nodeTypePostDisembarkation, postDisembarkLocationKEY } from '@/share/CONST_DATA';
import { setClusterNodeKeyVariable, setClusterNodeValue } from '@/redux/getNodeEdgesAggroutesMapDataSlice';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { handerRenderEdges } from './handerRenderEdges';
import { createTooltipEmbarkDiseEmbarkEdges } from '@/utils/functions/createTooltipClusterEdges';


const NodeEdgesCurvedLinesMap = () => {
  const map = useMap();
  const dispatch: AppDispatch = useDispatch();

  const { nodesData, edgesData, } = useSelector(
    (state: RootState) => state.getNodeEdgesAggroutesMapData
  );

  const handleSetClusterKeyValue = (value: string, nodeType: string) => {
    if (nodeType === nodeTypeOrigin) {
      dispatch(setClusterNodeKeyVariable(ORIGINLanguageGroupKEY))
      dispatch(setClusterNodeValue(value))
    } else if (nodeType === nodeTypePostDisembarkation) {
      dispatch(setClusterNodeKeyVariable(postDisembarkLocationKEY))
      dispatch(setClusterNodeValue(value))
    }
  }

  const updateEdgesAndNodes = () => {
    const hiddenEdgesLayer = L.layerGroup().addTo(map)

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
      (edge: EdgesAggroutes) => edge.type === ORIGINATIONNODE || edge.type === DISPOSTIONNODE
    );

    const edgesToRender = edgesData.filter(
      (edge: EdgesAggroutes) => edge.type !== ORIGINATIONNODE && edge.type !== DISPOSTIONNODE
    );

    // Render edges when page rendering
    handerRenderEdges(edgesToRender, nodesData, map)

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
      handleHoverMarkerCluster(
        event,
        hiddenEdgesLayer,
        hiddenEdges,
        nodesData,
        nodeTypeOrigin,
        handleSetClusterKeyValue,
        map,
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
      handleHoverMarkerCluster(
        event,
        hiddenEdgesLayer,
        hiddenEdges,
        nodesData,
        nodeTypePostDisembarkation,
        handleSetClusterKeyValue,
        map,
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
          radius === 0 ? 'transparent' : '#000000',
          radius === 0 ? 'transparent' : nodeColor,
          0.8,
          nodeID
        );

        const popupContent = createTooltipEmbarkDiseEmbarkEdges(node)

        circleMarker.bindPopup(popupContent).bringToFront();

        const originMarker = L.marker(latlon);
        circleMarker.on('mouseover', (event) => {
          circleMarker.openPopup();
          handleHoverCircleMarker(
            event,
            hiddenEdgesLayer,
            edgesData,
            nodesData,
            originNodeMarkersMap,
            originMarkerCluster,
            handleSetClusterKeyValue, // WAIT To Change if want to show table,
            map,
          );
        })

        if (disembarkation !== 0 || embarkation !== 0) {
          circleMarker.addTo(map).bringToFront();
        } else if (origin && origin > 0) {
          originNodeMarkersMap.set(nodeID, originMarker);
          originMarkerCluster.addLayer(circleMarker).bringToFront();
          originMarkerCluster.addLayer(originMarker).bringToFront();
        } else if (
          (Number(postDisembarkation) && Number(postDisembarkation) > 0) &&
          (disembarkation === 0 && embarkation === 0)
        ) {
          postDisembarkationsMarkerCluster.addLayer(circleMarker).bringToFront();
        }
      }
    });

    if (map) {
      map.addLayer(hiddenEdgesLayer);
      map.addLayer(originMarkerCluster);
      map.addLayer(postDisembarkationsMarkerCluster);
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

