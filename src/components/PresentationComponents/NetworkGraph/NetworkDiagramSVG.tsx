import * as d3 from 'd3';
import { pointer, forceLink, drag, zoomIdentity } from 'd3';
import { useEffect, useRef } from 'react';
import { Datas, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import { findNode, findNodeSvg } from './findNode';
import { RADIUSNODE, classToColor } from '@/share/CONST_DATA';
import { findHoveredEdge } from './findHoveredEdge';
import ShowsAcoloredNodeKey from './ShowsAcoloredNodeKey';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { drawNetworkSVG } from './drawNetworkSVG';
import { drawNetwork } from './drawNetwork';
import {
    createStrokeColor,
    createdLableNodeHover,
} from '@/utils/functions/createdLableNode';

type NetworkDiagramProps = {
    width: number;
    height: number;
    // netWorkData: Datas;
    // newUpdateNetWorkData: Datas;
    handleNodeDoubleClick: (nodeId: number, nodeClass: string) => Promise<void>;
    handleClickNodeShowCard: (nodeId: number, nodeClass: string) => Promise<void>;
};

export const NetworkDiagramSVG = ({
    width,
    height,
    // netWorkData,
    // newUpdateNetWorkData,
    handleNodeDoubleClick,
    handleClickNodeShowCard,
}: // changedNetWorkData
    NetworkDiagramProps) => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const transformRef = useRef<d3.ZoomTransform>(zoomIdentity);
    const simulationRef = useRef<d3.Simulation<Nodes, Edges> | null>(null);
    const isDraggingRef = useRef(false);
    const isZoomingRef = useRef(false);
    const hoverEnabledRef = useRef(true);
    const clickTimeout = useRef<NodeJS.Timeout | undefined>();
    let timeout = 300;

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

    const clearClickTimeout = () => {
        if (clickTimeout.current !== undefined) {
            clearTimeout(clickTimeout.current);
            clickTimeout.current = undefined;
        }
    };

    const handleClickNodeCard = (node: Nodes) => {
        handleClickNodeShowCard(node.id, node.node_class);
    };

    const handleDoubleClick = (node: Nodes) => {
        handleNodeDoubleClick(node.id, node.node_class);
    };

    const svg = d3.create('svg');
    const link = svg.append('g').selectAll('line').data(validEdges).join('line');

    const node = svg.append('g').selectAll('circle').data(nodes).join('circle');
    // const node = svg.append('g').selectAll('circle').data(nodes).join(
    //     enter => (
    //         enter.append("circle")
    //             .attr("class", "node")
    //             .attr("r", RADIUSNODE)
    //             .attr('stroke', '#fff')
    //             .attr('stroke-width', '1.5')
    //             .attr('fill', (node: Nodes) => {
    //                 return classToColor[node.node_class as keyof typeof classToColor] || 'gray';
    //             })
    //             .attr("cx", node => String(node.x))
    //             .attr("cy", node => String(node.y))
    //     )
    // )

    const label = svg.selectAll('label').data(nodes).join('text');

    applyStyle(svg);

    function applyStyle(
        selectionSVG: d3.Selection<SVGSVGElement, undefined, null, undefined>
    ) {
        selectionSVG
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [-width / 2, -height / 2, width, height]);

        selectionSVG
            .selectAll('circle')
            .attr('r', RADIUSNODE)
            .attr('stroke', '#fff');

        selectionSVG
            .selectAll('line')
            .attr('stroke', '#fff')
            .attr('stroke-width', '1.5')
            .attr('stroke', (link: any) => {
                const strokeColor = createStrokeColor(link);
                return strokeColor;
            })
            .attr('stroke-width', '1.5')
            .attr('fill', 'none');
    }

    const simulation = d3
        .forceSimulation(nodes)
        .force(
            'link',
            forceLink<Nodes, Edges>(edges)
                .id((uuid) => uuid.uuid)
                .distance(100)
        )
        .force('charge', d3.forceManyBody().strength(-100))
        .force('x', d3.forceX())
        .force('y', d3.forceY());

    simulation.on('tick', () => {
        link
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
            });
        node
            .attr('cx', (node) => String(node.x))
            .attr('cy', (node) => String(node.y))
            .attr('class', 'node')
            .attr('r', RADIUSNODE)
            .attr('stroke', '#fff')
            .attr('stroke-width', '1.5')
            .style('fill', (node: Nodes) => {
                return (
                    classToColor[node.node_class as keyof typeof classToColor] || 'gray'
                );
            })
            .attr('cx', (node) => String(node.x))
            .attr('cy', (node) => String(node.y))
            .on('click', (event: MouseEvent, d: Nodes) => {
                handleDoubleClick(d);
            });

        label
            .attr('class', 'label')
            .attr('text-anchor', 'right')
            .attr('alignment-baseline', 'right')
            .attr('font-family', 'Arial')
            .attr('font-size', 15)
            .attr('fill', '#fff')
            .text((node: Nodes) => {
                const labelNode = createdLableNodeHover(node);
                return labelNode || '';
            })
            .attr('x', (node: Nodes) => String(node.x! + 13))
            .attr('y', (node: Nodes) => String(node.y! + 6));
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

    const dragBehavior = drag<SVGSVGElement, Nodes | undefined, unknown>();

    dragBehavior
        .subject(dragSubject)
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded);

    if (svgRef.current) {
        svg.call(dragBehavior as any);
    }
    //ComponentDidMount
    useEffect(() => {
        if (divRef.current) {
            var div = d3.select(divRef.current);
            if (svg) {
                const svgNode = svg.node();
                const currentDivNode = div.node();
                if (currentDivNode && svgNode && svgNode instanceof Node) {
                    if (currentDivNode.firstChild) {
                        currentDivNode.removeChild(currentDivNode.firstChild);
                    }

                    currentDivNode.appendChild(svgNode);
                }
            }
        }
    }, [svg, netWorkData]);

    //ComponentDidUpdate
    useEffect(() => {
        simulation.force('link')!!;
        simulation.alpha(1).restart();
    }, []);

    useEffect(() => {
        if (divRef.current) {
            const div = d3.select(divRef.current);
            const svgSelection = div.select<SVGSVGElement>('svg');
            if (!svgSelection.empty()) {
                applyStyle(
                    svgSelection as d3.Selection<
                        SVGSVGElement,
                        undefined,
                        null,
                        undefined
                    >
                );
            }
        }
    }, []);

    return (
        <>
            <div
                ref={divRef}
                style={{ width: width, height: height }}
                id="networkCanvas labelsContainer"
            ></div>
            <ShowsAcoloredNodeKey />
        </>
    );
};
