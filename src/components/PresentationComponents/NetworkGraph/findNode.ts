import { Nodes } from "@/share/InterfaceTypePastNetworks";

export function findNode(nodes: Nodes[], x: number, y: number, radius: number) {
    const rSq = radius * radius;
    for (let i = nodes?.length - 1; i >= 0; --i) {
        const node = nodes[i];
        if (node.x && node.y) {
            const dx = x - node.x,
                dy = y - node.y,
                distSq = dx * dx + dy * dy;
            if (distSq < rSq) {
                return node;
            }
        }
    }
    return undefined;
}

export function findNodeSvg(nodes: Nodes[], clickX: number, clickY: number, radius: number) {
    const rSq = radius * radius;
    const svg = document.getElementById("networkCanvas") as SVGSVGElement | null;
    if (svg) {
        const point = svg?.createSVGPoint();

        if (!point) return undefined;

        point.x = clickX;
        point.y = clickY;
        const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());

        for (let i = nodes?.length - 1; i >= 0; --i) {
            const node = nodes[i];
            if (node.x && node.y) {
                const dx = svgPoint.x - node.x,
                    dy = svgPoint.y - node.y,
                    distSq = dx * dx + dy * dy;
                if (distSq < rSq) {
                    return node;
                }
            }
        }
        return undefined;
    }

}