import * as d3 from 'd3';
import { forceLink, drag, select, zoomIdentity, ForceLink, pointer } from 'd3';
import { useEffect, useRef, useState } from 'react';
import { Datas, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import { ENSLAVEMENTNODE, RADIUSNODE, classToColor } from '@/share/CONST_DATA';
import { findHoveredEdge } from './findHoveredEdge';
import ShowsAcoloredNodeKey from './ShowsAcoloredNodeKey';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    createStrokeColor,
    createdLableNodeHover,
} from '@/utils/functions/createdLableNode';
import {
    setNetWorksID,
    setNetWorksKEY,
    setPastNetworksData,
} from '@/redux/getPastNetworksGraphDataSlice';
import { fetchPastNetworksGraphApi } from '@/fetch/pastEnslavedFetch/fetchPastNetworksGraph';
import { setIsModalCard, setNodeClass } from '@/redux/getCardFlatObjectSlice';
import { findNode } from './findNode';

type NetworkDiagramProps = {
    width: number;
    height: number;
};

export const NetworkDiagramSVGEnterNode = ({
    width,
    height,
}: NetworkDiagramProps) => {
    const { data: netWorkData } = useSelector(
        (state: RootState) => state.getPastNetworksGraphData
    );
    const dispatch: AppDispatch = useDispatch();
    const divRef = useRef<HTMLDivElement | null>(null);
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

    const clearClickTimeout = () => {
        if (clickTimeout.current !== undefined) {
            clearTimeout(clickTimeout.current);
            clickTimeout.current = undefined;
        }
    };

    const handleClickNodeShowCard = async (nodeId: number, nodeClass: string) => {
        if (nodeClass !== ENSLAVEMENTNODE) {
            dispatch(setIsModalCard(true));
            dispatch(setNodeClass(nodeClass));
            dispatch(setNetWorksID(nodeId));
            dispatch(setNetWorksKEY(nodeClass));
        }
    };

    const handleDoubleClick = async (nodeId: number, nodeClass: string) => {
        try {
            const dataSend = {
                [nodeClass]: [Number(nodeId)],
            };
            const response = await dispatch(
                fetchPastNetworksGraphApi(dataSend)
            ).unwrap();
            if (response) {
                const newNodes = response.nodes.filter((newNode: Nodes) => {
                    return !netWorkData.nodes.some(
                        (existingNode) => existingNode.uuid === newNode.uuid
                    );
                });

                const newEdges = response.edges.filter((newEdge: Edges) => {
                    return !netWorkData.edges.some(
                        (existingEdge) =>
                            existingEdge.source === newEdge.source &&
                            existingEdge.target === newEdge.target
                    );
                });

                const updatedNodes = [...netWorkData.nodes, ...newNodes];
                const updatedEdges = [...netWorkData.edges, ...newEdges];

                const updatedData = {
                    ...netWorkData,
                    nodes: updatedNodes,
                    edges: updatedEdges,
                };

                dispatch(setPastNetworksData(updatedData));
            }
        } catch (error) {
            console.error('Error fetching new nodes:', error);
        }
    };

    function updateNetwork() {
        if (!svgRef.current) {
            return;
        }
        const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);

        // Update existing edges' positions
        const edgeSelection = svg
            .selectAll<SVGLineElement, Edges>('.link')
            .data(validEdges, (d: Edges) => `${d.source}-${d.target}`);
        edgeSelection.exit().remove();
        edgeSelection
            .attr('x1', (link) => {
                if (
                    link.source &&
                    link.target &&
                    typeof link.source !== 'string' &&
                    typeof link.target !== 'string' &&
                    typeof link.source.x === 'number' &&
                    typeof link.source.y === 'number' &&
                    typeof link.target.x === 'number' &&
                    typeof link.target.y === 'number'
                ) {
                    return String(link.source.x);
                }
                return '0';
            })
            .attr('y1', (link) => {
                if (
                    link.source &&
                    link.target &&
                    typeof link.source !== 'string' &&
                    typeof link.target !== 'string' &&
                    typeof link.source.x === 'number' &&
                    typeof link.source.y === 'number' &&
                    typeof link.target.x === 'number' &&
                    typeof link.target.y === 'number'
                ) {
                    return String(link.source.y);
                }
                return '0';
            })
            .attr('x2', (link) => {
                if (
                    link.source &&
                    link.target &&
                    typeof link.source !== 'string' &&
                    typeof link.target !== 'string' &&
                    typeof link.source.x === 'number' &&
                    typeof link.source.y === 'number' &&
                    typeof link.target.x === 'number' &&
                    typeof link.target.y === 'number'
                ) {
                    return String(link.target.x);
                }
                return '0';
            })
            .attr('y2', (link) => {
                if (
                    link.source &&
                    link.target &&
                    typeof link.source !== 'string' &&
                    typeof link.target !== 'string' &&
                    typeof link.source.x === 'number' &&
                    typeof link.source.y === 'number' &&
                    typeof link.target.x === 'number' &&
                    typeof link.target.y === 'number'
                ) {
                    return String(link.target.y);
                }
                return '0';
            })
            .join(
                (enter) =>
                    enter
                        .append('line')
                        .attr('class', 'link')
                        .attr('stroke-width', '1.5')
                        .attr('stroke', (link) => {
                            const strokeColor = createStrokeColor(link);
                            return strokeColor;
                        })
                        .attr('x1', (link) => {
                            if (
                                link.source &&
                                link.target &&
                                typeof link.source !== 'string' &&
                                typeof link.target !== 'string' &&
                                typeof link.source.x === 'number' &&
                                typeof link.source.y === 'number' &&
                                typeof link.target.x === 'number' &&
                                typeof link.target.y === 'number'
                            ) {
                                return String(link.source.x);
                            }
                            return '0';
                        })
                        .attr('y1', (link) => {
                            if (
                                link.source &&
                                link.target &&
                                typeof link.source !== 'string' &&
                                typeof link.target !== 'string' &&
                                typeof link.source.x === 'number' &&
                                typeof link.source.y === 'number' &&
                                typeof link.target.x === 'number' &&
                                typeof link.target.y === 'number'
                            ) {
                                return String(link.source.y);
                            }
                            return '0';
                        })
                        .attr('x2', (link) => {
                            if (
                                link.source &&
                                link.target &&
                                typeof link.source !== 'string' &&
                                typeof link.target !== 'string' &&
                                typeof link.source.x === 'number' &&
                                typeof link.source.y === 'number' &&
                                typeof link.target.x === 'number' &&
                                typeof link.target.y === 'number'
                            ) {
                                return String(link.target.x);
                            }
                            return '0';
                        })
                        .attr('y2', (link) => {
                            if (
                                link.source &&
                                link.target &&
                                typeof link.source !== 'string' &&
                                typeof link.target !== 'string' &&
                                typeof link.source.x === 'number' &&
                                typeof link.source.y === 'number' &&
                                typeof link.target.x === 'number' &&
                                typeof link.target.y === 'number'
                            ) {
                                return String(link.target.y);
                            }
                            return '0';
                        }),
                (update) => update,
                (exit) => exit.remove()
            );
        const nodeSelection = svg
            .selectAll<SVGCircleElement, Nodes>('.node')
            .data(nodes, (d: Nodes) => d.uuid);
        nodeSelection.exit().remove();

        nodeSelection
            .attr('cx', (node) => Number(String(node.x)))
            .attr('cy', (node) => Number(String(node.y)))
            .join(
                (enter) =>
                    enter
                        .append('circle')
                        .attr('class', 'node')
                        .attr('r', RADIUSNODE)
                        .attr('stroke', '#fff')
                        .attr('stroke-width', '1.5')
                        .attr('cx', (node) => Number(String(node.x)))
                        .attr('cy', (node) => Number(String(node.y)))
                        .attr('fill', (node: Nodes) => {
                            return (
                                classToColor[node.node_class as keyof typeof classToColor] ||
                                'gray'
                            );
                        })
                        .on('click', (event: MouseEvent, d: Nodes) => {
                            event.preventDefault()
                            clearClickTimeout();
                            handleDoubleClick(d.id, d.node_class);
                            // handleClickNodeShowCard(d.id, d.node_class);
                            // will un comment later
                            // if (event.detail === 1) {
                            //     clickTimeout.current = setTimeout(() => {
                            //         handleClickNodeShowCard(d.id, d.node_class);
                            //     }, timeout);
                            // }
                            // if (event.detail === 2) {
                            //     handleDoubleClick(d.id, d.node_class);
                            // }
                        }),
                // (update) => update,
                (update) => {
                    return update.style('opacity', 1)
                },
                (exit) => exit.remove()
            );
        const labelSelection = svg.selectAll('.label');
        labelSelection
            .data(nodes)
            .join('text')
            .attr('class', 'label')
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('font-family', 'Arial')
            .attr('font-size', 15)
            .attr('fill', '#fff')
            .text((node: Nodes) => {
                const labelNode = createdLableNodeHover(node);
                return labelNode || '';
            })
            .attr('x', (node: Nodes) => Number(node.x) + 15.5)
            .attr('y', (node: Nodes) => Number(node.y));


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

        const drag = () =>
            d3
                .selectAll<SVGGElement, Nodes | undefined>('g.node')
                .call(
                    d3
                        .drag<SVGGElement, Nodes | undefined>()
                        .on('start', dragStarted)
                        .on('drag', dragged)
                        .on('end', dragEnded)
                );
        drag()

    }


    useEffect(() => {
        const simulation = d3
            .forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(-30))
            .force(
                'link',
                forceLink<Nodes, Edges>(edges)
                    .id((uuid) => uuid.uuid)
                    .distance(100)
            )
            .force(
                'center',
                d3
                    .forceCenter()
                    .x(width / 2)
                    .y(height / 2)
            )
            .on('tick', () => {
                updateNetwork();
            });

        simulationRef.current = simulation;

    }, [edges, nodes]);

    // useEffect(() => {
    //     if (!simulationRef.current || !nodes || !edges) {
    //         return;
    //     }
    //     const linkForce: ForceLink<Nodes, Edges> = forceLink<Nodes, Edges>(edges)
    //         .id((d: Nodes) => d.id)
    //         .distance(100);

    //     // Update simulation with new data
    //     simulationRef.current.nodes(nodes);
    //     simulationRef.current?.force('link', linkForce);
    //     // Restart the simulation
    //     simulationRef.current.alpha(1).restart();
    // }, []);

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





