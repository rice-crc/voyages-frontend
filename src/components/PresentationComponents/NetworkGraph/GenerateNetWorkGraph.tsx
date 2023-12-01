
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
type NetworkDiagramProps = {
    width: number;
    height: number;
};
const GenerateNetWorkGraph = ({
    width,
    height,
}: NetworkDiagramProps) => {

    const svgRef = useRef<SVGSVGElement | null>(null);


    let graph: { nodes: any[]; links: any[] } = {
        nodes: [
            {
                "id": 0,
                "color": 6,
                "size": 3,
                "x": 404.5732128048076,
                "y": 533.3774916723304,
                "index": 0,
                "vy": -0.00031899668106128326,
                "vx": -0.00009456901885783005
            },
            {
                "id": 1,
                "color": 2,
                "size": 11,
                "x": 481.45780130928455,
                "y": 536.4802779446151,
                "index": 1,
                "vy": -0.00011265476055029822,
                "vx": -0.00004150624341145159
            },
            {
                "id": 2,
                "color": 4,
                "size": 7,
                "x": 447.89401079860403,
                "y": 450.3140558301123,
                "index": 2,
                "vy": -0.0001800177007508254,
                "vx": -0.00034762160387136323
            },
            {
                "id": 3,
                "color": 8,
                "size": 6,
                "x": 527.6823865865038,
                "y": 393.7029158892473,
                "index": 3,
                "vy": -0.00035034038230242516,
                "vx": -0.00022642078258150762
            },
            {
                "id": 4,
                "color": 4,
                "size": 2,
                "x": 553.8592430407653,
                "y": 472.4044005426178,
                "index": 4,
                "vy": -0.00007082942608344963,
                "vx": -0.00006268463794411169
            },
            {
                "id": 5,
                "color": 9,
                "size": 10,
                "x": 390.0107906574976,
                "y": 395.1320490835254,
                "index": 5,
                "vy": -0.0002531425758273917,
                "vx": -0.0000475580356266843
            }
        ], links: [
            {
                "source": {
                    "id": 0,
                    "color": 6,
                    "size": 3,
                    "x": 404.5732128048076,
                    "y": 533.3774916723304,
                    "index": 0,
                    "vy": -0.00031899668106128326,
                    "vx": -0.00009456901885783005
                },
                "target": {
                    "id": 2,
                    "color": 4,
                    "size": 7,
                    "x": 447.89401079860403,
                    "y": 450.3140558301123,
                    "index": 2,
                    "vy": -0.0001800177007508254,
                    "vx": -0.00034762160387136323
                },
                "index": 0
            },
            {
                "source": {
                    "id": 0,
                    "color": 6,
                    "size": 3,
                    "x": 404.5732128048076,
                    "y": 533.3774916723304,
                    "index": 0,
                    "vy": -0.00031899668106128326,
                    "vx": -0.00009456901885783005
                },
                "target": {
                    "id": 1,
                    "color": 2,
                    "size": 11,
                    "x": 481.45780130928455,
                    "y": 536.4802779446151,
                    "index": 1,
                    "vy": -0.00011265476055029822,
                    "vx": -0.00004150624341145159
                },
                "index": 1
            }
        ]
    };

    const randomizeData = () => {
        let n = Math.floor(Math.random() * 10) + 6;

        let newNodes = [];
        for (let i = 0; i < n; i++) {
            if (graph.nodes[i]) newNodes.push(graph.nodes[i]);
            else
                newNodes.push({
                    id: i,
                    color: Math.floor(Math.random() * 10),
                    size: Math.floor(Math.random() * 10 + 2),
                    x: Math.random() * width,
                    y: Math.random() * height,
                });
        }

        let newLinks = [];
        let m = Math.floor(Math.random() * n) + 1;
        for (let i = 0; i < m; i++) {
            let a = 0;
            let b = 0;
            while (a === b) {
                a = Math.floor(Math.random() * n);
                b = Math.floor(Math.random() * n);
            }
            newLinks.push({ source: a, target: b });
            if (i < newNodes.length - 2) newLinks.push({ source: i, target: i + 1 });
        }

        graph = { nodes: newNodes, links: newLinks };
        console.log({ graph })
        update();
    };

    useEffect(() => {
        randomizeData();
    }, []);

    let links: d3.Selection<SVGLineElement, any, SVGGElement, unknown>;
    let nodes: d3.Selection<SVGGElement, any, SVGGElement, unknown>;

    const update = () => {
        if (svgRef.current) {
            const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);


            nodes = svg.selectAll<SVGGElement, unknown>('g').data(graph.nodes as any[]);

            nodes.exit().remove();

            const newNodes = nodes.enter().append('g').attr('opacity', 0);

            newNodes
                .transition()
                .attr('opacity', 1)
                .attr('class', 'nodes')
                .attr('r', (d: any) => (d.size * 2) + 1)
                .attr('fill', (d: any) => d3.schemeCategory10[d.color]);

            newNodes
                .append('text')
                .text((d: any) => 'Node')
                .attr('x', 15)
                .attr('y', 10)
                .style('font-size', '20px')
                .attr('fill', '#fff')

            newNodes.append('title').text((d: any) => d.id);

            nodes = newNodes.merge(nodes);
            nodes.append('circle')
                .attr('r', (d: any) => (d.size * 2) + 1)
                .attr('fill', (d: any) => d3.schemeCategory10[d.color]);

            links = svg.selectAll<SVGLineElement, unknown>('line').data(graph.links as any[]);

            links.exit().remove();

            const newLinks = links.enter().append('line').attr('stroke-width', (d: any) => Math.sqrt(d.value));

            newLinks.attr('opacity', 0).transition().attr('opacity', 1);

            links = newLinks.merge(links);

            const simulation = d3.forceSimulation(graph.nodes);

            simulation.force(
                'link',
                d3.forceLink(graph.links).id((d: any) => d.id).strength(0.004)
            );

            simulation.force('charge', d3.forceManyBody());
            simulation.force('x', d3.forceX(width / 2).strength(0.01));
            simulation.force('y', d3.forceY(height / 2).strength(0.01));

            simulation.on('tick', ticked);
            simulation.alpha(1).restart();
        }

    };

    const ticked = () => {
        links
            .attr('x1', (d: any) => d.source.x)
            .attr('y1', (d: any) => d.source.y)
            .attr('x2', (d: any) => d.target.x)
            .attr('y2', (d: any) => d.target.y);

        nodes.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    };

    return (
        <div>
            <button onClick={randomizeData}>Update</button>
            <svg ref={svgRef} width={width} height={height}></svg>
            <style>
                {`
        .links line {
          stroke: #999;
          stroke-opacity: 0.6;
        }
        .nodes circle {
          stroke: #fff;
          stroke-width: 1.5px;
        }
      `}
            </style>
        </div>
    );
};

export default GenerateNetWorkGraph;
