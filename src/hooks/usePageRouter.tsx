import { useLocation } from "react-router-dom";

export function usePageRouter() {
    const location = useLocation();

    const pathName = location.pathname

    const pathParts = location.pathname.split('/');

    const endpointPeopleDirect = `${pathParts[1]}/${pathParts[2]}`;
    const endpointPath = location.pathname.split('/').at(1);
    const endpointPathEstimate = location.pathname.split('/').at(2);
    const nodeTypeURL = location.pathname.split('/').at(-2);
    const voyageURLID = location.pathname.split('/').at(-1);
    const styleName = location.pathname.split('/').at(-1);
    const typeOfPathURL = location.pathname.split('/').at(-3);
    const blogURL = pathParts[3]
    const hash = location.hash;
    const currentBlockName = hash ? hash.slice(1) : '';

    return {
        styleName, typeOfPathURL,
        currentBlockName,
        nodeTypeURL, blogURL,
        voyageURLID, endpointPath, endpointPathEstimate, endpointPeopleDirect, pathName
    }
}