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
import { drawNetwork } from './drawNetwork';
import { svg } from 'leaflet';
import { createStrokeColor, createdLableNodeHover } from '@/utils/functions/createdLableNode';
import { checkTypeOfLinke } from './checkTypeOfLinke';
import { CrisisAlert } from '@mui/icons-material';

type NetworkDiagramProps = {
    width: number;
    height: number;
    netWorkData: Datas;
    newUpdateNetWorkData: Datas;
    handleNodeDoubleClick: (nodeId: number, nodeClass: string) => {} // Promise<void>;
    handleClickNodeShowCard: (nodeId: number, nodeClass: string) => Promise<void>;
    // changedNetWorkData: Datas
};

export const NetworkDiagramSVG = ({
    width,
    height,
    netWorkData,
    newUpdateNetWorkData,
    handleNodeDoubleClick,
    handleClickNodeShowCard,
}: // changedNetWorkData
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

    const edges: Edges[] = netWorkData.edges.map((d) => ({ ...d }));
    const nodes: Nodes[] = netWorkData.nodes.map((d) => ({ ...d }));

    const nodeIds = new Set(nodes.map((node) => node.uuid));
    const validEdges = edges.filter(
        (edge) =>
            nodeIds.has(edge.source as string) && nodeIds.has(edge.target as string)
    );


    const handleClickNodeCard = (node: Nodes) => {
        handleClickNodeShowCard(node.id, node.node_class);
    };

    const handleDoubleClick = (node: Nodes) => {

        const newData = handleNodeDoubleClick(node.id, node.node_class);
        console.log({ newData })
    };


    useEffect(() => {
        const svg = select(svgRef.current);
        const svgElement = svg.node() as SVGSVGElement;

        const clearClickTimeout = () => {
            if (clickTimeout.current !== undefined) {
                clearTimeout(clickTimeout.current);
                clickTimeout.current = undefined;
            }
        };

        const enterNode = (selection: any) => {
            const circles = selection
                .selectAll('.node')
                .data(nodes)
                .enter()
                .append('circle')
                .attr('class', 'node')
                .attr('stroke', '#fff')
                .attr('stroke-width', '1.5')
                .attr('r', RADIUSNODE)
                .style('fill', (node: Nodes) => {
                    return classToColor[node.node_class as keyof typeof classToColor] || 'gray';
                })
                .on('click', (event: MouseEvent, d: Nodes) => {
                    handleDoubleClick(d);
                });
            return circles;
        };
        function updateNode(selection: any) {
            const circles = selection // translate(" + String(node.x) + "," + String(node.y) + ")")
                .attr("transform", (node: Nodes) => `translate(${String(node.x)},${String(node.y)})`)
                .attr("cx", function (node: Nodes) { return node.x = Math.max(30, Math.min(width - 30, node.x!)); })
                .attr("cy", function (node: Nodes) { return node.y = Math.max(30, Math.min(height - 30, node.y!)); })
            return circles;
        }

        function updateLink(selection: any) {
            const links = selection
                .attr("x1", (link: Edges) => {
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
                .attr("y1", (link: Edges) => {
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
                .attr("x2", (link: Edges) => {
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
                .attr("y2", (link: Edges) => {
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
            return links
        }

        const updateGraph = (selection: any) => {
            selection.selectAll('.node')
                .call(updateNode)
            selection.selectAll('.link')
                .call(updateLink);
        }
        if (!svg) {
            return;
        }
        if (svgRef.current) {
            select(svgRef.current).datum(netWorkData).call(enterNode);
        }


        // const simulation = d3.forceSimulation(nodes)
        //     .force("link", forceLink<Nodes, Edges>(validEdges)
        //         .id((uuid) => uuid.uuid))
        //     .force("charge", d3.forceManyBody())
        //     .force("x", d3.forceX())
        //     .force("y", d3.forceY());

        // // Create the SVG container.
        // const svgGraph = d3.create("svg")
        //     .attr("width", width)
        //     .attr("height", height)
        // // .attr("viewBox", [-width / 2, -height / 2, width, height])
        // // .attr("style", "max-width: 100%; height: auto;");

        // // Add a line for each link, and a circle for each node.
        // const link = svgGraph.append("g")
        //     .attr("stroke", "#999")
        //     .attr("stroke-opacity", 0.6)
        //     .selectAll("line")
        //     .data(validEdges)
        //     .join("line")
        //     .attr("stroke-width", '1.5');

        // const node = svg.append("g")
        //     .attr("stroke", "#fff")
        //     .attr("stroke-width", 1.5)
        //     .selectAll("circle")
        //     .data(nodes)
        //     .join("circle")
        //     .attr("r", 5)
        //     .attr('fill', (node: Nodes) => {
        //         return classToColor[node.node_class as keyof typeof classToColor] || 'gray';
        //     })

        // node.append("title")
        //     .text((node: Nodes) => {
        //         const labelNode = createdLableNodeHover(node);
        //         return labelNode || "";
        //     })

        // Set the position attributes of links and nodes each time the simulation ticks.
        // simulation.on("tick", () => {
        //     link.attr("x1", (link) => {
        //         if (link.source &&
        //             link.target &&
        //             typeof link.source !== 'string' &&
        //             typeof link.target !== 'string' &&
        //             typeof link.source.x === 'number' &&
        //             typeof link.source.y === 'number' &&
        //             typeof link.target.x === 'number' &&
        //             typeof link.target.y === 'number') {
        //             return String(link.source.x);
        //         }
        //         return "0";
        //     }).attr("y1", (link) => {
        //         if (link.source &&
        //             link.target &&
        //             typeof link.source !== 'string' &&
        //             typeof link.target !== 'string' &&
        //             typeof link.source.x === 'number' &&
        //             typeof link.source.y === 'number' &&
        //             typeof link.target.x === 'number' &&
        //             typeof link.target.y === 'number') {
        //             return String(link.source.y);
        //         }
        //         return "0";
        //     }).attr("x2", (link) => {
        //         if (link.source &&
        //             link.target &&
        //             typeof link.source !== 'string' &&
        //             typeof link.target !== 'string' &&
        //             typeof link.source.x === 'number' &&
        //             typeof link.source.y === 'number' &&
        //             typeof link.target.x === 'number' &&
        //             typeof link.target.y === 'number') {
        //             return String(link.target.x);
        //         }
        //         return "0";
        //     }).attr("y2", (link) => {
        //         if (link.source &&
        //             link.target &&
        //             typeof link.source !== 'string' &&
        //             typeof link.target !== 'string' &&
        //             typeof link.source.x === 'number' &&
        //             typeof link.source.y === 'number' &&
        //             typeof link.target.x === 'number' &&
        //             typeof link.target.y === 'number') {
        //             return String(link.target.y);
        //         }
        //         return "0";
        //     });

        //     node.attr("r", RADIUSNODE)
        //         .attr("cx", node => String(node.x))
        //         .attr("cy", node => String(node.y));

        // });
        //   initData
        //   updateData

        simulationRef.current = forceSimulation(nodes)
            .force('charge', forceManyBody())
            .force(
                'link',
                forceLink<Nodes, Edges>(edges)
                    .id((uuid) => uuid.uuid)
                    .distance(120)//.strength(1)
            )
            //forceLink.force("collide", forceCollide(30))
            .force('center', forceCenter().x(width / 2).y(height / 2))
            .on('tick', () => {
                // drawNetworkSVG(svgElement, nodes, edges, null);
                // nodes
                svg
                    .selectAll(".node")
                    .data(nodes)
                    // .join("circle")
                    .join(function (enter) {
                        return enter.append('circle')
                    },
                        function (update) {
                            return update.style('opacity', 1)
                        }
                    )
                    .attr("class", "node")
                    .attr("r", RADIUSNODE)
                    .attr("cx", node => String(node.x))
                    .attr("cy", node => String(node.y));

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

        // ==== Drang node graph ====
        function dragSubject(
            event: d3.D3DragEvent<SVGSVGElement, any, any>
        ): Nodes | undefined {
            const [x, y] = pointer(event);
            const node = findNode(nodes, x, y, RADIUSNODE);
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
    }, [dispatch, width, height, edges, nodes, netWorkData]);

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
