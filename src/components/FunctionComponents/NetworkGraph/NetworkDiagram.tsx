import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { drawNetwork } from './drawNetwork';
import { Datas, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import { findNode } from './findNode';
import { RADIUSNODE } from '@/share/CONST_DATA';
import { findHoveredEdge } from './findHoveredEdge';

type NetworkDiagramProps = {
  width: number;
  height: number;
  data: Datas;
  handleNodeDoubleClick: (nodeId: number, nodeClass: string) => Promise<void>;
};

export const NetworkDiagram = ({
  width,
  height,
  data,
  handleNodeDoubleClick,
}: NetworkDiagramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef(d3.zoomIdentity);
  const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
  const isDraggingRef = useRef(false); // Flag to track drag state
  const isZoomingRef = useRef(false); // Flag to track zoom state
  const hoverEnabledRef = useRef(true); // Flag to enable/disable hover

  // Create new arrays for edges and nodes
  const edges: Edges[] = data.edges.map((d) => ({ ...d }));
  const nodes: Nodes[] = data.nodes.map((d) => ({ ...d }));

  // Create an array of node IDs for faster lookups
  const nodeIds = new Set(nodes.map((node) => node.uuid));

  // Filter the edges to include only those with source and target nodes in the simulation
  const validEdges = edges.filter(
    (edge) =>
      nodeIds.has(edge.source as string) && nodeIds.has(edge.target as string)
  );

  // Define a function to handle the double-click event on a node
  const handleDoubleClick = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;
    const node = findNode(nodes, x, y, RADIUSNODE);
    if (node) {
      const nodeID = node.id;
      const nodeClass = node.node_class;
      handleNodeDoubleClick(nodeID, nodeClass);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!context) {
      return;
    }

    function checkMouseoverNode(event: MouseEvent) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (!canvas || !context) {
        return;
      }
      if (!isDraggingRef.current && !isZoomingRef.current) {
        const x = event.clientX - canvas.getBoundingClientRect().left;
        const y = event.clientY - canvas.getBoundingClientRect().top;
        const node = findNode(nodes, x, y, RADIUSNODE);
        // Ensure that node is either a valid object or null
        const newNode = node || null;

        // Check if the hovered node has changed before updating state
        if (newNode) {
          // simulationRef.current?.stop();
          drawNetwork(
            context,
            width,
            height,
            nodes,
            validEdges,
            newNode,
            transformRef.current
          );
        }
      }
    }

    function checkMouseoverEdges(event: MouseEvent) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');

      if (!canvas || !context) {
        return;
      }
      if (!isDraggingRef.current && !isZoomingRef.current) {
        const x = event.clientX - canvas.getBoundingClientRect().left;
        const y = event.clientY - canvas.getBoundingClientRect().top;
        // Find the edge at the mouse position
        const edgesHover = findHoveredEdge(validEdges, nodes, x, y);
        const newEdge = edgesHover || null;
        // Check if the hovered node has changed before updating state
        if (newEdge) {
          // simulationRef.current?.stop();
          drawNetwork(
            context,
            width,
            height,
            nodes,
            validEdges,
            newEdge,
            transformRef.current
          );
        }
      }
    }

    if (!simulationRef.current || simulationRef.current.nodes() !== nodes) {
      simulationRef.current = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink<Nodes, Edges>(validEdges)
            .id((uuid) => uuid.uuid)
            .distance(90)
        )
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', () => {
          drawNetwork(
            context,
            width,
            height,
            nodes,
            validEdges,
            null,
            transformRef.current
          );
        });
    }

    if (canvas && context) {
      canvas.addEventListener('mousemove', checkMouseoverNode);
      canvas.addEventListener('dblclick', handleDoubleClick);
      canvas.addEventListener('mousemove', checkMouseoverEdges);
      return () => {
        canvas.removeEventListener('mousemove', checkMouseoverNode);
        canvas.removeEventListener('dblclick', handleDoubleClick);
        canvas.addEventListener('mousemove', checkMouseoverEdges);
      };
    }
  }, [width, height, edges, nodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!context) {
      return;
    }

    function dragSubject(
      event: d3.D3DragEvent<SVGSVGElement, any, any>
    ): Nodes | undefined {
      const x = transformRef.current.invertX(event.x);
      const y = transformRef.current.invertY(event.y);
      const node = findNode(nodes, x, y, RADIUSNODE);
      if (node && typeof node.x === 'number' && typeof node.y === 'number') {
        node.x = transformRef.current.applyX(node.x);
        node.y = transformRef.current.applyY(node.y);
      }
      return node;
    }

    function dragStarted(
      event: d3.D3DragEvent<HTMLCanvasElement, Nodes, unknown>
    ): void {
      isDraggingRef.current = true;
      hoverEnabledRef.current = false;
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
      isDraggingRef.current = false;
      hoverEnabledRef.current = true;
      if (event.subject) {
        const node = event.subject as Nodes;

        node.fx = event.x;
        node.fy = event.y;
      }
    }

    function dragEnded(
      event: d3.D3DragEvent<SVGSVGElement, Nodes, unknown>
    ): void {
      isDraggingRef.current = false;
      hoverEnabledRef.current = true;
      if (!event.active) {
        simulationRef.current?.alphaTarget(0);
      }
      if (event.subject) {
        const node = event.subject as Nodes;
        node.fx = null;
        node.fy = null;
      }
    }

    // const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
    //   transformRef.current = event.transform;
    //   isZoomingRef.current = true;
    //   hoverEnabledRef.current = false;
    //   context?.clearRect(0, 0, width, height);
    //   context?.save();
    //   context?.translate(transformRef.current.x, transformRef.current.y);
    //   context?.scale(transformRef.current.k, transformRef.current.k);
    //   drawNetwork(
    //     context,
    //     width,
    //     height,
    //     nodes,
    //     validEdges,
    //     null,
    //     transformRef.current
    //   );
    //   context?.restore();
    // };

    if (canvas && context) {
      const dragBehavior = d3.drag<HTMLCanvasElement, unknown>();

      if (canvas) {
        dragBehavior.container(() => canvas);
      }

      dragBehavior
        .subject(dragSubject)
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded);

      (
        d3.select(canvas) as d3.Selection<
          HTMLCanvasElement,
          unknown,
          null,
          undefined
        >
      ).call(dragBehavior);
      // .call(
      //   d3
      //     .zoom<HTMLCanvasElement, unknown>()
      //     .scaleExtent([1 / 10, 8])
      //     .on('zoom', zoomed)
      // );
    }
  }, [width, height, edges, nodes]);
  return (
    <canvas
      id="networkCanvas labelsContainer"
      ref={canvasRef}
      style={{
        width,
        height,
      }}
      width={width}
      height={height}
    />
  );
};
