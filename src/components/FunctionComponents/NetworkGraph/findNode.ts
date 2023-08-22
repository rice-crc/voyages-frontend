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
