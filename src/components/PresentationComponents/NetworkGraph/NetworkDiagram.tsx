

import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { drawNetwork } from './drawNetwork';
import { netWorkDataProps, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import { findNode } from './findNode';
import { RADIUSNODE } from '@/share/CONST_DATA';
import { findHoveredEdge } from './findHoveredEdge';
import ShowsAcoloredNodeKey from './ShowsAcoloredNodeKey';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';

type NetworkDiagramProps = {
  width: number;
  height: number;
  netWorkData: netWorkDataProps;
  handleNodeDoubleClick: (nodeId: number, nodeClass: string) => Promise<void>;
  handleClickNodeShowCard: (nodeId: number, nodeClass: string) => Promise<void>;
};

export const NetworkDiagram = ({
  width,
  height,
  netWorkData,
  handleNodeDoubleClick,
  handleClickNodeShowCard,
}: NetworkDiagramProps) => {
  const dispatch: AppDispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
  const isDraggingRef = useRef(false);
  const isZoomingRef = useRef(false);
  const hoverEnabledRef = useRef(true);
  const clickTimeout = useRef<NodeJS.Timeout | undefined>();
  let timeout = 300;

  const edges: Edges[] = netWorkData.edges.map((d) => ({ ...d }));
  const nodes: Nodes[] = netWorkData.nodes.map((d) => ({ ...d }));

  const nodeIds = new Set(nodes.map((node) => node.uuid));

  const validEdges = edges.filter(
    (edge) =>
      nodeIds.has(edge.source as string) && nodeIds.has(edge.target as string)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    simulationRef.current = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink<Nodes, Edges>(validEdges)
          .id((uuid) => uuid.uuid)
          .distance(120)
      ).force('collide', d3.forceCollide().radius(RADIUSNODE))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    simulationRef.current.on('tick', () => {
      updateCanvas();
    });


    const handleDoubleClick = (event: MouseEvent) => {
      if (!canvas || !context) {
        return;
      }
      const x = event.clientX - canvas.getBoundingClientRect().left;
      const y = event.clientY - canvas.getBoundingClientRect().top;
      const node = findNode(nodes, x, y, RADIUSNODE);

      if (node) {
        handleNodeDoubleClick(node.id, node.node_class);
        updateCanvas();
      }
    };

    const handleClickNodeCard = (event: MouseEvent) => {
      if (!canvas || !context) {
        return;
      }
      const x = event.clientX - canvas.getBoundingClientRect().left;
      const y = event.clientY - canvas.getBoundingClientRect().top;
      const node = findNode(nodes, x, y, RADIUSNODE);

      if (node) {
        handleClickNodeShowCard(node.id, node.node_class);
      }
    };

    function updateCanvas() {
      const context = canvasRef.current?.getContext('2d');
      if (!context) return;

      context.clearRect(0, 0, width, height);

      // Redraw only the necessary parts based on the simulation state
      drawNetwork(context, width, height, nodes, validEdges, null);
    }


    if (
      !simulationRef.current ||
      simulationRef.current.nodes() !== nodes ||
      simulationRef.current.force<d3.ForceLink<Nodes, Edges>>('link')?.links() !== validEdges
    ) {
      simulationRef.current = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink<Nodes, Edges>(validEdges)
            .id((uuid) => uuid.uuid)
            .distance(120)
        )
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2))
        .on('tick', () => {
          drawNetwork(context, width, height, nodes, validEdges, null);
        })
    }

    const handleZoom = (event: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
      transformRef.current = event.transform;
      transformRef.current = d3.zoomTransform(canvas);
      isZoomingRef.current = true;
      hoverEnabledRef.current = false;
      isDraggingRef.current = false;
      context?.clearRect(0, 0, width, height);
      context?.save();
      context?.translate(transformRef.current.x, transformRef.current.y);
      context?.scale(transformRef.current.k, transformRef.current.k);
      drawNetwork(context, width, height, nodes, validEdges, null);
      context?.restore();
    };

    function handleWheelEvent(event: WheelEvent) {
      event.preventDefault();
      handleZoom(
        event as unknown as d3.D3ZoomEvent<HTMLCanvasElement, unknown>
      );
    }

    const clearClickTimeout = () => {
      if (clickTimeout.current !== undefined) {
        clearTimeout(clickTimeout.current);
        clickTimeout.current = undefined;
      }
    };

    if (canvas && context) {
      canvas.addEventListener('mousemove', checkMouseoverNode);
      canvas.addEventListener('mousemove', checkMouseoverEdges);
      canvas.addEventListener('wheel', handleWheelEvent);
      canvas.addEventListener('click', (event: MouseEvent) => {
        clearClickTimeout();
        handleDoubleClick(event);
        if (event.detail === 1) {
          clickTimeout.current = setTimeout(() => {
            handleClickNodeCard(event);
          }, timeout);
        }
        if (event.detail === 2) {
          handleDoubleClick(event);
        }
      });

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
          const newNode: Nodes | Edges | null = node || null;

          if (newNode) {
            canvas.style.cursor = 'pointer';
            drawNetwork(context, width, height, nodes, validEdges, newNode);
          } else {
            canvas.style.cursor = 'default';
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

          const edgesHover = findHoveredEdge(validEdges, nodes, x, y);
          const newEdge = edgesHover || null;

          if (newEdge) {
            canvas.style.cursor = 'pointer';
            drawNetwork(context, width, height, nodes, validEdges, newEdge);
          } else {
            canvas.style.cursor = 'default';
          }
        }
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

      function dragged(event: d3.D3DragEvent<SVGSVGElement, Nodes, unknown>): void {
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

      const dragBehavior = d3.drag<HTMLCanvasElement, unknown>();

      dragBehavior
        .container(() => canvas)
        .subject(dragSubject)
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded);
      d3.select(canvas)
        .call(dragBehavior)
        .call(
          d3
            .zoom<HTMLCanvasElement, unknown>()
            .scaleExtent([1 / 10, 8])
            .on('zoom', handleZoom)
        ).on("dblclick.zoom", null).on("click.zoom", null)

      return () => {
        canvas.removeEventListener('mousemove', checkMouseoverNode);
        canvas.removeEventListener('mousemove', checkMouseoverEdges);
        canvas.removeEventListener('dblclick', handleDoubleClick);
        canvas.removeEventListener('click', handleClickNodeCard);
        canvas.removeEventListener('wheel', handleWheelEvent);
        dragBehavior.on('start', null).on('drag', null).on('end', null);
      };
    }
  }, [dispatch, width, height, edges, nodes]);



  return (
    <>
      <canvas
        id="networkCanvas labelsContainer"
        ref={canvasRef}
        width={width}
        height={height}
      />
      <ShowsAcoloredNodeKey />
    </>
  );
};


