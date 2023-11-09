import { NodeAggroutes } from "@/share/InterfaceTypesMap";
import { getNodeSize } from "./getNodeSize";

export const getMinValueNode = (nodesData: NodeAggroutes[]): number => {
    let minNodeSize = Infinity;
    nodesData?.length > 0 && nodesData.forEach((node) => {
        const nodeSize = getNodeSize(node);
        if (nodeSize) {
            if (nodeSize < minNodeSize) {
                minNodeSize = nodeSize;
            }
        }
    });
    return minNodeSize;
}

export const getMaxValueNode = (nodesData: NodeAggroutes[]): number => {
    let maxNodeSize = -Infinity;
    nodesData?.length > 0 && nodesData.forEach((node) => {
        const nodeSize = getNodeSize(node);
        if (nodeSize) {

            if (nodeSize > maxNodeSize) {
                maxNodeSize = nodeSize;
            }
        }
    });
    return maxNodeSize;
}

