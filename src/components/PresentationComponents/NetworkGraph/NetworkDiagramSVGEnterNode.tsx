import * as d3 from 'd3';
import { forceLink, drag, select, zoomIdentity, } from 'd3';
import { useCallback, useEffect, useRef, useState } from 'react';
import { netWorkDataProps, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import { ENSLAVEMENTNODE, RADIUSNODE, classToColor } from '@/share/CONST_DATA';
import { findHoveredEdge } from './findHoveredEdge';
import { setPastNetworksData, } from '@/redux/getPastNetworksGraphDataSlice';
import ShowsAcoloredNodeKey from './ShowsAcoloredNodeKey';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    createStrokeColor,
    createdLableEdges,
    createdLableNodeHover,
} from '@/utils/functions/createdLableNode';
import {
    setNetWorksID,
    setNetWorksKEY,
} from '@/redux/getPastNetworksGraphDataSlice';
import { fetchPastNetworksGraphApi } from '@/fetch/pastEnslavedFetch/fetchPastNetworksGraph';
import { setIsModalCard, setNodeClass } from '@/redux/getCardFlatObjectSlice';



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
    const hasSimulationBeenCreated = useRef(false)
    const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
    const isDraggingRef = useRef(false);
    const isZoomingRef = useRef(false);
    const hoverEnabledRef = useRef(true);
    const clickTimeout = useRef<NodeJS.Timeout | undefined>();
    let timeout = 300;

    const edges: Edges[] = netWorkData.edges.map((d) => {
        return { ...d }
    });
    const nodes: Nodes[] = netWorkData.nodes.map((d) => {
        return { ...d }
    });
    let graph: { nodes: Nodes[]; edges: Edges[] } = { nodes: nodes, edges: edges };

    function initNetworkgraph() {
        updateNetwork();
    }
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
    let linksGraph: d3.Selection<SVGLineElement, any, SVGGElement, unknown>;
    let nodesGraph: d3.Selection<SVGGElement, any, SVGGElement, unknown>;

    const handleDoubleClick = async (nodeId: number, nodeClass: string) => {
        const dataSend = {
            [nodeClass]: [Number(nodeId)],
        };
        const response = await dispatch(
            fetchPastNetworksGraphApi(dataSend)
        ).unwrap();
        if (response) {

            const newNodes: Nodes[] = response.nodes.filter((newNode: Nodes) => {
                return !graph.nodes.some(
                    (existingNode) => existingNode.uuid === newNode.uuid
                );
            });

            const newEdges: Edges[] = response.edges.filter((newEdge: Edges) => {
                return !graph.edges.some(
                    (existingEdge) =>
                        existingEdge.source === newEdge.source &&
                        existingEdge.target === newEdge.target
                );
            });
            const updatedNodes: Nodes[] = [...graph.nodes, ...newNodes];
            const updatedEdges: Edges[] = [...graph.edges, ...newEdges];


            const simulation = d3.forceSimulation(updatedNodes);
            simulation.force('link', forceLink<Nodes, Edges>(updatedEdges).id((uuid) => uuid.uuid).distance(110))
            simulation.force('charge', d3.forceManyBody())
            simulation.randomSource

            graph = { nodes: updatedNodes, edges: updatedEdges };
            updateNetwork()
        }
    };

    function updateNetwork() {
        if (!svgRef.current) return;
        if (svgRef.current) {
            const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);

            // Links
            linksGraph = svg.selectAll<SVGLineElement, unknown>('line').data(graph.edges);

            linksGraph.exit().remove();

            const newLinks = linksGraph.enter().append('line')


            newLinks.transition()
                .attr('class', 'link')
                .attr('stroke-width', '1.5')
                .style('cursor', 'pointer')
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
                })

            newLinks
                .append("text")
                .attr("text-anchor", "middle")
                .text((node: Nodes) => {
                    const labelNode = createdLableNodeHover(node);
                    console.log(labelNode)
                    return labelNode || 'Hello';
                })
                .attr('x', 300)
                .attr('y', 290)

            linksGraph = newLinks.merge(linksGraph);

            nodesGraph = svg.selectAll<SVGGElement, unknown>('g').data(graph.nodes)

            // remove excess nodes.
            nodesGraph.exit().remove()

            // enter new nodes as required:
            const newNodes = nodesGraph.enter().append('g').attr('opacity', 0)
            newNodes.on('click', async (event: MouseEvent, d: Nodes) => {
                event.preventDefault()
                clearClickTimeout();
                await handleDoubleClick(d.id, d.node_class);

                // will un comment later
                // if (event.detail === 1) {
                //     clickTimeout.current = setTimeout(() => {
                //         handleClickNodeShowCard(d.id, d.node_class);
                //     }, timeout);
                // }
                // if (event.detail === 2) {
                //     handleDoubleClick(d.id, d.node_class);
                // }
            })

            newNodes.transition()
                .attr('opacity', 1)
                .attr('class', 'nodes')
                .attr('stroke', '#fff')
                .style('cursor', 'pointer')
                .attr('stroke-width', '1')
                .attr('cx', (node) => node.x!)
                .attr('cy', (node) => node.y!)

            newNodes
                .append('text')
                .text((node: Nodes) => {
                    const labelNode = createdLableNodeHover(node);
                    return labelNode || '';
                })
                .attr('x', 16)
                .attr('y', -1)
                .attr('text-anchor', 'start')
                .attr('alignment-baseline', 'middle')
                .attr('font-size', 15)
                .attr('fill', '#fff')

            // merge update and enter.
            nodesGraph = newNodes.merge(nodesGraph)

            // append  circles to new nodes:
            nodesGraph.append('circle')
                .attr('r', RADIUSNODE)
                .attr('fill', (node: Nodes) => {
                    return (
                        classToColor[node.node_class as keyof typeof classToColor] ||
                        'gray'
                    );
                })


            const simulation = d3.forceSimulation(nodes);
            simulation.force('link', forceLink<Nodes, Edges>(edges).id((uuid) => uuid.uuid).distance(110))
            simulation.force('charge', d3.forceManyBody().strength(-30))
            simulation.force('center', d3.forceCenter().x(width / 2).y(height / 2))
            simulation.on('tick', ticked);
            simulation.alpha(1).restart();
        }

    }

    const ticked = () => {
        linksGraph
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);
        nodesGraph.attr('transform', (d) => `translate(${d.x},${d.y})`);
    };

    useEffect(() => {

        initNetworkgraph();

    }, []);

    /*
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
   
       const handleDoubleClick = async (nodeId: number, nodeClass: string, d: Nodes) => {
           const dataSend = {
               [nodeClass]: [Number(nodeId)],
           };
           const response = await dispatch(
               fetchPastNetworksGraphApi(dataSend)
           ).unwrap();
           if (response) {
               const newNodes: Nodes[] = response.nodes.filter((newNode: Nodes) => {
                   return !netWorkData.nodes.some(
                       (existingNode) => existingNode.uuid === newNode.uuid
                   );
               });
   
               const newEdges: Edges[] = response.edges.filter((newEdge: Edges) => {
                   return !netWorkData.edges.some(
                       (existingEdge) =>
                           existingEdge.source === newEdge.source &&
                           existingEdge.target === newEdge.target
                   );
               });
   
               const newEdgeState: Edges[] = [...netWorkData.edges, ...newEdges].map(d => ({ ...d }));
               const newNodeState: Nodes[] = [...netWorkData.nodes, ...newNodes].map(d => ({ ...d }));
               const simulation = d3
                   .forceSimulation(newNodeState)
                   .force('charge', d3.forceManyBody().strength(-30))
                   .force(
                       'link',
                       forceLink<Nodes, Edges>(newEdgeState)
                           .id((uuid) => uuid.uuid)
                           .distance(100)
                   )
                   .force(
                       'center',
                       d3.forceCenter()
                           .x(width / 2)
                           .y(height / 2)
                   )
                   .on('tick', () => {
                       updateNetwork({ edges: newEdgeState, nodes: newNodeState });
                   });
               simulationRef.current = simulation;
           }
       };
   
   
      
           useEffect(() => {
        
               if (!hasSimulationBeenCreated.current) {
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
                           updateNetwork({ edges: edges, nodes: nodes });
                       });
                   simulationRef.current = simulation;
        
               }
        
           }, [edges, nodes, width, height]);
        
       */


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



