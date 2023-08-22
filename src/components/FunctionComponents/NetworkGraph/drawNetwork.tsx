import { RADIUSNODE, classToColor } from '@/share/CONST_DATA';
import { Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import {
  createSrokeColor,
  createdLableEdges,
  createdLableNode,
  createdLableNodeHover,
} from '@/utils/functions/createdLableNode';

export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Nodes[],
  edges: Edges[],
  newNode: any | Nodes | null,
  transform: d3.ZoomTransform
) => {
  context.clearRect(0, 0, width, height);
  // Save the current context state
  context.save();

  // Apply the zoom transformation to the context
  context.translate(transform.x, transform.y);
  context.scale(transform.k, transform.k);

  // Draw the links (edges) between nodes
  context.globalAlpha = 8;
  context.lineWidth = 2;
  edges.forEach((link: any) => {
    const strokeColor = createSrokeColor(link);
    if (strokeColor) {
      context.strokeStyle = strokeColor;
    }
    // Apply the transformation to the edge's source and target positions
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
      if (labelEdge && newNode && link.source.id === newNode?.source?.id) {
        const angle = Math.atan2(
          link.target.y - link.source.y,
          link.target.x - link.source.x
        );

        // Calculate the midpoint of the edge
        const midpointX = (link.source.x + link.target.x) / 2;
        const midpointY = (link.source.y + link.target.y) / 2;

        context.save(); // Save the current canvas state
        context.translate(midpointX, midpointY); // Translate to the midpoint
        context.rotate(angle + Math.PI); // Rotate by the calculated angle

        // Offset to move the label away from the edge line
        const offset = -15; // Adjust this value as needed

        context.fillStyle = '#fff';
        context.font = '9px Arial'; // Adjust the font style as needed
        context.fillText(labelEdge, offset, -3); // Place the label at (offset, 0) after rotation
        context.restore();
      }
    }
  });

  context.globalAlpha = 1;

  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }
    // Apply the transformation to the node's position
    const x = node.x ?? 0;
    const y = node.y ?? 0;

    context.beginPath();
    context.arc(x, y, RADIUSNODE, 0, 2 * Math.PI);

    context.moveTo(node.x + RADIUSNODE, node.y);
    context.arc(node.x, node.y, RADIUSNODE, 0, 2 * Math.PI);
    const fillColor =
      classToColor[node.node_class as keyof typeof classToColor] || 'gray';
    context.fillStyle = fillColor;
    context.strokeStyle = '#fff';
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
    context.fill();
    const textHeight = -15;
    const labelNode = createdLableNode(node);
    const labelX = node.x + 12;
    const labelY = node.y + RADIUSNODE + textHeight / 2;
    context.beginPath();
    context.closePath();
    context.fill();
    context.fillStyle = '#fff';
    context.font = '500 10px Arial';
    if (labelNode) {
      context.fillText(labelNode, labelX - 1, labelY + 1);
      context.restore();
    }
    const labelNodeHover = createdLableNodeHover(node);
    if (labelNodeHover && newNode && node.id === newNode.id) {
      const padding = 2;
      const textWidth = context.measureText(labelNodeHover).width + 35;
      context.fillStyle = 'rgba(255, 255, 255)';
      const borderRadius = 4;
      const labelX = node.x + 12;
      const labelY = node.y + RADIUSNODE + textHeight / 2;
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
      context.closePath();
      context.fill();
      context.fillStyle = '#000';
      context.font = '500 11px Arial';
      context.fillText(labelNodeHover, labelX + 2, labelY + 2); // Adjust the position as needed
    }
  });
};
