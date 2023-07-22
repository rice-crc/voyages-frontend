import { NodeAggroutes } from "@/share/InterfaceTypesMap";
import { getNodeSize } from "./getNodeSize";


export const getNodeColorMapVoyagesStyle = (node: NodeAggroutes) => {

    const weightsVal = Object.keys(node.weights).length !== 0;
    const totalSize = getNodeSize(node);
    if (weightsVal && totalSize) {
        let nodeColor = `rgb(246,193,60)`
        const { disembarkation, embarkation } = node.weights
        const disembarkationPercent = disembarkation / totalSize
        const embarkationPercent = embarkation / totalSize
        if (disembarkation !== 0 || embarkation !== 0) {
            const r = 255 * embarkationPercent;
            const g = 255 * 0;
            const b = 255 * disembarkationPercent;
            nodeColor = `rgb(${r}, ${g}, ${b})`
        }
        return nodeColor;
    }
}
