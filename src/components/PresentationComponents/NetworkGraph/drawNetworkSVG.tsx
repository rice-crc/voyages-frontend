import { RADIUSNODE, classToColor } from '@/share/CONST_DATA';
import { Edges, Nodes, NodesID } from '@/share/InterfaceTypePastNetworks';
import {
    createStrokeColor,
    createdLableEdges,
    createdLableNodeHover,
} from '@/utils/functions/createdLableNode';

export const drawNetworkSVG = (
    svg: SVGSVGElement,
    nodes: Nodes[],
    edges: Edges[],
    newNode: Edges | Nodes | null,
) => {
    const svgNS = 'http://www.w3.org/2000/svg';
    // Clear existing SVG content
    svg.innerHTML = '';

    // Create group for edges
    const edgesGroup = document.createElementNS(svgNS, 'g');

    edges.forEach((link) => {
        const strokeColor = createStrokeColor(link);
        const labelEdge = createdLableEdges(link);

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
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', String(link.source.x));
            line.setAttribute('y1', String(link.source.y));
            line.setAttribute('x2', String(link.target.x));
            line.setAttribute('y2', String(link.target.y));
            line.setAttribute('stroke', strokeColor);
            line.setAttribute('stroke-width', '1.5');
            line.setAttribute('fill', 'none');

            const x1 = link.source.x;
            const y1 = link.source.y;
            const x2 = link.target.x;
            const y2 = link.target.y;

            const angle = Math.atan2(y2 - y1, x2 - x1);

            // Calculate the midpoint of the line
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            const text = document.createElementNS(svgNS, 'text');
            text.textContent = labelEdge;
            text.setAttribute('x', String(midX));
            text.setAttribute('y', String(midY));
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('alignment-baseline', 'middle');
            text.setAttribute('fill', '#fff');
            text.setAttribute('padding-bottom', '20px');
            text.setAttribute('font-size', '14px');
            text.setAttribute('font-family', 'Arial');
            text.setAttribute('font-weight', '600');
            text.setAttribute('transform', `rotate(${angle * (180 / Math.PI)}, ${midX}, ${midY})`);

            svg.appendChild(line);
            svg.appendChild(text);
        }
    });



    // Create group for nodes
    const nodesGroup = document.createElementNS(svgNS, 'g');
    svg.appendChild(nodesGroup);

    nodes.forEach((node) => {
        if (!node.x || !node.y) {
            return;
        }
        const fillColor = classToColor[node.node_class as keyof typeof classToColor] || 'gray';
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', String(node.x));
        circle.setAttribute('cy', String(node.y));
        circle.setAttribute('r', String(RADIUSNODE));
        circle.setAttribute('fill', fillColor);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '1.5');
        nodesGroup.appendChild(circle);
        circle.addEventListener('click', () => {
            console.log('click')
        });

        const text = document.createElementNS(svgNS, 'text');
        const labelNode = createdLableNodeHover(node);
        if (labelNode) {
            text.setAttribute('x', String(node.x + 13));
            text.setAttribute('y', String(node.y + 6));
            text.setAttribute('text-anchor', 'right');
            text.setAttribute('alignment-baseline', 'right');
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-size', '15px');
            text.setAttribute('font-family', 'Arial')
            text.setAttribute('font-weight', '500')
            text.textContent = String(labelNode);
            nodesGroup.appendChild(text);
        }
    });
};
