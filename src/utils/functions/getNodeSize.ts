import { NodeAggroutes, Transportation } from "@/share/InterfaceTypesMap";

export function getNodeSize(node: NodeAggroutes): number | null {
    const weightsVal = Object.keys(node.weights).length !== 0;
    if (weightsVal) {
        const w = node.weights;
        return w.disembarkation + w.embarkation;
    }
    return null;
}

export function getEdgesSize(edges: Transportation) {
    if (edges) {
        return edges.w;
    }
    return null;
}
