import { EdgesAggroutes, NodeAggroutes } from "@/share/InterfaceTypesMap";

export function getNodeSize(node: NodeAggroutes): number | number {

    const weightsVal = Object.keys(node.weights).length !== 0;

    if (!weightsVal) return 0;

    const weights = node.weights;
    const originValue = weights.origin !== undefined ? weights.origin : 0;
    const postDisembarkationValue = weights?.disembarkation ?? 0;
    const size = (weights.disembarkation ?? 0) + (weights.embarkation ?? 0) + originValue + postDisembarkationValue;
    return size;
}

export function getEdgesSize(edges: EdgesAggroutes) {
    if (!edges) return 0
    return edges.weight;

}
