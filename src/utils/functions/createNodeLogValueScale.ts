import { NodeAggroutes } from "@/share/InterfaceTypesMap";
import { getMaxValueNode, getMinValueNode } from "./getMinMaxValueNode";
import * as d3 from 'd3';
import { maxRadiusInPixels, minRadiusInPixels } from "@/share/CONST_DATA";

export function createLogValueScale(nodesData: NodeAggroutes[]) {

    const domainRanges = [getMinValueNode(nodesData), getMaxValueNode(nodesData)];

    const scale = d3.scaleLog()
        .domain(domainRanges)
        .range([minRadiusInPixels, maxRadiusInPixels]);

    return scale;
}

