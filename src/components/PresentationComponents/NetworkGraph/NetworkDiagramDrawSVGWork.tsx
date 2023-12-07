import * as d3 from 'd3';
import { forceLink, zoomIdentity } from 'd3';
import { useCallback, useEffect, useRef } from 'react';
import {
    Edges,
    Nodes,
    netWorkDataProps,
} from '@/share/InterfaceTypePastNetworks';
import { ENSLAVEMENTNODE, RADIUSNODE, classToColor } from '@/share/CONST_DATA';
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
} from '@/redux/getPastNetworksGraphDataSlice';
import { fetchPastNetworksGraphApi } from '@/fetch/pastEnslavedFetch/fetchPastNetworksGraph';
import { setIsModalCard, setNodeClass } from '@/redux/getCardFlatObjectSlice';

type NetworkDiagramProps = {
    width: number;
    height: number;
};

export const NetworkDiagramDrawSVGWork = ({
    width,
    height,
}: NetworkDiagramProps) => {
    const { data: netWorkData } = useSelector(
        (state: RootState) => state.getPastNetworksGraphData
    );
    const dispatch: AppDispatch = useDispatch();
    const svgRef = useRef<SVGSVGElement | null>(null);
    const transformRef = useRef<d3.ZoomTransform>(zoomIdentity);
    const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
    const isDraggingRef = useRef(false);
    const isZoomingRef = useRef(false);
    const hoverEnabledRef = useRef(true);
    const clickTimeout = useRef<NodeJS.Timeout | undefined>();
    let timeout = 300;

    const edges: Edges[] = netWorkData.edges?.map((d) => ({ ...d }));
    const nodes: Nodes[] = netWorkData.nodes?.map((d) => ({ ...d }));
    const nodeIds = new Set(nodes.map((node) => node.uuid));
    const validEdges = edges.filter(
        (edge) =>
            nodeIds.has(edge.source as string) && nodeIds.has(edge.target as string)
    );

    let graph: { nodes: Nodes[]; edges: Edges[] } = {
        nodes: nodes,
        edges: validEdges,
    };

    useEffect(() => {
        initNetworkgraph();
    }, []);

    const initNetworkgraph = (): { nodes: Nodes[]; edges: Edges[] } => {
        const updatedGraph: netWorkDataProps = {
            nodes: graph.nodes,
            edges: graph.edges,
        };
        updateNetwork();
        return updatedGraph;
    };

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
            simulation.force(
                'link',
                forceLink<Nodes, Edges>(updatedEdges)
                    .id((uuid) => uuid.uuid)
                    .distance(110)
            );
            simulation.force('charge', d3.forceManyBody());
            simulation.randomSource;

            graph = { nodes: updatedNodes, edges: updatedEdges };
            updateNetwork();
            const updatedGraph = initNetworkgraph();
            if (updatedGraph) {
                graph = updatedGraph;
                updateNetwork();
            }
        }
    };

    let linksGraph: d3.Selection<SVGLineElement, any, SVGGElement, unknown>;
    let nodesGraph: d3.Selection<SVGGElement, any, SVGGElement, unknown>;
    const dragBehavior = d3.drag<SVGGElement, Nodes, unknown>();

    useEffect(() => {
        const svg = svgRef.current;
        if (svgRef.current) {
            const svg = d3
                .select<SVGSVGElement, unknown>(svgRef.current)
                .attr('viewBox', [0, 0, width, height]);
            function handleZoom(event: d3.D3ZoomEvent<SVGSVGElement, any>) {
                const transform = event.transform;
                if (svgRef.current) {
                    if (transform) {
                        const scale = transform.k;
                        const { x, y } = transform;

                        const transformString = `translate(${x}, ${y}) scale(${scale})`;
                        svg.attr('transform', transformString).style('cursor', 'pointer');
                    }
                }
            }

            const zoomHandler = d3.zoom<SVGSVGElement, any>().on('zoom', handleZoom);
            svg.call(zoomHandler).on('dblclick.zoom', null).on('click.zoom', null);
        }

        return () => {
            if (!svg) return;
        };
    }, [svgRef, width, height]);

    useEffect(() => {
        const svgCleanup = () => {
            if (svgRef.current) {
                const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
                svg.on('.zoom', null);
            }
            transformRef.current = zoomIdentity;
            simulationRef.current = null;
            isDraggingRef.current = false;
            isZoomingRef.current = false;
            hoverEnabledRef.current = true;
            clearClickTimeout();
        };
        return svgCleanup;
    }, []);

    const updateNetwork = useCallback(() => {
        if (!svgRef.current) return;
        if (svgRef.current) {
            const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);

            const dragStarted = (
                event: d3.D3DragEvent<SVGGElement, Nodes, Nodes>
            ) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                const d = event.subject;
                if (d) {
                    d.fx = d.x;
                    d.fy = d.y;
                }
            };

            const dragged = (event: d3.D3DragEvent<SVGGElement, Nodes, Nodes>) => {
                const d = event.subject;
                if (d) {
                    d.fx = event.x || 0;
                    d.fy = event.y || 0;
                }
            };

            const dragEnded = (event: d3.D3DragEvent<SVGGElement, Nodes, Nodes>) => {
                if (!event.active) simulation.alphaTarget(0);
                const d = event.subject;
                if (d) {
                    d.fx = null;
                    d.fy = null;
                }
            };

            // Links
            linksGraph = svg
                .selectAll<SVGLineElement, unknown>('line')
                .data(graph.edges);

            // remove excess link.
            linksGraph.exit().remove();

            const newLinks = linksGraph.enter().append('line');
            newLinks
                .attr('class', 'link')
                .attr('stroke-width', '1.5')
                .style('cursor', 'pointer');

            newLinks.attr('stroke', (link: Edges) => {
                const strokeColor = createStrokeColor(link);
                return strokeColor;
            });

            newLinks
                .append('text')
                .attr('text-anchor', 'middle')
                .text((node: Nodes) => {
                    const labelNode = createdLableNodeHover(node);
                    return labelNode || 'Hello';
                })
                .attr('x', 300)
                .attr('y', 290);

            linksGraph = newLinks.merge(linksGraph);

            nodesGraph = svg.selectAll<SVGGElement, unknown>('g').data(graph.nodes);

            dragBehavior
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded);

            // remove excess nodes.
            nodesGraph.exit().remove();

            // enter new nodes as required:
            const newNodes = nodesGraph
                .enter()
                .append('g')
                .attr('opacity', 0)
                .call(dragBehavior);

            newNodes.on('click', async (event: MouseEvent, d: Nodes) => {
                event.preventDefault();
                clearClickTimeout();
                if (event.detail === 1) {
                    clickTimeout.current = setTimeout(() => {
                        handleClickNodeShowCard(d.id, d.node_class);
                    }, timeout);
                }
                if (event.detail === 2) {
                    handleDoubleClick(d.id, d.node_class);
                }
            });

            newNodes
                .transition()
                .attr('opacity', 1)
                .attr('class', 'nodes')
                .attr('stroke', '#fff')
                .style('cursor', 'pointer')
                .attr('stroke-width', '1')
                .attr('cx', (node) => node.x!)
                .attr('cy', (node) => node.y!);

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
                .attr('fill', '#fff');

            // merge update and enter.
            nodesGraph = newNodes.merge(nodesGraph);

            // append  circles to new nodes:
            nodesGraph
                .append('circle')
                .attr('r', RADIUSNODE)
                .attr('fill', (node: Nodes) => {
                    return (
                        classToColor[node.node_class as keyof typeof classToColor] || 'gray'
                    );
                });

            const simulation = d3.forceSimulation(nodes);
            simulation.force(
                'link',
                forceLink<Nodes, Edges>(edges)
                    .id((uuid) => uuid.uuid)
                    .distance(110)
            );
            simulation.force('charge', d3.forceManyBody().strength(-30));
            simulation.force(
                'center',
                d3
                    .forceCenter()
                    .x(width / 2)
                    .y(height / 2)
            );
            simulation.on('tick', ticked);
            simulation.alpha(1).restart();
        }
    }, [svgRef]);

    function ticked() {
        linksGraph
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);
        nodesGraph.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

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
