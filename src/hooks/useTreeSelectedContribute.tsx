import { useEffect, useState } from 'react';
import { fetchTreeSelectedContributeLocation } from "@/fetch/contributeFetch/fetchTreeSelectedContributeLocation";
import {  ContribuitLocation } from "@/share/InterfaceTypes";

interface CachedGeoTreeResult {
  timestamp: number;
  items: ContribuitLocation[];
}

interface UseGeoTreeOptions {
  expirationSeconds?: number;
  forceRefresh?: boolean;
}

const geoTreeCache: Record<string, CachedGeoTreeResult> = {};

export const useTreeSelectedContributeLocation = (
  schema: string,
  options?: UseGeoTreeOptions
) => {
  const [locationsList, setLocationsList] = useState<ContribuitLocation[]>([]);
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {

    let expirationTimer: number;
    const key = `${schema}}`;
    const now = Date.now();
    const cached = geoTreeCache[key];

    const expired =
      cached && options?.expirationSeconds
        ? now - cached.timestamp > options.expirationSeconds * 1000
        : false;

    const shouldUseCache = cached && !expired && !options?.forceRefresh;

    const load = async () => {
      if (shouldUseCache) {
        setLocationsList(cached.items);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchTreeSelectedContributeLocation();
        geoTreeCache[key] = {
          timestamp: now,
          items: response,
        };
        setLocationsList(response);
        setError(undefined);

        if (options?.expirationSeconds) {
          expirationTimer = window.setTimeout(() => {
            delete geoTreeCache[key];
          }, options.expirationSeconds * 1000);
        }
      } catch (err) {
        setLocationsList([]);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      if (expirationTimer) {
        clearTimeout(expirationTimer);
      }
    };
  }, [
    schema,
    options?.expirationSeconds,
    options?.forceRefresh,
  ]);

  return { locationsList, loading, error };
};
