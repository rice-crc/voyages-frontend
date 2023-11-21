import { RADIUSNODE, classToColor } from '@/share/CONST_DATA';
import { Edges, Nodes, NodesID } from '@/share/InterfaceTypePastNetworks';
import {
  createSrokeColor,
  createdLableEdges,
  createdLableNodeHover,
} from '@/utils/functions/createdLableNode';

export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Nodes[],
  edges: Edges[],
  newNode: Edges | Nodes | null,
) => {
  context.clearRect(0, 0, width, height);

  context.globalAlpha = 8;
  context.lineWidth = 2;
  edges.forEach((link: any) => {
    const strokeColor = createSrokeColor(link);
    if (strokeColor) {
      context.strokeStyle = strokeColor;
    }


    const sourceNode = nodes.find((node) => node.uuid === link.source.uuid);
    const targetNode = nodes.find((node) => node.uuid === link.target.uuid);

    if (sourceNode && targetNode) {
      const sourceX = sourceNode.x ?? 0;
      const sourceY = sourceNode.y ?? 0;
      const targetX = targetNode.x ?? 0;
      const targetY = targetNode.y ?? 0;

      const labelEdge = createdLableEdges(link);
      context.beginPath();
      context.moveTo(sourceX, sourceY);
      context.lineTo(targetX, targetY);
      context.stroke();
      if (labelEdge && newNode) {
        const source = newNode.source as Nodes | NodesID | string;
        if (typeof source !== 'string' && source && 'id' in source) {
          if (link.source.id === source.id) {
            const angle = Math.atan2(
              link.target.y - link.source.y,
              link.target.x - link.source.x
            );
            const midpointX = (link.source.x + link.target.x) / 2;
            const midpointY = (link.source.y + link.target.y) / 2;

            context.save();
            context.translate(midpointX, midpointY);
            context.rotate(angle + Math.PI);
            const offset = -15;
            context.fillStyle = '#fff';
            context.font = '12px Arial';
            context.fillText(labelEdge, offset, -6);
            context.restore();
          }
        }
      }
    }
  });

  context.globalAlpha = 1;

  nodes.forEach((node) => {
    if (!node.x || !node.y) return;
    const nodeX = node.x ?? 0;
    const nodeY = node.y ?? 0;

    context.beginPath();
    context.moveTo(nodeX + RADIUSNODE, nodeY);
    context.arc(nodeX, nodeY, RADIUSNODE, 0, 3 * Math.PI);

    const fillColor =
      classToColor[node.node_class as keyof typeof classToColor] || 'gray';
    context.fillStyle = fillColor;
    context.strokeStyle = '#fff';
    context.lineWidth = 3;
    context.stroke();
    context.fill();

    // === If want to hide label and will show when hover comment those below
    const labelNode = createdLableNodeHover(node);
    context.fillStyle = '#fff';
    context.font = '500 14px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(labelNode!, nodeX + 15, nodeY - 4);
    context.closePath();

    //***  ===== Hide Hover with Heigh Light on Node ===== ***
    /* const labelNodeHover = createdLableNodeHover(node);
     if (labelNodeHover && newNode) {
       if ('id' in newNode) {
         if (node.id === newNode.id) {
           const padding = 2;
           const textWidth = context.measureText(labelNodeHover).width + 35;
           context.fillStyle = '#fff';
           const borderRadius = 4;
           const labelX = node.x + 20;
           const labelY = node.y
           const labelLeft = labelX - padding;
           const labelRight = labelX + textWidth + padding;
           const labelTop = labelY - 8 - padding;
           const labelBottom = labelY + 4 + padding;
 
           context.beginPath();
           context.moveTo(labelX + borderRadius, labelY - 10);
           context.lineTo(labelRight - borderRadius, labelTop);
 
           context.arc(
             labelRight - borderRadius,
             labelTop + borderRadius,
             borderRadius,
             -Math.PI / 2,
             0
           );
           context.lineTo(labelRight, labelBottom - borderRadius);
           context.arc(
             labelRight - borderRadius,
             labelBottom - borderRadius,
             borderRadius,
             0,
             Math.PI / 2
           );
           context.lineTo(labelLeft + borderRadius, labelBottom);
           context.arc(
             labelLeft + borderRadius,
             labelBottom - borderRadius,
             borderRadius,
             0,
             Math.PI
           );
           context.lineTo(labelLeft, labelTop + borderRadius);
           context.arc(
             labelLeft + borderRadius,
             labelTop + borderRadius,
             borderRadius,
             Math.PI,
             -Math.PI / 2,
             false
           );
           context.fill();
           context.fillStyle = '#000';
           context.font = '500 11px Arial';
           context.fillText(labelNodeHover, labelX + 2, labelY + 10);
           context.closePath();
         }
       }
     }*/

  });
};