// ============= CODE Is Working on 1 Dec 2023============================
// import * as d3 from 'd3';
// import { forceLink, drag, select, zoomIdentity, } from 'd3';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { netWorkDataProps, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
// import { ENSLAVEMENTNODE, RADIUSNODE, classToColor } from '@/share/CONST_DATA';
// import { findHoveredEdge } from './findHoveredEdge';
// import ShowsAcoloredNodeKey from './ShowsAcoloredNodeKey';
// import { AppDispatch, RootState } from '@/redux/store';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//     createStrokeColor,
//     createdLableEdges,
//     createdLableNodeHover,
// } from '@/utils/functions/createdLableNode';
// import {
//     setNetWorksID,
//     setNetWorksKEY,
// } from '@/redux/getPastNetworksGraphDataSlice';
// import { fetchPastNetworksGraphApi } from '@/fetch/pastEnslavedFetch/fetchPastNetworksGraph';
// import { setIsModalCard, setNodeClass } from '@/redux/getCardFlatObjectSlice';
// import { link } from 'fs';

// type NetworkDiagramProps = {
//     width: number;
//     height: number;
// };

// export const NetworkDiagramSVGEnterNode = ({
//     width,
//     height,
// }: NetworkDiagramProps) => {
//     const { data: netWorkData } = useSelector(
//         (state: RootState) => state.getPastNetworksGraphData
//     );
//     const dispatch: AppDispatch = useDispatch();
//     const divRef = useRef<HTMLDivElement | null>(null);
//     const svgRef = useRef<SVGSVGElement | null>(null);
//     const transformRef = useRef<d3.ZoomTransform>(zoomIdentity);
//     const hasSimulationBeenCreated = useRef(false)
//     const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
//     const isDraggingRef = useRef(false);
//     const isZoomingRef = useRef(false);
//     const hoverEnabledRef = useRef(true);
//     const clickTimeout = useRef<NodeJS.Timeout | undefined>();
//     let timeout = 300;

