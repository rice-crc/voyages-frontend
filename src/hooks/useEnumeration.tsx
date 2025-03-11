import { MaterializedEntity } from '@/models/materialization';
import { useEffect, useState } from 'react';

const host = 'http://localhost:7127';

interface CachedEnumeration {
  timestamp: number;
  items: MaterializedEntity[];
}

// Note: this could be placed in a React context if for some reason the
// cached enumerations should not be shared across all components.
const cache: Record<string, CachedEnumeration> = {};

export const useEnumeration = (schema: string, expiration?: number) => {
  const [items, setItems] = useState<MaterializedEntity[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);
  useEffect(() => {
    const load = async () => {
      if (cache[schema]) {
        setItems(cache[schema].items);
        return;
      }
      const uri = `${host}/enumerate/${schema}`;
      try {
        const res = await fetch(uri);
        const items = await res.json();
        cache[schema] = {
          timestamp: new Date().getTime(),
          items,
        };
        setError(undefined);
        setItems(items);
      } catch (err) {
        setItems([]);
        setError(err as Error);
      }
    };
    load();
    const expirationTimer = window.setTimeout(() => {
      delete cache[schema];
      load();
    }, (expiration ?? 3600) * 1000);
    return () => window.clearTimeout(expirationTimer);
  }, [expiration, schema]);
  return { error, items };
};
