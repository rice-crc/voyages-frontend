
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
    const edges: Edges[] = netWorkData.edges?.map((d) => ({ ...d }));
    const nodes: Nodes[] = netWorkData.nodes?.map((d) => ({ ...d }));

    const nodeIds = new Set(nodes.map((node) => node.uuid));
    const validEdges = edges.filter(
        (edge) =>
            nodeIds.has(edge.source as string) && nodeIds.has(edge.target as string)
    );

    const dispatch: AppDispatch = useDispatch();
    const svgRef = useRef<SVGSVGElement | null>(null);
    const transformRef = useRef<d3.ZoomTransform>(zoomIdentity);
    const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
    const isDraggingRef = useRef(false);
    const clickTimeout = useRef<NodeJS.Timeout | undefined>();
    let timeout = 300;

    const graph = useRef<{ nodes: Nodes[]; edges: Edges[] }>({
        nodes: nodes,
        edges: validEdges
    })


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
                return !graph.current.nodes.some(
                    (existingNode) => existingNode.uuid === newNode.uuid
                );
            });

            const newEdges: Edges[] = response.edges.filter((newEdge: Edges) => {
                return !graph.current.edges.some(
                    (existingEdge) =>
                        existingEdge.source === newEdge.source &&
                        existingEdge.target === newEdge.target
                );
            });


            const updatedNodes: Nodes[] = [...graph.current.nodes, ...newNodes];
            const updatedEdges: Edges[] = [...graph.current.edges, ...newEdges];

            simulationRef.current = d3.forceSimulation(updatedNodes).force(
                'link',
                forceLink<Nodes, Edges>(updatedEdges)
                    .id((uuid) => uuid.uuid)
                    .distance(105)
            ).force('charge', d3.forceManyBody());
            simulationRef.current.randomSource;

            graph.current.nodes = updatedNodes
            graph.current.edges = updatedEdges

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

            let networkGroup: d3.Selection<SVGGElement, unknown, null, undefined> = svg.select<SVGGElement>("#networkGroup");
            let link = networkGroup.select<SVGGElement>("#edges");
            let node = networkGroup.select<SVGGElement>("#nodes");
            let labels = networkGroup.select<SVGGElement>("#labels");

            if (networkGroup.empty()) {
                networkGroup = svg.append("g").attr("id", "networkGroup");
            }

            if (link.empty()) {
                link = networkGroup.append("g").attr("id", "edges");
            }

            if (node.empty()) {
                node = networkGroup.append("g").attr("id", "nodes");
            }

            if (labels.empty()) {
                labels = networkGroup.append("g").attr("id", "labels");
            }

            // Links
            linksGraph = link.selectAll<SVGLineElement, unknown>('line').data(graph.current.edges);

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
            nodesGraph = node.selectAll<SVGCircleElement, unknown>('circle').data(graph.current.nodes);

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
                // }
            });

            newNodes.on('mouseout', async (event: MouseEvent, node: Nodes) => {
                event.preventDefault();
                d3.select('.label-hover').remove();
                d3.select('.background-rect').remove();
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
            nodeLabels = labels.selectAll<SVGTextElement, Nodes>('text.label').data(graph.current.nodes);
            const newNodeLabels = nodeLabels.enter().append('text')
            nodeLabels = newNodeLabels.merge(nodeLabels);

            /** Requested from JM-0116  
             * Right now, we are hiding the labels on enslavers and enslaved, and only showing those labels on rollover. 
             * Can we do the same thing with the yellow voyages nodes?
             * 
             ***  ** This code, will show label on voyages **** 
             * const newNodeLabels = nodeLabels.enter().append('text')
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
             nodeLabels = newNodeLabels.merge(nodeLabels);
             */

            function handleZoom(event: d3.D3ZoomEvent<SVGSVGElement, any>) {
                transformRef.current = event.transform;
                if (svgRef.current && transformRef.current) {
                    const transformString = `translate(${event.transform.x}, ${event.transform.y}) scale(${event.transform.k})`;
                    d3.select('#networkGroup').attr('transform', transformString);
                }
            }

            const dragStarted = (
                event: d3.D3DragEvent<SVGGElement, Nodes, Nodes>
            ) => {
                isDraggingRef.current = true;
                event.sourceEvent.stopPropagation();
                if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
                const d = event.subject;
                if (d) {
                    d.fx = d.x;
                    d.fy = d.y;
                }
            };
            const dragged = (event: d3.D3DragEvent<SVGGElement, Nodes, Nodes>) => {
                event.sourceEvent.stopPropagation();
                isDraggingRef.current = false;
                const d = event.subject;
                if (d) {
                    d.fx = event.x || 0;
                    d.fy = event.y || 0;
                }
            };

            const dragEnded = (event: d3.D3DragEvent<SVGGElement, Nodes, Nodes>) => {
                isDraggingRef.current = false;
                if (!event.active) simulationRef.current?.alphaTarget(0);
                const d = event.subject;
                if (d) {
                    d.fx = null;
                    d.fy = null;
                }
            };

            nodesGraph.call(d3.drag<SVGCircleElement, Nodes>()
                .on("start", dragStarted)
                .on("drag", dragged)
                .on("end", dragEnded));

            const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 3.5])
                .on('zoom', handleZoom)


            svg.call(zoomBehavior as any)
                .on("dblclick.zoom", null)
                .on("click.zoom", null)

            simulationRef.current = d3.forceSimulation(nodes)
                .force(
                    'link',
                    forceLink<Nodes, Edges>(validEdges)
                        .id((uuid) => uuid.uuid)
                        .distance(105)
                ).force('charge', d3.forceManyBody().strength(-30)).force(
                    'center',
                    d3
                        .forceCenter()
                        .x(width / 2)
                        .y(height / 2)
                );
            simulationRef.current.on('tick', ticked);
            simulationRef.current.alpha(1).restart();
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
