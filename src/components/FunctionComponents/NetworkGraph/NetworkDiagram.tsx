import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { drawNetwork } from './drawNetwork';
import { Datas, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import { findNode } from './findNode';
import { RADIUSNODE } from '@/share/CONST_DATA';
import { findHoveredEdge } from './findHoveredEdge';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { setNodeClass } from '@/redux/getCardFlatObjectSlice';
import { setNetWorksID } from '@/redux/getPastNetworksGraphDataSlice';

type NetworkDiagramProps = {
  width: number;
  height: number;
  data: Datas;
  handleNodeDoubleClick: (nodeId: number, nodeClass: string) => Promise<void>;
  handleClickNodeShowCard: (nodeId: number, nodeClass: string) => Promise<void>;
};

export const NetworkDiagram = ({
  width,
  height,
  data,
  handleNodeDoubleClick,
  handleClickNodeShowCard,
}: NetworkDiagramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
  const isDraggingRef = useRef(false); // Flag to track drag state
  const isZoomingRef = useRef(false); // Flag to track zoom state
  const hoverEnabledRef = useRef(true); // Flag to enable/disable hover
  const edges: Edges[] = data.edges.map((d) => ({ ...d }));
  const nodes: Nodes[] = data.nodes.map((d) => ({ ...d }));

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

    const handleDoubleClick = (event: MouseEvent) => {
      if (!canvas || !context) {
        return;
      }
      const x = event.clientX - canvas.getBoundingClientRect().left;
      const y = event.clientY - canvas.getBoundingClientRect().top;
      const node = findNode(nodes, x, y, RADIUSNODE);

      if (node) {
        handleNodeDoubleClick(node.id, node.node_class);
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

    if (
      !simulationRef.current ||
      simulationRef.current.nodes() !== nodes ||
      simulationRef.current
        .force<d3.ForceLink<Nodes, Edges>>('link')
        ?.links() !== validEdges
    ) {
      simulationRef.current = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink<Nodes, Edges>(validEdges)
            .id((uuid) => uuid.uuid)
            .distance(80)
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

    const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      transformRef.current = event.transform;
      isZoomingRef.current = true;
      hoverEnabledRef.current = false;
      isDraggingRef.current = false;
      context?.clearRect(0, 0, width, height);
      context?.save();
      context?.translate(transformRef.current.x, transformRef.current.y);
      context?.scale(transformRef.current.k, transformRef.current.k);
      drawNetwork(
        context,
        width,
        height,
        nodes,
        validEdges,
        null,
        transformRef.current
      );
      context?.restore();
    };

    if (canvas && context) {
      let click = 0;
      canvas.addEventListener('mousemove', checkMouseoverNode);
      canvas.addEventListener('mousemove', checkMouseoverEdges);
      canvas.addEventListener('click', (event) => {
        click++;
        if (click == 1) {
          setTimeout(function () {
            if (click == 1) {
              handleClickNodeCard(event);
            } else {
              handleDoubleClick(event);
            }
            click = 0;
          }, 300);
        }
      });

      const dragBehavior = d3.drag<HTMLCanvasElement, unknown>();

      dragBehavior
        .container(() => canvas)
        .subject(dragSubject)
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded);
      d3.select(canvas).call(dragBehavior);
      // .call(
      //   d3
      //     .zoom<HTMLCanvasElement, unknown>()
      //     .scaleExtent([1 / 10, 8])
      //     .on('zoom', zoomed)
      // );

      return () => {
        canvas.removeEventListener('mousemove', checkMouseoverNode);
        canvas.removeEventListener('dblclick', handleDoubleClick);
        canvas.removeEventListener('click', handleClickNodeCard);
        canvas.removeEventListener('mousemove', checkMouseoverEdges);
        dragBehavior.on('start', null).on('drag', null).on('end', null);
      };
    }
  }, [width, height, edges, nodes]);

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

      const newNode = node || null;

      if (newNode) {
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

      const edgesHover = findHoveredEdge(validEdges, nodes, x, y);
      const newEdge = edgesHover || null;
      if (newEdge) {
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
