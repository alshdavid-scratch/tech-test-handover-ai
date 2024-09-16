import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

export type ProviderMap = Map<any, any>

export const AppContext = createContext<Map<any, any>>(new Map())

export function useAppContext(): Map<any, unknown> {
  return useContext(AppContext)
}

export function useInject<C extends new (...args: any[]) => any>(key: C): InstanceType<C>
export function useInject<T extends unknown>(key: any): T
export function useInject<T extends unknown>(key: any): T {
  const target = useContext(AppContext).get(key)
  if (!target) {
    throw new Error(`Nothing provided for key ${key}`)
  }

  return target
}
