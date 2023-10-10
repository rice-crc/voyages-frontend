import { NodeAggroutes } from '@/share/InterfaceTypesMap';
import { getNodeSize } from './getNodeSize';

export const getNodeColorMapVoyagesStyle = (node: NodeAggroutes) => {

    const totalSize = getNodeSize(node);
    let nodeColor = `rgb(246,193,60)`;
    if (node) {
        if (totalSize) {
            const {
                disembarkation,
                embarkation,
                'post-disembarkation': postDisembarkation,
                origin,
            } = node.weights;

            const disembarkationPercent = disembarkation ? disembarkation / totalSize : undefined;
            const embarkationPercent = embarkation ? embarkation / totalSize : undefined;

            if (disembarkation !== 0 || embarkation !== 0) {
                const r = 255 * (embarkationPercent ?? 0);
                const g = 255 * 0;
                const b = 255 * (disembarkationPercent ?? 0)
                nodeColor = `rgb(${r}, ${g}, ${b})`;
            } else if (origin && origin > 0) {
                nodeColor = `rgb(96, 192, 171, 0.7)`;
            } else if (postDisembarkation && postDisembarkation > 0) {
                nodeColor = `rgb(246,193,60, 0.7)`;
            }
            return nodeColor;
        }

    }

    return nodeColor;
};
