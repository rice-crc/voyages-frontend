import { Edges, Nodes } from '@/share/InterfaceTypePastNetworks';

export function findHoveredEdge(
  edges: Edges[],
  nodes: Nodes[],
  mouseX: number,
  mouseY: number
) {
  for (const edge of edges) {
    if (typeof edge.source !== 'string' && typeof edge.target !== 'string') {
      const sourceUuid = 'uuid' in edge.source ? edge.source.uuid : null;
      const targetUuid = 'uuid' in edge.target ? edge.target.uuid : null;

      if (sourceUuid && targetUuid) {
        const sourceNode = nodes.find((node) => node.uuid === sourceUuid);
        const targetNode = nodes.find((node) => node.uuid === targetUuid);
        if (sourceNode && targetNode) {
          const sourceX = typeof sourceNode.x === 'number' ? sourceNode.x : 0;
          const sourceY = typeof sourceNode.y === 'number' ? sourceNode.y : 0;
          const targetX = typeof targetNode.x === 'number' ? targetNode.x : 0;
          const targetY = typeof targetNode.y === 'number' ? targetNode.y : 0;

          const minX = Math.min(sourceX, targetX);
          const minY = Math.min(sourceY, targetY);
          const maxX = Math.max(sourceX, targetX);
          const maxY = Math.max(sourceY, targetY);

          if (
            mouseX >= minX &&
            mouseX <= maxX &&
            mouseY >= minY &&
            mouseY <= maxY
          ) {
            return edge;
          }
        }
      }
    }
  }
  return null;
}
