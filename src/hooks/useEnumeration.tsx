import { useEffect, useState } from 'react';
import { MaterializedEntity } from '@dotproductdev/voyages-contribute';
import { fetchEnumeration } from '@/fetch/contributeFetch/fetchEnumeration';

interface CachedEnumeration {
  timestamp: number;
  items: MaterializedEntity[];
}

// Note: this could be placed in a React context if for some reason the
// cached enumerations should not be shared across all components.
const cache: Record<string, CachedEnumeration> = {};

interface UseEnumerationOptions {
  expirationSeconds?: number;
  forceRefresh?: boolean;
}

export const useEnumeration = (schema: string, options?: UseEnumerationOptions) => {
  const [items, setItems] = useState<MaterializedEntity[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let expirationTimer: number;

    const load = async () => {
      const now = new Date().getTime();
      const cached = cache[schema];
      const expired =
        cached && options?.expirationSeconds
          ? now - cached.timestamp > options.expirationSeconds * 1000
          : false;

      if (cached && !expired && !options?.forceRefresh) {
        setItems(cached.items);
        return;
      }

      try {
        const items = await fetchEnumeration(schema);
        cache[schema] = {
          timestamp: now,
          items,
        };
        setError(undefined);
        setItems(items);

        // Set timer to clear cache automatically after expiration time
        if (options?.expirationSeconds) {
          expirationTimer = window.setTimeout(() => {
            delete cache[schema];
          }, options.expirationSeconds * 1000);
        }
      } catch (err) {
        setItems([]);
        setError(err as Error);
      }
    };

    load();

    return () => {
      if (expirationTimer) {
        clearTimeout(expirationTimer);
      }
    };
  }, [schema, options?.expirationSeconds, options?.forceRefresh]);

  return { error, items };
};
