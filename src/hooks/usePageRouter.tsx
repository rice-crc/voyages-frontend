import { useLocation } from "react-router-dom";

export function usePageRouter() {
    const location = useLocation();

    const endpointPath = location.pathname.split('/').at(1);
    const endpointPathEstimate = location.pathname.split('/').at(2);
    const nodeTypeURL = location.pathname.split('/').at(-3);
    const voyageURLID = location.pathname.split('/').at(-2);
    const styleName = location.pathname.split('/').at(-1);
    const hash = location.hash;
    const currentBlockName = hash ? hash.slice(1) : '';
    const pathnameParts = location.pathname.split('/');
    const saveSearchID = pathnameParts[pathnameParts.length - 1];
    console.log({ saveSearchID })
    return {
        styleName,
        currentBlockName,
        nodeTypeURL,
        voyageURLID, endpointPath, endpointPathEstimate, saveSearchID
    }
}