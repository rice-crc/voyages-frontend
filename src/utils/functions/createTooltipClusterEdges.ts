import {
  ORIGINATIONNODE,
  nodeTypeOrigin,
  nodeTypePostDisembarkation,
} from '@/share/CONST_DATA';
import { NodeAggroutes } from '@/share/InterfaceTypesMap';

export function createTooltipClusterEdges(
  weights: any,
  nodeData: NodeAggroutes,
  nodeType: string,
  nodesDatas: NodeAggroutes[]
): string {
  const remainingNodes = nodesDatas!.slice(1);

  const firstClusterTargetNode = nodesDatas[0].data.name;
  let tooltip = '';
  if (nodeType === nodeTypeOrigin || nodeType === ORIGINATIONNODE) {
    tooltip += `${weights} Liberated Africans taken to ${nodeData.data.name}`;
  } else if (nodeType === nodeTypePostDisembarkation) {
    tooltip += `${weights} people who disembarked in ${nodeData.data.name} ended up in ${firstClusterTargetNode} and ${remainingNodes.length} other locations`;
  }
  return tooltip;
}

export function createTooltipEmbarkDiseEmbarkEdges(node: NodeAggroutes) {
  const { data, weights } = node;
  const { disembarkation, embarkation } = weights;
  const { name } = data;
  let popupContent = '';
  if (embarkation || disembarkation) {
    const embarkedText = embarkation ? `${embarkation} people embarked` : '';
    const disembarkedText = disembarkation
      ? `${disembarkation} people disembarked`
      : '';

    const separator = embarkation && disembarkation ? ' and ' : '';

    popupContent = `<p>${name}: ${embarkedText}${separator}${disembarkedText}.</p>`;
  }
  return popupContent;
}
