import { Edges } from "@/share/InterfaceTypePastNetworks";

export const checkTypeOfLinke = (link: Edges) => {
    if (
        link.source &&
        link.target &&
        typeof link.source !== 'string' &&
        typeof link.target !== 'string' &&
        typeof link.source.x === 'number' &&
        typeof link.source.y === 'number' &&
        typeof link.target.x === 'number' &&
        typeof link.target.y === 'number'
    )
        return true;
}