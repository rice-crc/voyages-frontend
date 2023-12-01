import { useCallback, useRef } from 'react';

type ClickCallback = (event: MouseEvent) => void;

export const useDoubleClick = (doubleClick: ClickCallback, click: ClickCallback, timeout = 200) => {
    const clickTimeout = useRef<NodeJS.Timeout | undefined>();

    const clearClickTimeout = () => {
        if (clickTimeout.current !== undefined) {
            clearTimeout(clickTimeout.current);
            clickTimeout.current = undefined;
        }
    };

    return useCallback((event: MouseEvent) => {

        clearClickTimeout();
        if (click && event.detail === 1) {
            clickTimeout.current = setTimeout(() => {
                click(event);
            }, timeout);
        }
        if (event.detail % 2 === 0) {
            doubleClick(event);
        }
    }, [click, doubleClick, timeout]);
};