//     const edges: Edges[] = netWorkData.edges.map((d) => {
//         return { ...d }
//     });
//     const nodes: Nodes[] = netWorkData.nodes.map((d) => {
//         return { ...d }
//     });

//     const clearClickTimeout = () => {
//         if (clickTimeout.current !== undefined) {
//             clearTimeout(clickTimeout.current);
//             clickTimeout.current = undefined;
//         }
//     };

//     const handleClickNodeShowCard = async (nodeId: number, nodeClass: string) => {
//         if (nodeClass !== ENSLAVEMENTNODE) {
//             dispatch(setIsModalCard(true));
//             dispatch(setNodeClass(nodeClass));
//             dispatch(setNetWorksID(nodeId));
//             dispatch(setNetWorksKEY(nodeClass));
//         }
//     };

//     const handleDoubleClick = async (nodeId: number, nodeClass: string, d: Nodes) => {
//         const dataSend = {
//             [nodeClass]: [Number(nodeId)],
//         };
//         const response = await dispatch(
//             fetchPastNetworksGraphApi(dataSend)
//         ).unwrap();
//         if (response) {
//             const newNodes: Nodes[] = response.nodes.filter((newNode: Nodes) => {
//                 return !netWorkData.nodes.some(
//                     (existingNode) => existingNode.uuid === newNode.uuid
//                 );
//             });

//             const newEdges: Edges[] = response.edges.filter((newEdge: Edges) => {
//                 return !netWorkData.edges.some(
//                     (existingEdge) =>
//                         existingEdge.source === newEdge.source &&
//                         existingEdge.target === newEdge.target
//                 );
//             });

//             const newEdgeState: Edges[] = [...netWorkData.edges, ...newEdges].map(d => ({ ...d }));
//             const newNodeState: Nodes[] = [...netWorkData.nodes, ...newNodes].map(d => ({ ...d }));
//             const simulation = d3
//                 .forceSimulation(newNodeState)
//                 .force('charge', d3.forceManyBody().strength(-30))
//                 .force(
//                     'link',
//                     forceLink<Nodes, Edges>(newEdgeState)
//                         .id((uuid) => uuid.uuid)
//                         .distance(100)
//                 )
//                 .force(
//                     'center',
//                     d3.forceCenter()
//                         .x(width / 2)
//                         .y(height / 2)
//                 )
//                 .on('tick', () => {
//                     updateNetwork({ edges: newEdgeState, nodes: newNodeState });
//                 });
//             simulationRef.current = simulation;
//         }
//     };

//     function updateNetwork(data: netWorkDataProps) {
//         if (!svgRef.current) {
//             return;
//         }

//         const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);

