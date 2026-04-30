import { useEffect, useState, useCallback } from "react";

/**
 * Generic hook for loading data with a fallback value.
 * If the API call fails (e.g. backend is offline in static-preview mode),
 * the hook returns `fallback` instead of throwing — the public site still works.
 */
export function useApiData<T>(
  loader: () => Promise<T>,
  fallback: T,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loader();
      setData(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setData(fallback);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
