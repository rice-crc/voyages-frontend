import * as d3 from 'd3';
import {
    select,
    hierarchy,
    forceSimulation,
    forceManyBody,
    pointer, forceLink,
    forceX, forceCenter,
    forceY,
    forceCollide, drag,
    forceRadial, zoomIdentity
} from "d3";
import { useEffect, useRef } from 'react';
import { Datas, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import { findNode, findNodeSvg } from './findNode';
import { RADIUSNODE, classToColor } from '@/share/CONST_DATA';
import { findHoveredEdge } from './findHoveredEdge';
import ShowsAcoloredNodeKey from './ShowsAcoloredNodeKey';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { drawNetworkSVG } from './drawNetworkSVG';
import { createStrokeColor, createdLableNodeHover } from '@/utils/functions/createdLableNode';
import { networkInterfaces } from 'os';


type NetworkDiagramProps = {
    width: number;
    height: number;
    netWorkData: Datas;
    newUpdateNetWorkData: Datas;
    handleNodeDoubleClick: (nodeId: number, nodeClass: string) => Promise<void>;
    handleClickNodeShowCard: (nodeId: number, nodeClass: string) => Promise<void>;
};

export const NetworkDiagramSVG = ({
    width,
    height,
    netWorkData,
    newUpdateNetWorkData,
    handleNodeDoubleClick,
    handleClickNodeShowCard,
}:
    NetworkDiagramProps) => {
    const dispatch: AppDispatch = useDispatch();
    const svgRef = useRef<SVGSVGElement | null>(null);
    const transformRef = useRef<d3.ZoomTransform>(zoomIdentity);
    const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
    const isDraggingRef = useRef(false);
    const isZoomingRef = useRef(false);
    const hoverEnabledRef = useRef(true);
    const clickTimeout = useRef<NodeJS.Timeout | undefined>();
    let timeout = 300;

    // const edges: Edges[] = netWorkData.edges.map((d) => ({ ...d }));
    // const nodes: Nodes[] = netWorkData.nodes.map((d) => ({ ...d }));

    // const nodeIds = new Set(nodes.map((node) => node.uuid));
    // const validEdges = edges.filter(
    //     (edge) =>
    //         nodeIds.has(edge.source as string) && nodeIds.has(edge.target as string)
    // );


    const handleClickNodeCard = (node: Nodes) => {
        handleClickNodeShowCard(node.id, node.node_class);
    };

    const handleDoubleClick = (node: Nodes) => {

        const newData = handleNodeDoubleClick(node.id, node.node_class);
        console.log({ newData })
    };

    const initData = (data: Datas, svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>) => {
        updateData(data, svg)
    }
    const updateData = (data: Datas, svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>) => {
        const edges: Edges[] = data.edges.map((d) => ({ ...d }));
        const nodes: Nodes[] = data.nodes.map((d) => ({ ...d }));

        const nodeIds = new Set(nodes.map((node) => node.uuid));
        const validEdges = edges.filter(
            (edge) =>
                nodeIds.has(edge.source as string) && nodeIds.has(edge.target as string)
        );

        simulationRef.current = forceSimulation(nodes)
            .force('charge', forceManyBody())
            .force(
                'link',
                forceLink<Nodes, Edges>(edges)
                    .id((uuid) => uuid.uuid)
                    .distance(120).strength(1)
            )
            //forceLink.force("collide", forceCollide(30))
            .force('center', forceCenter().x(width / 2).y(height / 2))
            .on('tick', () => {
                svg
                    .selectAll(".node")
                    .data(nodes)
                    .join(function (enter) {
                        return enter.append('circle')
                    },
                        function (update) {
                            return update.style('opacity', 1)
                        }
                    )
                    .attr("class", "node")
                    .attr('stroke', '#fff')
                    .attr('stroke-width', '1.5')
                    .attr("r", RADIUSNODE)
                    .style('fill', (node: Nodes) => {
                        return classToColor[node.node_class as keyof typeof classToColor] || 'gray';
                    })
                    .attr("cx", node => String(node.x))
                    .attr("cy", node => String(node.y))
                    .on('click', (event: MouseEvent, d: Nodes) => {
                        // console.log({ d })
                        handleDoubleClick(d);
                    });

                // labels
                svg
                    .selectAll(".label")
                    .data(nodes)
                    .join("text")
                    .attr("class", "label")
                    .attr("text-anchor", "right")
                    .attr("alignment-baseline", "right")
                    .attr('font-family', 'Arial')
                    .attr("font-size", 15)
                    .attr('fill', '#fff')
                    .text((node: Nodes) => {
                        const labelNode = createdLableNodeHover(node);
                        return labelNode || "";
                    })
                    .attr("x", (node: Nodes) => String(node.x! + 13))
                    .attr("y", (node: Nodes) => String(node.y! + 6));

                // links
                svg
                    .selectAll(".link")
                    .data(validEdges)
                    .join("line")
                    .attr("class", "link")
                    .attr("stroke", (link) => {
                        const strokeColor = createStrokeColor(link);
                        return strokeColor
                    })
                    .attr('stroke-width', '1.5')
                    .attr("fill", "none")
                    .attr("x1", (link) => {
                        if (link.source &&
                            link.target &&
                            typeof link.source !== 'string' &&
                            typeof link.target !== 'string' &&
                            typeof link.source.x === 'number' &&
                            typeof link.source.y === 'number' &&
                            typeof link.target.x === 'number' &&
                            typeof link.target.y === 'number') {
                            return String(link.source.x);
                        }
                        return "0";
                    })
                    .attr("y1", (link) => {
                        if (link.source &&
                            link.target &&
                            typeof link.source !== 'string' &&
                            typeof link.target !== 'string' &&
                            typeof link.source.x === 'number' &&
                            typeof link.source.y === 'number' &&
                            typeof link.target.x === 'number' &&
                            typeof link.target.y === 'number') {
                            return String(link.source.y);
                        }
                        return "0";
                    })
                    .attr("x2", (link) => {
                        if (link.source &&
                            link.target &&
                            typeof link.source !== 'string' &&
                            typeof link.target !== 'string' &&
                            typeof link.source.x === 'number' &&
                            typeof link.source.y === 'number' &&
                            typeof link.target.x === 'number' &&
                            typeof link.target.y === 'number') {
                            return String(link.target.x);
                        }
                        return "0";
                    })
                    .attr("y2", (link) => {
                        if (link.source &&
                            link.target &&
                            typeof link.source !== 'string' &&
                            typeof link.target !== 'string' &&
                            typeof link.source.x === 'number' &&
                            typeof link.source.y === 'number' &&
                            typeof link.target.x === 'number' &&
                            typeof link.target.y === 'number') {
                            return String(link.target.y);
                        }
                        return "0";
                    });
            });

    }

    useEffect(() => {
        const svg = select(svgRef.current);
        const svgElement = svg.node() as SVGSVGElement;

        const clearClickTimeout = () => {
            if (clickTimeout.current !== undefined) {
                clearTimeout(clickTimeout.current);
                clickTimeout.current = undefined;
            }
        };
        if (!svg) {
            return;
        }
        if (svgRef.current) {
            initData(netWorkData, svg)
        }


        // ==== Drang node graph ====
        function dragSubject(
            event: d3.D3DragEvent<SVGSVGElement, any, any>
        ): Nodes | undefined {
            const [x, y] = pointer(event);
            const node = findNode(netWorkData.nodes, x, y, RADIUSNODE);
            if (node && typeof node.x === 'number' && typeof node.y === 'number') {
                node.fx = node.x = transformRef.current.invertX(x);
                node.fy = node.y = transformRef.current.invertY(y);
            }
            return node;
        }

        function dragStarted(
            event: d3.D3DragEvent<SVGSVGElement, Nodes, unknown>
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

        const dragBehavior = drag<SVGSVGElement, Nodes | undefined, unknown>();
        dragBehavior
            .subject(dragSubject)
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded);

        if (svgRef.current) {
            svg.call(dragBehavior as any);
        }
        return () => {
            svg.on('mousemove', null);
            svg.on('click', null);
            dragBehavior.on('start', null).on('drag', null).on('end', null);
        };
    }, [dispatch, width, height, netWorkData]);

    return (
        <>
            <svg
                ref={svgRef}
                width={width}
                height={height}
                id="networkCanvas labelsContainer"
            ></svg>
            <ShowsAcoloredNodeKey />
        </>
    );
};
