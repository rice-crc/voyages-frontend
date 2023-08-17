import { Edges, Nodes } from '@/utils/mockDataGraph';
import { scaleOrdinal, schemeSet3 } from 'd3';

export const RADIUS = 15;
export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Nodes[],
  edges: Edges[]
) => {
  context.clearRect(0, 0, width, height);
  // Color Scale
  const allGroups = [...new Set(nodes.map((d) => d.node_class))];
  const colorScale = scaleOrdinal<string>()
    .domain(allGroups)
    // .range(schemeSet3);
    .range(['#556cd6', '#46A88C', '#93D0CB', '#ab47bc']);

  // Draw the links (edges) between nodes
  context.globalAlpha = 10;
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
  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }

    context.beginPath();
    context.moveTo(node.x + RADIUS, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    // context.ellipse(node.x, node.y, 30, 15, Math.PI / 180, 0, 2 * Math.PI);

    // context.fillStyle = colorScale(String(node.uuid));
    context.fillStyle = colorScale(String(node.node_class));
    context.strokeStyle = '#fff';
    context.lineWidth = 1.5;
    context.stroke();
    context.fill();
    context.fillStyle = '#000';
    context.font = '8px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const textHeight = -25;
    const labelX = node.x;
    const labelY = node.y + RADIUS + textHeight / 2;
    context.fillText(String(node.id), labelX, labelY);
  });
};
