import { EdgesAggroutes } from '@/share/InterfaceTypesMap';

export function createSourceAndTargetDictionariesNodeEdges(
  nodeHoverID: string,
  hiddenEdgesData: EdgesAggroutes[]
) {
  return hiddenEdgesData.flatMap<EdgesAggroutes>((edge) =>
    edge.target === nodeHoverID
      ? [
          {
            controls: edge.controls,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            weight: edge.weight,
          },
        ]
      : []
  );
}
