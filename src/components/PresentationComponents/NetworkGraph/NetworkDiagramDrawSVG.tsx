
import * as d3 from 'd3';
import { forceLink, zoomIdentity } from 'd3';
import { useCallback, useEffect, useRef } from 'react';
import {
    Edges,
    Nodes,
} from '@/share/InterfaceTypePastNetworks';
import { ENSLAVEMENTNODE, RADIUSNODE, classToColor } from '@/share/CONST_DATA';
import ShowsAcoloredNodeKey from './ShowsAcoloredNodeKey';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
    createStrokeColor,
    createdLabelNodeHover,
} from '@/utils/functions/createdLabelNodeHover';
import {
    setNetWorksID,
    setNetWorksKEY,
} from '@/redux/getPastNetworksGraphDataSlice';
import { fetchPastNetworksGraphApi } from '@/fetch/pastEnslavedFetch/fetchPastNetworksGraph';
import { setIsModalCard, setNodeClass } from '@/redux/getCardFlatObjectSlice';
import { isVoyagesClass } from '@/utils/functions/checkNodeClass';
import '@/style/networks.scss'
import { findNode } from './findNode';
import { padding } from '@mui/system';

type NetworkDiagramProps = {
    width: number;
    height: number;
};

export const NetworkDiagramDrawSVG = ({
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

    const initNetworkgraph = () => {
        updateNetwork();
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
        }
    };


    let linksGraph: d3.Selection<SVGLineElement, any, SVGGElement, unknown>;
    let nodesGraph: d3.Selection<SVGCircleElement, Nodes, SVGGElement, unknown>;
    let nodeLabels: d3.Selection<SVGTextElement, Nodes, SVGGElement, unknown>;

    const updateNetwork = useCallback(() => {
        if (!svgRef.current) return;
        if (svgRef.current) {
            const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);


            let link: d3.Selection<SVGGElement, unknown, null, undefined> = svg.select<SVGGElement>("#edges");
            let node: d3.Selection<SVGGElement, unknown, null, undefined> = svg.select<SVGGElement>("#nodes");
            let labels: d3.Selection<SVGGElement, unknown, null, undefined> = svg.select<SVGGElement>("#labels")

            if (link.empty()) {
                link = svg.append("g").attr("id", "edges");
            }

            if (node.empty()) {
                node = svg.append("g").attr("id", "nodes");
            }

            if (labels.empty()) {
                labels = svg.append("g").attr("id", "labels");
            }

            // Links
            linksGraph = link.selectAll<SVGLineElement, unknown>('line').data(graph.edges);

            // remove excess link.
            linksGraph.exit().remove()

            const newLinks = linksGraph.enter().append('line')
            newLinks
                .attr('class', 'link-graph')
                .attr('stroke-width', '3.5')
                .style('cursor', 'pointer');

            newLinks.attr('stroke', (link: Edges) => {
                const strokeColor = createStrokeColor(link);
                return strokeColor;
            });
            linksGraph = newLinks.merge(linksGraph as d3.Selection<SVGLineElement, Edges, SVGGElement, unknown>);

            // Nodes 
            nodesGraph = node.selectAll<SVGCircleElement, unknown>('circle').data(graph.nodes);

            // remove excess nodes.
            nodesGraph.exit().remove();

            const newNodes = nodesGraph.enter().append('circle')
            newNodes
                .transition()
                .attr('opacity', 1)
                .attr('class', 'nodes')
                .attr('stroke', '#fff')
                .style('cursor', 'pointer')
                .attr('stroke-width', '2')
                .attr('cx', (node) => node.x!)
                .attr('cy', (node) => node.y!)
                .attr('r', RADIUSNODE)
                .attr('fill', (node: Nodes) => {
                    return (
                        classToColor[node.node_class as keyof typeof classToColor] || 'gray'
                    );
                });

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
            })

            newNodes.on('mouseover', async (event: MouseEvent, node: Nodes) => {
                event.preventDefault();
                const checkNode = isVoyagesClass(node)
                if (!checkNode) {

                    const labelNode = createdLabelNodeHover(node);

                    // Append the background when hover
                    const [x, y] = [node.x!, node.y!];
                    labels = svg.select<SVGGElement>('#labels');
                    const group = labels.append('g').attr('class', 'label-group');

                    const textElement = group.append('text')
                        .attr('class', 'label-hover')
                        .attr('x', x + 22)
                        .attr('y', y)
                        .attr('text-anchor', 'start')
                        .attr('alignment-baseline', 'start')
                        .attr('font-size', 15)
                        .attr('font-weight', 'bold')
                        .attr('fill', '#000')
                        .text(labelNode || '');
                    const textBoundingBox = textElement.node()?.getBBox();
                    if (textBoundingBox) {
                        const rectPadding = 4;
                        const rectWidth = textBoundingBox.width + (2 * rectPadding);
                        const rectHeight = textBoundingBox.height + (2 * rectPadding);

                        group.append('rect')
                            .attr('class', 'background-rect')
                            .attr('x', textBoundingBox.x - rectPadding)
                            .attr('y', textBoundingBox.y - rectPadding)
                            .attr('width', rectWidth)
                            .attr('height', rectHeight)
                            .attr('rx', 8)
                            .attr('ry', 8)
                            .attr('fill', '#fff')

                        textElement.raise();
                    }


                    // Append the background rect
                    // const rectWidth = labelNode?.length! + 120;
                    // const rectHeight = labelNode?.length! + 10;


                    // group.append('rect')
                    //     .attr('class', 'background-rect')
                    //     .attr('x', x + 17)
                    //     .attr('y', y - 17)
                    //     .attr('width', rectWidth)
                    //     .attr('height', rectHeight)
                    //     .attr('rx', 8)
                    //     .attr('ry', 8)
                    //     .style('padding', 10)
                    //     .attr('fill', '#fff')

                    // // Append the label text
                    // group.append('text')
                    //     .attr('class', 'label-hover')
                    //     .attr('x', x + 22)
                    //     .attr('y', y)
                    //     .attr('text-anchor', 'start')
                    //     .attr('alignment-baseline', 'start')
                    //     .attr('font-size', 16)
                    //     .attr('font-weight', 'bold')
                    //     .attr('fill', '#000')
                    //     .text(labelNode || '');

                }
            });

            newNodes.on('mouseout', async (event: MouseEvent, node: Nodes) => {
                event.preventDefault();
                const nodeClass = isVoyagesClass(node);
                if (!nodeClass) {
                    d3.select('.label-hover').remove();
                    d3.select('.background-rect').remove();
                }
            });


            newNodes
                .transition()
                .attr('opacity', 1)
                .attr('class', 'nodes')
                .attr('stroke', '#fff')
                .style('cursor', 'pointer')
                .attr('stroke-width', '2')
                .attr('r', RADIUSNODE)
                .attr('fill', (node: Nodes) => {
                    return (
                        classToColor[node.node_class as keyof typeof classToColor] || 'gray'
                    );
                })

            nodesGraph = newNodes.merge(nodesGraph as d3.Selection<SVGCircleElement, Nodes, SVGGElement, unknown>)

            // Label 
            nodeLabels = labels.selectAll<SVGTextElement, Nodes>('text.label').data(graph.nodes);

            const newNodeLabels = nodeLabels.enter().append('text')
                .attr('class', 'label')
                .attr('x', (node) => !isNaN(Number(node.x)) ? Number(node.x) + 17 : 0)
                .attr('y', (node) => node.y!)
                .attr('text-anchor', 'start')
                .attr('alignment-baseline', 'start')
                .attr('font-size', 16)
                .attr('fill', '#fff')
                .attr('font-weight', 'bold')
                .text((node: Nodes) => {
                    const nodeClass = isVoyagesClass(node)
                    const labelNode = createdLabelNodeHover(node);
                    return nodeClass ? labelNode! : '';
                });

            // Merge new label nodes with existing ones
            nodeLabels = newNodeLabels.merge(nodeLabels);

            const simulation = d3.forceSimulation(nodes);
            simulation.force(
                'link',
                forceLink<Nodes, Edges>(validEdges)
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

            function handleZoom(event: d3.D3ZoomEvent<SVGSVGElement, any>) {
                const transform = event.transform;
                if (svgRef.current && transform) {
                    const scale = transform.k;
                    const { x, y } = transform;

                    const transformString = `translate(${x}, ${y}) scale(${scale})`;
                    svgRef.current.setAttribute('transform', transformString);
                    svgRef.current.style.cursor = 'pointer';
                }
            }

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

            // Define drag behavior
            const dragBehavior = d3.drag<SVGCircleElement, Nodes, unknown>()
            dragBehavior
                .subject(dragSubject)
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded);

            const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 3])
                .on('zoom', handleZoom);

            svg.call(dragBehavior as any).call(zoomBehavior as any)
                .on("dblclick.zoom", null)
                .on("click.zoom", null);

        }

    }, [svgRef, width, height]);

    function ticked() {
        linksGraph
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);
        nodesGraph.attr('transform', (d) => `translate(${d.x},${d.y})`);
        nodeLabels.attr('x', (node) => !isNaN(node.x!) && Number(node.x!) + 17)
        nodeLabels.attr('y', (node) => node.y!)
    }

    useEffect(() => {
        const svgCleanup = () => {
            if (svgRef.current) {
                const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
                svg.on('zoom', null);
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

    return (
        <>
            <svg
                ref={svgRef}
                className='svg-network'
                width={width}
                height={height}
                id="networkCanvas labelsContainer"
            ></svg>
            <ShowsAcoloredNodeKey />
        </>
    );
};