import { NodeAggroutes, Transportation } from "@/share/InterfaceTypesMap";

export function getNodeSize(node: NodeAggroutes): number | null {
    const weightsVal = Object.keys(node.weights).length !== 0;
    if (weightsVal) {
        const weights = node.weights;
        const originValue = weights.origin !== undefined ? weights.origin : 0;
        const postDisembarkationValue = weights["post-disembarkation"] ? weights["post-disembarkation"] : 0
        return weights.disembarkation + weights.embarkation + originValue + postDisembarkationValue;
    }
    return null;
}

export function getEdgesSize(edges: Transportation) {
    if (edges) {
        return edges.w;
    }
    return null;
}