// useEffect(() => {
//     const svg = select(svgRef.current);
//     if (!svg) {
//         return;
//     }

//     simulationRef.current = d3.forceSimulation(nodes)
//         .force('charge', d3.forceManyBody().strength(-30))
//         .force('link', forceLink<Nodes, Edges>(edges).id((uuid) => uuid.uuid).distance(100))
//         .force('center', d3.forceCenter().x(width / 2).y(height / 2))
//         .on('tick', () => {
//             // Nodes
//             svg
//                 .selectAll(".node")
//                 .data(nodes)
//                 .join('circle')
//                 .attr("class", "node")
//                 .attr("r", RADIUSNODE)
//                 .attr('stroke', '#fff')
//                 .attr('stroke-width', '1.5')
//                 .attr('fill', (node: Nodes) => {
//                     return classToColor[node.node_class as keyof typeof classToColor] || 'gray';
//                 })
//                 .attr("cx", node => Number(String(node.x)))
//                 .attr("cy", node => Number(String(node.y)))
//                 .on('click', (event: MouseEvent, d: Nodes) => {
//                     handleDoubleClick(d.id, d.node_class);
//                 })
//             // .transition()
//             // .duration(500)
//             // .delay(500)
//             // .ease(d3.easeCubic)

//             // .join(
//             //     enter => (
//             //         enter.append("circle")
//             //             .attr("class", "node")
//             //             .attr("r", RADIUSNODE)
//             //             .attr('stroke', '#fff')
//             //             .attr('stroke-width', '1.5')
//             //             .attr('fill', (node: Nodes) => {
//             //                 return classToColor[node.node_class as keyof typeof classToColor] || 'gray';
//             //             })
//             //             .attr("cx", node => String(node.x))
//             //             .attr("cy", node => String(node.y))
//             //             .on('click', (event: MouseEvent, d: Nodes) => {
//             //                 handleDoubleClick(d.id, d.node_class);
//             //                 // handleDoubleClick(d);
//             //             })

