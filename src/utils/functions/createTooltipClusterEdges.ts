import { nodeTypeOrigin, nodeTypePostDisembarkation } from '@/share/CONST_DATA';
import { NodeAggroutes } from "@/share/InterfaceTypesMap"


export function createTooltipClusterEdges(weights: any, nodeData: NodeAggroutes, nodeType: string): string {
    let tooltip = ''
    if (nodeType === nodeTypeOrigin) {
        tooltip += `${weights} Liberated Africans taken to ${nodeData.data.name}`
    } else if (nodeType === nodeTypePostDisembarkation) {
        tooltip += `${weights} people who disembarked in ${nodeData.data.name}`
        // "X people who disembarked in SOURCE NODE LABEL ended up in FIRST CLUSTER TARGET NODE LABEL and Y other locations"
    }
    return tooltip;
}