/// This is a simple state management approach
/// that doesn't require any external libraries,
/// enables React to re-render when state updates
/// and is easily dependency injectable (good for testing)
///
/// I had a look for some off-the-shelf alternatives;
/// Mobx might work, libs like Immer could be helpful,
/// though this is fine enough for the purpose of the
/// demo

export class RxDb {
  collections: Map<string, Collection<any>>

  constructor() {
    this.collections = new Map()
  }

  createCollection<T>(name: string, initialState: any = {}): Collection<T> {
    if (this.collections.has(name)) {
      throw new Error('collection exists')
    }
    const col = new Collection(initialState)
    this.collections.set(name, col)
    return col
  }

  getCollection<T = unknown>(name: string): Collection<T> {
    const col = this.collections.get(name)
    if (!col) {
      throw new Error('collection does not created')
    }
    return col
  }
}

export class Collection<T> {
  #observers: Set<CollectionCallback>
  collection: T

  constructor(collection: T) {
    this.#observers = new Set()
    this.collection = collection
  }

  subscribe(cb: CollectionCallback): CollectionCallbackDispose {
    this.#observers.add(cb)
    return () => this.#observers.delete(cb)
  }

  update<R>(draftFn: (state: T) => Promise<R>): Promise<R>
  update<R>(draftFn: (state: T) => R): R 
  update<R>(draftFn: (state: T) => R | Promise<R>): R | Promise<R> {
    return (async () => {
      const result = await draftFn(this.collection)
      this.#observers.forEach(cb => cb())
      return result
    })()
  }

  get(): T {
    return this.collection
  }
}

export function mergeNotifications(...notifiers: Subscribable[]): Subscribable {
  return {
    subscribe(cb) {
      const subs: Array<CollectionCallbackDispose> = []
      for (const notifier of notifiers) {
        subs.push(notifier.subscribe(cb))
      }
      return () => subs.forEach(dispose => dispose())
    }
  }
}

export const OnChange = Symbol('Reactive')

export type CollectionCallback = () => any | Promise<any>
export type CollectionCallbackDispose = () => void
export interface Subscribable {
  subscribe(cb: CollectionCallback): CollectionCallbackDispose
}

export interface Notifiable {
  [OnChange]: Subscribable
}
