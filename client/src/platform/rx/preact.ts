import { useEffect, useMemo, useReducer } from "preact/hooks";
import { subscribe } from "./index.ts";

export function useObservable<T, A extends Array<any>>(ctor: new (...args: A) => T, args: A): T
export function useObservable<T>(ctor: new () => T): T
export function useObservable<T, A extends Array<any>>(ctor: new (...args: A) => T, args?: A): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void

  const o = useMemo(() => new ctor(...(args || []) as any), [])

  useEffect(() => {
    const dispose = subscribe(o, (v) => {
      forceUpdate()
    })
    return () => dispose()
  }, [])

  return o
}

export function useViewModel<T>(ctor: () => T): T {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void

  const o: any = useMemo(ctor, [])

  useEffect(() => {
    const dispose = subscribe(o, (v) => {
      forceUpdate()
    })
    o?.onInit()
    return () => dispose()
  }, [])

  return o
}