//             //     )
//             // ).exit()

//             // Labels
//             svg
//                 .selectAll(".label")
//                 .data(nodes)
//                 .join('text')
// .attr("class", "label")
// .attr("text-anchor", "right")
// .attr("alignment-baseline", "right")
// .attr('font-family', 'Arial')
// .attr("font-size", 15)
// .attr('fill', '#fff')
// .text((node: Nodes) => {
//     const labelNode = createdLableNodeHover(node);
//     return labelNode || "";
// })
// .attr("x", (node: Nodes) => String(node.x! + 13))
//  .attr("y", (node: Nodes) => String(node.y! + 6))

//             // .join(
//             //     enter => (
//             //         enter.append("text")
//             //             .attr("class", "label")
//             //             .attr("text-anchor", "right")
//             //             .attr("alignment-baseline", "right")
//             //             .attr('font-family', 'Arial')
//             //             .attr("font-size", 15)
//             //             .attr('fill', '#fff')
//             //             .text((node: Nodes) => {
//             //                 const labelNode = createdLableNodeHover(node);
//             //                 return labelNode || "";
//             //             })
//             //             .attr("x", (node: Nodes) => String(node.x! + 13))
//             //             .attr("y", (node: Nodes) => String(node.y! + 6))

//             //     )
//             // ).exit()

