import { NodeAggroutes } from "@/share/InterfaceTypesMap";
import { getNodeSize } from "./getNodeSize";


export const getMinValueNode = (nodesData: NodeAggroutes[]) => {
    let minNodeSize = Infinity;
    nodesData.forEach((node) => {
        const nodeSize = getNodeSize(node);
        if (nodeSize) {
            if (nodeSize < minNodeSize) {
                minNodeSize = nodeSize;
            }
        }
    });
    return minNodeSize;

}

export const getMaxValueNode = (nodesData: NodeAggroutes[]) => {

    let maxNodeSize = -Infinity;
    nodesData.forEach((node) => {
        const nodeSize = getNodeSize(node);
        if (nodeSize) {

            if (nodeSize > maxNodeSize) {
                maxNodeSize = nodeSize;
            }
        }
    });
    return maxNodeSize;
}

