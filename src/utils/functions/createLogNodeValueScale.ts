import { EdgesAggroutes, NodeAggroutes } from "@/share/InterfaceTypesMap";
import { getMaxValueNode, getMinValueNode } from "./getMinMaxValueNode";
import * as d3 from 'd3';
import { maxEdgeInPixels, maxRadiusInPixels, minEdgeInPixels, minRadiusInPixels } from "@/share/CONST_DATA";
import { getMaxValueEdge, getMinValueEdge } from "./getMinMaxValueEdge";

export function createLogNodeValueScale(nodesData: NodeAggroutes[]) {

    const domainRanges = [getMinValueNode(nodesData), getMaxValueNode(nodesData)];
    const scale = d3.scaleLog()
        .domain(domainRanges)
        .range([minRadiusInPixels, maxRadiusInPixels]);

    return scale;
}


export function createLogWeihtValueScale(edgeData: EdgesAggroutes[]) {
    const domainRanges = [getMinValueEdge(edgeData), getMaxValueEdge(edgeData)];
    const scale = d3.scaleLog()
        .domain(domainRanges)
        .range([minEdgeInPixels, maxEdgeInPixels]);

    return scale;
}