//             // Links
//             svg
//                 .selectAll(".link")
//                 .data(validEdges)
//                 .join('line')
//                 .attr("class", "link")
//                 .attr("stroke", (link) => {
//                     const strokeColor = createStrokeColor(link);
//                     return strokeColor
//                 })
//                 .attr('stroke-width', '1.5')
//                 .attr("fill", "none")
//                 .attr("x1", (link) => {
//                     if (link.source &&
//                         link.target &&
//                         typeof link.source !== 'string' &&
//                         typeof link.target !== 'string' &&
//                         typeof link.source.x === 'number' &&
//                         typeof link.source.y === 'number' &&
//                         typeof link.target.x === 'number' &&
//                         typeof link.target.y === 'number') {
//                         return String(link.source.x);
//                     }
//                     return "0";
//                 })
//                 .attr("y1", (link) => {
//                     if (link.source &&
//                         link.target &&
//                         typeof link.source !== 'string' &&
//                         typeof link.target !== 'string' &&
//                         typeof link.source.x === 'number' &&
//                         typeof link.source.y === 'number' &&
//                         typeof link.target.x === 'number' &&
//                         typeof link.target.y === 'number') {
//                         return String(link.source.y);
//                     }
//                     return "0";
//                 })
//                 .attr("x2", (link) => {
//                     if (link.source &&
//                         link.target &&
//                         typeof link.source !== 'string' &&
//                         typeof link.target !== 'string' &&
//                         typeof link.source.x === 'number' &&
//                         typeof link.source.y === 'number' &&
//                         typeof link.target.x === 'number' &&
//                         typeof link.target.y === 'number') {
//                         return String(link.target.x);
//                     }
//                     return "0";
//                 })
//                 .attr("y2", (link) => {
//                     if (link.source &&
//                         link.target &&
//                         typeof link.source !== 'string' &&
//                         typeof link.target !== 'string' &&
//                         typeof link.source.x === 'number' &&
//                         typeof link.source.y === 'number' &&
//                         typeof link.target.x === 'number' &&
//                         typeof link.target.y === 'number') {
//                         return String(link.target.y);
//                     }
//                     return "0";
//                 })
//             // .join(
//             //     enter => (
//             //         enter.append("line")
//             //             .attr("class", "link")
//             //             .attr("stroke", (link) => {
//             //                 const strokeColor = createStrokeColor(link);
//             //                 return strokeColor
//             //             })
//             //             .attr('stroke-width', '1.5')
//             //             .attr("fill", "none")
//             //             .attr("x1", (link) => {
//             //                 if (link.source &&
//             //                     link.target &&
//             //                     typeof link.source !== 'string' &&
//             //                     typeof link.target !== 'string' &&
//             //                     typeof link.source.x === 'number' &&
//             //                     typeof link.source.y === 'number' &&
//             //                     typeof link.target.x === 'number' &&
//             //                     typeof link.target.y === 'number') {
//             //                     return String(link.source.x);
//             //                 }
//             //                 return "0";
//             //             })
//             //             .attr("y1", (link) => {
//             //                 if (link.source &&
//             //                     link.target &&
//             //                     typeof link.source !== 'string' &&
//             //                     typeof link.target !== 'string' &&
//             //                     typeof link.source.x === 'number' &&
//             //                     typeof link.source.y === 'number' &&
//             //                     typeof link.target.x === 'number' &&
//             //                     typeof link.target.y === 'number') {
//             //                     return String(link.source.y);
//             //                 }
//             //                 return "0";
//             //             })
//             //             .attr("x2", (link) => {
//             //                 if (link.source &&
//             //                     link.target &&
//             //                     typeof link.source !== 'string' &&
//             //                     typeof link.target !== 'string' &&
//             //                     typeof link.source.x === 'number' &&
//             //                     typeof link.source.y === 'number' &&
//             //                     typeof link.target.x === 'number' &&
//             //                     typeof link.target.y === 'number') {
//             //                     return String(link.target.x);
//             //                 }
//             //                 return "0";
//             //             })
//             //             .attr("y2", (link) => {
//             //                 if (link.source &&
//             //                     link.target &&
//             //                     typeof link.source !== 'string' &&
//             //                     typeof link.target !== 'string' &&
//             //                     typeof link.source.x === 'number' &&
//             //                     typeof link.source.y === 'number' &&
//             //                     typeof link.target.x === 'number' &&
//             //                     typeof link.target.y === 'number') {
//             //                     return String(link.target.y);
//             //                 }
//             //                 return "0";
//             //             })
//             //     ),

