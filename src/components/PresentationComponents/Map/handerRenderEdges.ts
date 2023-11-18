import { EdgesAggroutes, LatLng, NodeAggroutes } from "@/share/InterfaceTypesMap";
import { createNodeDict } from "@/utils/functions/createNodeDict";
import { createLogValueScale } from "@/utils/functions/createNodeLogValueScale";
import { getEdgesSize } from "@/utils/functions/getNodeSize";
import renderEdgesAnimatedLinesOnMap from "./renderEdgesAnimatedLinesOnMap";
import renderEdgesLinesOnMap from "./renderEdgesLinesOnMap";
import L from 'leaflet';

export const handerRenderEdges = (edgesToRender: EdgesAggroutes[], nodesData: NodeAggroutes[], map: L.Map) => {
    const nodeLogValueScale = createLogValueScale(nodesData);
    const nodesDict = createNodeDict(nodesData);
    edgesToRender.forEach((edge) => {
        const { controls, weight, type } = edge;
        const source = nodesDict[edge?.source || 0.15];
        const target = nodesDict[edge?.target || 0.2];

        const size = getEdgesSize(edge);
        const weightEddg = size !== null ? nodeLogValueScale(size) / 3 : 0;

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
                curveLine.addTo(map)
                curveAnimated.addTo(map)
                const tooltipContent = `${weight} people transported`;
                const tooltip = L.tooltip({
                    direction: 'top',
                    permanent: false,
                    opacity: 0.90,
                }).setContent(tooltipContent);

                curveLine.bindTooltip(tooltip);
                curveLine.on('mouseover', (event) => {
                    curveLine.openTooltip();
                    tooltip.setLatLng(event.latlng);
                });

                curveLine.on('mouseout', () => {
                    curveLine.closeTooltip();
                });
            }
        }
    });
}