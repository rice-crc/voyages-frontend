import { useEffect, useRef } from 'react';

type Effect = () => (() => void) | void;
type DestroyFunction = () => void;

export const useEffectFetchData = (effect: Effect): void => {
  const destroyFunc = useRef<DestroyFunction | null>(null);
  const calledOnce = useRef<boolean>(false);
  const renderAfterCalled = useRef<boolean>(false);

  if (calledOnce.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    calledOnce.current = true;
    const effectDestroy = effect();

    if (typeof effectDestroy === 'function') {
      destroyFunc.current = effectDestroy;
    }

    return () => {
      if (!renderAfterCalled.current) {
        return;
      }

      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};
