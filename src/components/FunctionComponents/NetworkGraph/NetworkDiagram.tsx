import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { RADIUS, drawNetwork } from './drawNetwork';
import { Datas, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import { findNode } from './findNode';

type NetworkDiagramProps = {
  width: number;
  height: number;
  data: Datas;
};

export const NetworkDiagram = ({
  width,
  height,
  data,
}: NetworkDiagramProps) => {
  // The force simulation mutates links and nodes, so create a copy first
  // Node positions are initialized by d3

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef(d3.zoomIdentity);
  const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
  // Create new arrays for edges and nodes
  const edges: Edges[] = data.edges.map((d) => ({ ...d }));
  const nodes: Nodes[] = data.nodes.map((d) => ({ ...d }));
  // Create an array of node IDs for faster lookups
  const nodeIds = new Set(nodes.map((node) => node.uuid));

  // Filter the edges to include only those with source and target nodes in the simulation
  const validEdges = edges.filter(
    (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
  );
  useEffect(() => {
    // set dimension of the canvas element
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!context) {
      return;
    }

    if (!simulationRef.current || simulationRef.current.nodes() !== nodes) {
      simulationRef.current = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink<Nodes, Edges>(validEdges)
            .id((uuid) => uuid.uuid)
            .distance(150)
        )
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', () => {
          drawNetwork(context, width, height, nodes, validEdges);
        });
    }
    const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      transformRef.current = event.transform;
      context?.clearRect(0, 0, width, height);
      context?.save();
      context?.translate(transformRef.current.x, transformRef.current.y);
      context?.scale(transformRef.current.k, transformRef.current.k);

      // Redraw your nodes and links using the new context
      drawNetwork(context, width, height, nodes, validEdges);
      context?.restore();
    };

    function dragSubject(
      event: d3.D3DragEvent<SVGSVGElement, any, any>
    ): Nodes | undefined {
      const x = transformRef.current.invertX(event.x);
      const y = transformRef.current.invertY(event.y);
      const node = findNode(nodes, x, y, RADIUS);

      if (node && typeof node.x === 'number' && typeof node.y === 'number') {
        node.x = transformRef.current.applyX(node.x);
        node.y = transformRef.current.applyY(node.y);
      }

      return node;
    }
    function dragStarted(
      event: d3.D3DragEvent<HTMLCanvasElement, Nodes, unknown>
    ): void {
      if (!event.active) {
        simulationRef.current?.alphaTarget(0.3).restart();
      }
      if (event.subject) {
        const node = event.subject as Nodes;
        node.fx = node.x;
        node.fy = node.y;
      }
    }

    function dragged(
      event: d3.D3DragEvent<SVGSVGElement, Nodes, unknown>
    ): void {
      if (event.subject) {
        const node = event.subject as Nodes;

        node.fx = event.x;
        node.fy = event.y;
      }
    }

    function dragEnded(
      event: d3.D3DragEvent<SVGSVGElement, Nodes, unknown>
    ): void {
      if (!event.active) {
        simulationRef.current?.alphaTarget(0);
      }
      if (event.subject) {
        const node = event.subject as Nodes;
        node.fx = null;
        node.fy = null;
      }
    }

    (d3.select(canvas) as any)
      .call(
        (d3.drag() as any)
          .container(() => canvas)
          .subject(dragSubject)
          .on('start', dragStarted)
          .on('drag', dragged)
          .on('end', dragEnded)
      )
      .call((d3.zoom() as any).scaleExtent([1 / 10, 8]).on('zoom', zoomed));
  }, [width, height, edges, nodes]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          width,
          height,
        }}
        width={width}
        height={height}
      />
    </div>
  );
};
