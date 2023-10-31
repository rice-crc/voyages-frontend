import { useLocation } from "react-router-dom";

export function usePageRouter() {
    const location = useLocation();
    const styleName = location.pathname.split('/').at(-1);

    const hash = location.hash;
    const currentBlockName = hash ? hash.slice(1) : '';
    return {
        styleName,
        currentBlockName,
    }
}