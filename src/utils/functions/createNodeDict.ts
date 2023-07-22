import { NodeAggroutes } from "@/share/InterfaceTypesMap";

export const createNodeDict = (nodesData: NodeAggroutes[]) => {
    const nodesDict: { [key: string]: any } = {};
    nodesData.forEach((node) => {
        nodesDict[node.id] = [node.data.lat, node.data.lon];

    });
    return nodesDict;
};
