import { useCallback, useEffect, useRef, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseAsyncResult<T> extends AsyncState<T> {
  refresh: () => Promise<void>
  setData: (next: T) => void
}

export const useAsync = <T,>(loader: () => Promise<T>, deps: unknown[] = []): UseAsyncResult<T> => {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const run = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await loader()
      if (!mounted.current) return
      setState({ data, loading: false, error: null })
    } catch (error) {
      if (!mounted.current) return
      setState({ data: null, loading: false, error: error as Error })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    void run()
  }, [run])

  const setData = useCallback((next: T) => {
    setState({ data: next, loading: false, error: null })
  }, [])

  return { ...state, refresh: run, setData }
}