//         // Update existing edges' positions
//         const edgeSelection = svg
//             .selectAll<SVGLineElement, Edges>('.link')
//             .data(data.edges, (d: Edges) => `${d.source}-${d.target}`);
//         edgeSelection
//             .attr('x1', (link) => {
//                 if (
//                     link.source &&
//                     link.target &&
//                     typeof link.source !== 'string' &&
//                     typeof link.target !== 'string' &&
//                     typeof link.source.x === 'number' &&
//                     typeof link.source.y === 'number' &&
//                     typeof link.target.x === 'number' &&
//                     typeof link.target.y === 'number'
//                 ) {
//                     return String(link.source.x);
//                 }
//                 return '0';
//             })
//             .attr('y1', (link) => {
//                 if (
//                     link.source &&
//                     link.target &&
//                     typeof link.source !== 'string' &&
//                     typeof link.target !== 'string' &&
//                     typeof link.source.x === 'number' &&
//                     typeof link.source.y === 'number' &&
//                     typeof link.target.x === 'number' &&
//                     typeof link.target.y === 'number'
//                 ) {
//                     return String(link.source.y);
//                 }
//                 return '0';
//             })
//             .attr('x2', (link) => {
//                 if (
//                     link.source &&
//                     link.target &&
//                     typeof link.source !== 'string' &&
//                     typeof link.target !== 'string' &&
//                     typeof link.source.x === 'number' &&
//                     typeof link.source.y === 'number' &&
//                     typeof link.target.x === 'number' &&
//                     typeof link.target.y === 'number'
//                 ) {
//                     return String(link.target.x);
//                 }
//                 return '0';
//             })
//             .attr('y2', (link) => {
//                 if (
//                     link.source &&
//                     link.target &&
//                     typeof link.source !== 'string' &&
//                     typeof link.target !== 'string' &&
//                     typeof link.source.x === 'number' &&
//                     typeof link.source.y === 'number' &&
//                     typeof link.target.x === 'number' &&
//                     typeof link.target.y === 'number'
//                 ) {
//                     return String(link.target.y);
//                 }
//                 return '0';
//             })

//             .join((enter) => {
//                 const links = enter.append('line')
//                     .attr('class', 'link')
//                     .attr('stroke-width', '1.5')
//                     .style('cursor', 'pointer')
//                     .attr('stroke', (link) => {
//                         const strokeColor = createStrokeColor(link);
//                         return strokeColor;
//                     })
//                     .attr('x1', (link) => {
//                         if (
//                             link.source &&
//                             link.target &&
//                             typeof link.source !== 'string' &&
//                             typeof link.target !== 'string' &&
//                             typeof link.source.x === 'number' &&
//                             typeof link.source.y === 'number' &&
//                             typeof link.target.x === 'number' &&
//                             typeof link.target.y === 'number'
//                         ) {
//                             return String(link.source.x);
//                         }
//                         return '0';
//                     })
//                     .attr('y1', (link) => {
//                         if (
//                             link.source &&
//                             link.target &&
//                             typeof link.source !== 'string' &&
//                             typeof link.target !== 'string' &&
//                             typeof link.source.x === 'number' &&
//                             typeof link.source.y === 'number' &&
//                             typeof link.target.x === 'number' &&
//                             typeof link.target.y === 'number'
//                         ) {
//                             return String(link.source.y);
//                         }
//                         return '0';
//                     })
//                     .attr('x2', (link) => {
//                         if (
//                             link.source &&
//                             link.target &&
//                             typeof link.source !== 'string' &&
//                             typeof link.target !== 'string' &&
//                             typeof link.source.x === 'number' &&
//                             typeof link.source.y === 'number' &&
//                             typeof link.target.x === 'number' &&
//                             typeof link.target.y === 'number'
//                         ) {
//                             return String(link.target.x);
//                         }
//                         return '0';
//                     })
//                     .attr('y2', (link) => {
//                         if (
//                             link.source &&
//                             link.target &&
//                             typeof link.source !== 'string' &&
//                             typeof link.target !== 'string' &&
//                             typeof link.source.x === 'number' &&
//                             typeof link.source.y === 'number' &&
//                             typeof link.target.x === 'number' &&
//                             typeof link.target.y === 'number'
//                         ) {
//                             return String(link.target.y);
//                         }
//                         return '0';
//                     })
//                 links.on('mousemove', (event, link) => {
//                     if ('source' in link && 'target' in link && typeof link.source !== 'string' && typeof link.target !== 'string') {
//                         const labelEdge = createdLableEdges(link as Edges);
//                         console.log({ labelEdge })
//                         const sourceX = (link).source.x;
//                         const sourceY = (link).source.y;
//                         const targetX = (link).target.x;
//                         const targetY = (link).target.y;

