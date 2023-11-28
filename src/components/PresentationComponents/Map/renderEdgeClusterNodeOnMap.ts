import { EdgesAggroutes, LatLng, NodeAggroutes } from "@/share/InterfaceTypesMap";
import renderEdgesAnimatedLinesOnMap from "./renderEdgesAnimatedLinesOnMap";
import renderEdgesLinesOnMap from "./renderEdgesLinesOnMap";
import L from "leaflet";

import { createTooltipClusterEdges } from "../../../utils/functions/createTooltipClusterEdges";
import { Root } from "react-dom/client";
export function renderEdgeClusterNodeOnMap(
    hiddenEdgesLayer: L.LayerGroup<any>,
    edge: EdgesAggroutes,
    node: NodeAggroutes,
    coordinatesStart: LatLng,
    coordinatesEnd: LatLng,
    weightEdges: number,
    nodeType: string,
    map: L.Map,
    event: L.LeafletEvent,
    childNodesData?: NodeAggroutes[],
) {
    const curveAnimated = renderEdgesAnimatedLinesOnMap(
        coordinatesStart,
        coordinatesEnd,
        weightEdges,
        edge.controls
    );

    const curveLine = renderEdgesLinesOnMap(
        coordinatesStart,
        coordinatesEnd,
        weightEdges,
        edge.controls,
        edge.type
    );

    if (curveAnimated && curveLine) {

        hiddenEdgesLayer.addLayer(curveLine.addTo(map).bringToBack());
        hiddenEdgesLayer.addLayer(curveAnimated);

        const tooltipContent = createTooltipClusterEdges(edge.weight, node, nodeType, childNodesData!);
        const tooltip = L.tooltip({
            direction: 'top',
            permanent: false,
            opacity: 0.90,
            sticky: false,
        }).setContent(tooltipContent);

        curveLine.bindTooltip(tooltip);
        curveLine.on('mouseover', (e) => {
            curveLine.openTooltip();
            tooltip.setLatLng(e.latlng);
            map.closePopup();
        });
    }
}