//             //     //     // exit => (
//             //     //     //     exit.attr("fill", "tomato")
//             //     //     //         .call(exit => (
//             //     //     //             exit.transition().duration(1200)
//             //     //     //                 .attr("r", 0)
//             //     //     //                 .style("opacity", 0)
//             //     //     //                 .remove()
//             //     //     //         ))
//             //     //     // ),
//             // ).exit()
//         });

//     // ==== Old Code =======
//     /*
//         simulationRef.current = forceSimulation(nodes)
//             .force('charge', forceManyBody())
//             .force(
//                 'link',
//                 forceLink<Nodes, Edges>(edges)
//                     .id((uuid) => uuid.uuid)
//                     .distance(120)//.strength(1)
//             )
//             .force('center', forceCenter().x(width / 2).y(height / 2))
//             .on('tick', () => {
//                 svg
//                     .selectAll(".node")
//                     .data(nodes)
//                     .join("circle")
//                     // .attr("class", "node")
//                     // .attr("r", RADIUSNODE)
//                     // .attr('stroke', '#fff')
//                     // .attr('stroke-width', '1.5')
//                     // .style('fill', (node: Nodes) => {
//                     //     return classToColor[node.node_class as keyof typeof classToColor] || 'gray';
//                     // })
//                     // .attr("cx", node => String(node.x))
//                     // .attr("cy", node => String(node.y))
//                     // .on('click', (event: MouseEvent, d: Nodes) => {
//                     //     handleDoubleClick(d);
//                     // });

