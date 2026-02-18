import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiResult<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = []
): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchFn();
      if (isMounted.current) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (err) {
      if (isMounted.current) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "An error occurred",
        });
      }
    }
  }, [fetchFn]);

  useEffect(() => {
    isMounted.current = true;
    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, deps);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Hook for paginated data
interface UsePaginatedApiResult<T> extends UseApiState<T[]> {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  refetch: () => Promise<void>;
}

export function usePaginatedApi<T>(
  fetchFn: (page: number) => Promise<T[]>,
  pageSize: number = 20
): UsePaginatedApiResult<T> {
  const [state, setState] = useState<UseApiState<T[]>>({
    data: [],
    loading: true,
    error: null,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isMounted = useRef(true);

  const fetchData = useCallback(
    async (pageNum: number, isRefresh: boolean = false) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await fetchFn(pageNum);
        if (isMounted.current) {
          setState((prev) => ({
            data: isRefresh ? result : [...(prev.data || []), ...result],
            loading: false,
            error: null,
          }));
          setHasMore(result.length >= pageSize);
        }
      } catch (err) {
        if (isMounted.current) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "An error occurred",
          }));
        }
      }
    },
    [fetchFn, pageSize]
  );

  useEffect(() => {
    isMounted.current = true;
    fetchData(1, true);

    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadMore = async () => {
    if (!state.loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchData(nextPage);
    }
  };

  const refetch = async () => {
    setPage(1);
    await fetchData(1, true);
  };

  return {
    ...state,
    loadMore,
    hasMore,
    refetch,
  };
}

// Hook for interval-based data refresh
export function usePolling<T>(
  fetchFn: () => Promise<T>,
  interval: number,
  enabled: boolean = true
): UseApiResult<T> {
  const result = useApi(fetchFn, []);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (enabled && interval > 0) {
      intervalRef.current = setInterval(() => {
        result.refetch();
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, interval]);

  return result;
}
