import { NodeAggroutes } from "@/share/InterfaceTypesMap";

export function getNodeSize(node: NodeAggroutes): number | null {
    const weightsVal = Object.keys(node.weights).length !== 0;
    if (weightsVal) {
        const w = node.weights;
        return w.disembarkation + w.embarkation;
    }
    else {
        return null;
    }
}
