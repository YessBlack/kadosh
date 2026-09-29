// hooks/useFetch.ts
import { useEffect, useState } from 'react'

interface Result<T, A> {
  fetcher: (arg: A) => Promise<T>
  arg: A | undefined
  version: number
  data: T | null
  error: unknown
}

export const useFetch = <T, A = void>(
  fetcher: (arg: A) => Promise<T>,
  arg?: A
) => {
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState<Result<T, A> | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const data = await fetcher(arg as A)
        if (!cancelled) setResult({ fetcher, arg, version, data, error: null })
      } catch (error: unknown) {
        if (!cancelled) setResult({ fetcher, arg, version, data: null, error })
      }
    }

    void load()

    return () => { cancelled = true }
  }, [fetcher, arg, version])

  const isCurrent =
    result !== null &&
    result.fetcher === fetcher &&
    result.arg === arg &&
    result.version === version

  return {
    data: result?.data ?? null,
    error: isCurrent ? result.error : null,
    isLoading: !isCurrent,
    setData: (data: T) => setResult((prev) => (prev ? { ...prev, data } : prev)),
    refetch: () => setVersion((v) => v + 1)
  }
}
