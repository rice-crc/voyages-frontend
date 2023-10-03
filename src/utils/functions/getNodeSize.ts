import { EdgesAggroutes, NodeAggroutes, Transportation } from "@/share/InterfaceTypesMap";

export function getNodeSize(node: NodeAggroutes): number | null {

    const weightsVal = Object.keys(node.weights).length !== 0;

    if (weightsVal) {
        const weights = node.weights;
        const originValue = weights.origin !== undefined ? weights.origin : 0;
        const postDisembarkationValue = weights?.disembarkation ?? 0;
        return (weights.disembarkation ?? 0) + (weights.embarkation ?? 0) + originValue + postDisembarkationValue;
    }
    return null;
}

export function getEdgesSize(edges: EdgesAggroutes) {
    if (edges) {
        return edges.weight;
    }
    return null;
}