//                 // labels
//                 svg
//                     .selectAll(".label")
//                     .data(nodes)
//                     .join("text")
//                     .attr("class", "label")
//                     .attr("text-anchor", "right")
//                     .attr("alignment-baseline", "right")
//                     .attr('font-family', 'Arial')
//                     .attr("font-size", 15)
//                     .attr('fill', '#fff')
//                     .text((node: Nodes) => {
//                         const labelNode = createdLableNodeHover(node);
//                         return labelNode || "";
//                     })
//                     .attr("x", (node: Nodes) => String(node.x! + 13))
//                     .attr("y", (node: Nodes) => String(node.y! + 6))
//                 // links
//                 svg
//                     .selectAll(".link")
//                     .data(validEdges)
//                     .join("line")
//                     .attr("class", "link")
//                     .attr("stroke", (link) => {
//                         const strokeColor = createStrokeColor(link);
//                         return strokeColor
//                     })
//                     .attr('stroke-width', '1.5')
//                     .attr("fill", "none")
//                     .attr("x1", (link) => {
//                         if (link.source &&
//                             link.target &&
//                             typeof link.source !== 'string' &&
//                             typeof link.target !== 'string' &&
//                             typeof link.source.x === 'number' &&
//                             typeof link.source.y === 'number' &&
//                             typeof link.target.x === 'number' &&
//                             typeof link.target.y === 'number') {
//                             return String(link.source.x);
//                         }
//                         return "0";
//                     })
//                     .attr("y1", (link) => {
//                         if (link.source &&
//                             link.target &&
//                             typeof link.source !== 'string' &&
//                             typeof link.target !== 'string' &&
//                             typeof link.source.x === 'number' &&
//                             typeof link.source.y === 'number' &&
//                             typeof link.target.x === 'number' &&
//                             typeof link.target.y === 'number') {
//                             return String(link.source.y);
//                         }
//                         return "0";
//                     })
//                     .attr("x2", (link) => {
//                         if (link.source &&
//                             link.target &&
//                             typeof link.source !== 'string' &&
//                             typeof link.target !== 'string' &&
//                             typeof link.source.x === 'number' &&
//                             typeof link.source.y === 'number' &&
//                             typeof link.target.x === 'number' &&
//                             typeof link.target.y === 'number') {
//                             return String(link.target.x);
//                         }
//                         return "0";
//                     })
//                     .attr("y2", (link) => {
//                         if (link.source &&
//                             link.target &&
//                             typeof link.source !== 'string' &&
//                             typeof link.target !== 'string' &&
//                             typeof link.source.x === 'number' &&
//                             typeof link.source.y === 'number' &&
//                             typeof link.target.x === 'number' &&
//                             typeof link.target.y === 'number') {
//                             return String(link.target.y);
//                         }
//                         return "0";
//                     });
//             });
//         */

//     // ==== Drang node graph ====
//     function dragSubject(
//         event: d3.D3DragEvent<SVGSVGElement, any, any>
//     ): Nodes | undefined {
//         const [x, y] = pointer(event);
//         const node = findNode(nodes, x, y, RADIUSNODE);
//         if (node && typeof node.x === 'number' && typeof node.y === 'number') {
//             node.fx = node.x = transformRef.current.invertX(x);
//             node.fy = node.y = transformRef.current.invertY(y);
//         }
//         return node;
//     }

//     function dragStarted(
//         event: d3.D3DragEvent<SVGSVGElement, Nodes, unknown>
//     ): void {
//         isDraggingRef.current = true;
//         hoverEnabledRef.current = false;
//         if (!event.active) {
//             simulationRef.current?.alphaTarget(0.3).restart();
//         }
//         if (event.subject) {
//             const node = event.subject as Nodes;
//             node.fx = node.x;
//             node.fy = node.y;
//         }
//     }

//     function dragged(
//         event: d3.D3DragEvent<SVGSVGElement, Nodes, unknown>
//     ): void {

//         isDraggingRef.current = false;
//         hoverEnabledRef.current = true;
//         if (event.subject) {
//             const node = event.subject as Nodes;

//             node.fx = event.x;
//             node.fy = event.y;
//         }
//     }

//     function dragEnded(
//         event: d3.D3DragEvent<SVGSVGElement, Nodes, unknown>
//     ): void {
//         isDraggingRef.current = false;
//         hoverEnabledRef.current = true;
//         if (!event.active) {
//             simulationRef.current?.alphaTarget(0);
//         }
//         if (event.subject) {
//             const node = event.subject as Nodes;
//             node.fx = null;
//             node.fy = null;
//         }
//     }

//     const drag = () =>
//         d3
//             .selectAll<SVGGElement, Nodes | undefined>('g.node')
//             .call(
//                 d3
//                     .drag<SVGGElement, Nodes | undefined>()
//                     .on('start', dragStarted)
//                     .on('drag', dragged)
//                     .on('end', dragEnded)
//             );

//     drag();
//     return () => {
//         svg.on('mousemove', null);
//         svg.on('click', null);
//         // dragBehavior.on('start', null).on('drag', null).on('end', null);
//         d3.selectAll<SVGGElement, Nodes | undefined>('g.node').on('.drag', null);
//     };
// }, [width, height, edges, nodes, netWorkData, newNetWorkData]);
