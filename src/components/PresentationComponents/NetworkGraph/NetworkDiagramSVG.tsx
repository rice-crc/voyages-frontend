import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { Datas, Edges, Nodes } from '@/share/InterfaceTypePastNetworks';
import { findNode, findNodeSvg } from './findNode';
import { RADIUSNODE } from '@/share/CONST_DATA';
import { findHoveredEdge } from './findHoveredEdge';
import ShowsAcoloredNodeKey from './ShowsAcoloredNodeKey';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { drawNetworkSVG } from './drawNetworkSVG';
import { drawNetwork } from './drawNetwork';

type NetworkDiagramProps = {
    width: number;
    height: number;
    netWorkData: Datas;
    newUpdateNetWorkData: Datas;
    handleNodeDoubleClick: (nodeId: number, nodeClass: string) => Promise<void>;
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
    // changedNetWorkData
}: NetworkDiagramProps) => {

    const dispatch: AppDispatch = useDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
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

        const svg = d3.select(svgRef.current);
        const svgWidth = +svg.attr("width")
        const svgHeight = +svg.attr("height");
        // elements for data join
        const link = svg.append("g").selectAll(".link");
        const node = svg.append("g").selectAll(".node");

        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!svg) {
            return;
        }

        const svgElement = svg.node() as SVGSVGElement;
        svg.on('mousemove', checkMouseoverNode);
        svg.on('mousemove', checkMouseoverEdges);

        const handleDoubleClick = (event: MouseEvent) => {
            if (!canvas || !context) {
                return;
            }
            const x = event.clientX - canvas.getBoundingClientRect().left;
            const y = event.clientY - canvas.getBoundingClientRect().top;
            const node = findNode(nodes, x, y, RADIUSNODE);

            if (node) {
                handleNodeDoubleClick(node.id, node.node_class);
                // updateCanvas(context, nodes, validEdges);
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
                drawNetworkSVG(svgElement, nodes, edges, null);
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
                    // drawNetwork(context, width, height, nodes, validEdges, newNode);
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
                    drawNetworkSVG(svgElement, nodes, validEdges, newEdge);
                } else {
                    canvas.style.cursor = 'default';
                }
            }
        }


        function dragSubject(
            event: d3.D3DragEvent<SVGSVGElement, any, any>
        ): Nodes | undefined {
            const [x, y] = d3.pointer(event);
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

        const dragBehavior = d3.drag<SVGSVGElement, Nodes | undefined, unknown>();



        dragBehavior
            .subject(dragSubject)
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded);

        if (svgRef.current) {
            svg.call(dragBehavior as any);
        }

        const svgGroup = svg.select<SVGGElement>('g');

        const handleZoom = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
            // console.log('handleZoom')
            const { transform } = event;
            svgGroup.attr('transform', transform as any);
            drawNetworkSVG(svgElement, nodes, validEdges, null);
        };

        const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1 / 10, 8])
            .on('zoom', handleZoom);

        svg.call(zoomBehavior as any);

        // svg.on('wheel', function (event) {
        //     event.preventDefault();

        //     const container = svg.node()!.getBoundingClientRect();
        //     const center = { x: container.width / 2, y: container.height / 2 };
        //     const mousePosition = { x: event.offsetX - center.x, y: event.offsetY - center.y };

        //     const scaleChange = event.deltaY > 0 ? 1.2 : 0.8; // Scale factor
        //     const newScale = d3.zoomTransform(this).k * scaleChange;

        //     const newTransform = d3.zoomIdentity
        //         .translate(center.x, center.y)
        //         .scale(scaleChange)
        //         .translate(-mousePosition.x * scaleChange, -mousePosition.y * scaleChange);

        //     svg.transition().duration(300).call(zoomBehavior.transform, newTransform);
        // });
        const clearClickTimeout = () => {
            if (clickTimeout.current !== undefined) {
                clearTimeout(clickTimeout.current);
                clickTimeout.current = undefined;
            }
        };
        // Assuming nodes is an array of node objects with x, y, and radius properties
        // const zoomHandler = d3.zoom<SVGSVGElement, unknown>()
        //     .extent([[0, 0], [width, height]])
        //     .scaleExtent([1, 8])
        //     .on('zoom', zoomed);

        // svg.call(zoomHandler as any);

        // function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
        //     const { transform } = event;
        //     svg.select('g').attr('transform', transform as any);
        // }
        // svg.on('click', (event: MouseEvent) => {

        //     const canvas = svgRef.current; // Reference to the SVG element
        //     if (!canvas) {
        //         return;
        //     }
        //     const rect = canvas.getBoundingClientRect(); // Get the bounding rectangle of the SVG
        //     console.log({ rect })
        //     const x = event.clientX - rect.left;
        //     const y = event.clientY - rect.top;

        //     // Find the node clicked using your findNode function (replace RADIUSNODE with the appropriate radius value)
        //     const node = findNodeSvg(nodes, x, y, RADIUSNODE);
        //     console.log("node", node)
        //     if (node) {
        //         handleClickNodeShowCard(node.id, node.node_class);
        //     }
        // });

        return () => {
            // Clean up event listeners or resources if needed
            svg.on('mousemove', null);
            svg.on('click', null);
            dragBehavior.on('start', null).on('drag', null).on('end', null);
        };


    }, [dispatch, width, height, edges, nodes]);



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
