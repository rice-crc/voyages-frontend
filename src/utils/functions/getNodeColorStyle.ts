import { NodeAggroutes } from '@/share/InterfaceTypesMap';
import { getNodeSize } from './getNodeSize';

export const getNodeColorMapVoyagesStyle = (node: NodeAggroutes) => {
    const totalSize = getNodeSize(node);
    let nodeColor = `rgb(246,193,60)`;
    if (totalSize) {
        const {
            disembarkation,
            embarkation,
            'post-disembarkation': postDisembarkation,
            origin,
        } = node.weights;

        const disembarkationPercent = disembarkation! / totalSize;
        const embarkationPercent = embarkation! / totalSize;

        if (disembarkation !== 0 || embarkation !== 0) {
            const r = 255 * embarkationPercent;
            const g = 255 * 0;
            const b = 255 * disembarkationPercent;
            nodeColor = `rgb(${r}, ${g}, ${b})`;
        } else if (origin && origin > 0) {
            nodeColor = `rgb(96, 192, 171)`;
        } else if ((Number(postDisembarkation) && Number(postDisembarkation) > 0) && (disembarkation === 0 && embarkation === 0)) {
            nodeColor = `rgb(246,193,60)`;
        }
        return nodeColor;
    }
    return nodeColor;
};