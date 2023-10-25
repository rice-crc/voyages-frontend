
import { NodeAggroutes } from "@/share/InterfaceTypesMap";

export const createNodeDict = (nodesData: NodeAggroutes[]) => {
    const nodesDict: { [key: string]: [number, number] | null } = {};
    nodesData.forEach((node) => {
        const latitude = node?.data?.lat;
        const longitude = node?.data?.lon;

        if (latitude !== undefined && longitude !== undefined) {
            nodesDict[node.id] = [latitude, longitude];
        } else {
            nodesDict[node.id] = null;
        }
    });
    return nodesDict;
};