//                         if (
//                             typeof sourceX === 'number' && typeof sourceY === 'number' &&
//                             typeof targetX === 'number' && typeof targetY === 'number'
//                         ) {
//                             const midpointX = (sourceX + targetX) / 2;
//                             const midpointY = (sourceY + targetY) / 2;
//                             const textLabel = d3.select('svg')
//                                 .append('text')
//                                 .attr('class', 'edge-label')
//                                 .text('labelEdge')
//                                 .attr('x', midpointX)
//                                 .attr('y', midpointY)
//                                 .style('font-size', '12px')
//                                 .style('pointer-events', 'none')
//                                 .style('text-anchor', 'middle')
//                                 .style('alignment-baseline', 'middle')
//                                 .style('font-family', 'Arial')
//                                 .style('font-size', '15px')
//                                 .style('fill', '#fff');
//                             textLabel.style('pointer-events', 'none');
//                         }
//                     }
//                 });

//                 return links;
//             })

//         const nodeSelection = svg
//             .selectAll<SVGCircleElement, Nodes>('.node')
//             .data(data.nodes, (d: Nodes) => d.uuid);

//         nodeSelection
//             .attr('cx', (node) => isNaN(node.x!) ? 0 : Number(String(node.x)))
//             .attr('cy', (node) => isNaN(node.y!) ? 0 : Number(String(node.y)))
//             .join(
//                 (enter) =>
//                     enter
//                         .append('circle')
//                         .attr('class', 'node')
//                         .attr('id', (node) => node.uuid)
//                         .attr('r', RADIUSNODE)
//                         .attr('stroke', '#fff')
//                         .style('cursor', 'pointer')
//                         .attr('stroke-width', '1.5')
//                         .attr('cx', (node) => node.x!)
//                         .attr('cy', (node) => node.y!)
//                         .attr('fill', (node: Nodes) => {
//                             return (
//                                 classToColor[node.node_class as keyof typeof classToColor] ||
//                                 'gray'
//                             );
//                         })
//                         .on('click', (event: MouseEvent, d: Nodes) => {
//                             event.preventDefault()
//                             clearClickTimeout();
//                             handleDoubleClick(d.id, d.node_class, d);

//                             // will un comment later
//                             // if (event.detail === 1) {
//                             //     clickTimeout.current = setTimeout(() => {
//                             //         handleClickNodeShowCard(d.id, d.node_class);
//                             //     }, timeout);
//                             // }
//                             // if (event.detail === 2) {
//                             //     handleDoubleClick(d.id, d.node_class);
//                             // }
//                         })
//             )

//         const labelSelection = svg.selectAll('.label').data(data.nodes)
//         labelSelection
//             .attr('x', (node: Nodes) => Number(node.x) + 15.5)
//             .attr('y', (node: Nodes) => Number(node.y))
//             .join(
//                 (enter) =>
//                     enter
//                         .append('text')
//                         .attr('x', (node: Nodes) => Number(node.x) + 15.5)
//                         .attr('y', (node: Nodes) => Number(node.y))
//             )
//             .attr('class', 'label')
//             .attr('text-anchor', 'start')
//             .attr('alignment-baseline', 'middle')
//             .attr('font-family', 'Arial')
//             .attr('font-size', 15)
//             .attr('fill', '#fff')
//             .text((node: Nodes) => {
//                 const labelNode = createdLableNodeHover(node);
//                 return labelNode || '';
//             })

//     }

//     useEffect(() => {

//         if (!hasSimulationBeenCreated.current) {
//             const simulation = d3
//                 .forceSimulation(nodes)
//                 .force('charge', d3.forceManyBody().strength(-30))
//                 .force(
//                     'link',
//                     forceLink<Nodes, Edges>(edges)
//                         .id((uuid) => uuid.uuid)
//                         .distance(100)
//                 )
//                 .force(
//                     'center',
//                     d3
//                         .forceCenter()
//                         .x(width / 2)
//                         .y(height / 2)
//                 )
//                 .on('tick', () => {
//                     updateNetwork({ edges: edges, nodes: nodes });
//                 });
//             simulationRef.current = simulation;

//         }

//     }, [edges, nodes, width, height]);


//     // useEffect(() => {
//     //     if (!simulationRef.current || !nodes || !edges) {
//     //         return;
//     //     }
//     //     const linkForce: d3.ForceLink<Nodes, Edges> = forceLink<Nodes, Edges>(edges)
//     //         .id((d: Nodes) => d.id)
//     //         .distance(100);

//     //     // Update simulation with new data
//     //     simulationRef.current.nodes(nodes);
//     //     simulationRef.current?.force('link', linkForce);
//     //     // Restart the simulation
//     //     simulationRef.current.alpha(1).restart();
//     // }, []);

//     return (
//         <>
//             <svg
//                 ref={svgRef}
//                 width={width}
//                 height={height}
//                 id="networkCanvas labelsContainer"
//             ></svg>
//             <ShowsAcoloredNodeKey />
//         </>
//     );
// };