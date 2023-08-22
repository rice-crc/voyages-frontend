import { createdLableNode } from '@/utils/functions/createdLableNode';
import { Edges, Nodes } from '@/utils/mockDataGraph';
import { scaleOrdinal } from 'd3';
// Define a mapping of node_class values to custom colors
const classToColor = {
  enslaved: '#906866',
  enslavers: '#46A88C',
  enslavement_relations: '#ab47bc',
  voyages: '#93D0CB',
};

export const RADIUS = 10;
export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Nodes[],
  edges: Edges[],
  newNode: Nodes | null
) => {
  context.clearRect(0, 0, width, height);

  // Draw the links (edges) between nodes
  context.globalAlpha = 8;
  context.strokeStyle = '#aaa';
  context.lineWidth = 1.5;

  edges.forEach((link: any) => {
    context.beginPath();
    context.moveTo(link.source.x, link.source.y);
    context.lineTo(link.target.x, link.target.y);
    context.stroke();
  });

  // Draw the nodes
  context.globalAlpha = 1;
  context.lineWidth = 3;

  // Keep track of existing node UUIDs to avoid duplicates
  const existingNodeUUIDs = new Set(nodes.map((node) => node.uuid));

  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    context.beginPath();
    context.moveTo(node.x + RADIUS, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    const fillColor =
      classToColor[node.node_class as keyof typeof classToColor] || 'gray';
    context.fillStyle = fillColor;
    context.strokeStyle = '#fff';
    context.lineWidth = 0.5;
    context.stroke();
    context.closePath();
    context.fill();

    const textHeight = -15;
    const labelNode = createdLableNode(node);
    if (labelNode && newNode && newNode && node.id === newNode.id) {
      // Set the background color for the text label
      context.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Set the desired background color with opacity
      const textWidth = context.measureText(labelNode).width;
      const borderRadius = 4;
      const padding = 2;
      // Calculate the coordinates for the label background
      const labelX = node.x + 12;
      const labelY = node.y + RADIUS + textHeight / 2;
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
      context.font = '11px Arial';
      context.fillText(labelNode, labelX, labelY + 2); // Adjust the position as needed
    }
  });
};
