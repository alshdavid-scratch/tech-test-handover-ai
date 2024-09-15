// This is a rip off of mobx that's slightly nicer to use

export type kind = typeof kind[keyof typeof kind];
export const kind = Object.freeze({
  array: Symbol('array'),
  object: Symbol('object'),
  map: Symbol('map'),
  set: Symbol('set'),
  value: Symbol('value'),
})

const Observe = Symbol('Observe')

export function makeObservable(target: any, properties: Record<string | number | symbol, kind>) {
  const inner: Record<string | number | symbol, any> = {}
  const observer = new EventTarget

  let emitting = false
  let queue: string[][] = []
  function emit(...keys: string[][]) {
    if (emitting === true) {
      queue.push(...keys)
      return
    }
    emitting = true
    
    observer.dispatchEvent(new CustomEvent('change', { detail: keys }))

    setTimeout(() => {
      emitting = false
      if (queue.length) {
        const q = queue
        queue = []
        emit(...q)
      }
    }, 10)
  }

  Object.defineProperty(target, Observe, {
    value: observer
  })

  for (const [key, k] of Object.entries(properties)) {
    inner[key] = target[key]
    
    if (k === kind.value) {
      Object.defineProperty(target, key, {
        get() {
          return inner[key]
        },
        set(value: any) {
          inner[key] = value
          emit([key, k as any])
        },
      })
    }
    else if (k === kind.array || k === kind.object) {
      inner[key] = buildProxy(target[key], (keys: any) => emit(keys))

      Object.defineProperty(target, key, {
        get() {
          return inner[key]
        },
        set(value: any) {
          inner[key] = buildProxy(value, (keys: any) => emit(keys))
          emit([key])
        },
      })      
    }
  }
}

function buildProxy(poj: any, callback: any, tree: any = []) {
  return new Proxy(poj, {
    get: (target, prop)  =>{
      const value = Reflect.get(target, prop);

      if (
        value &&
        typeof value === "object" &&
        ["Array", "Object"].includes(value.constructor.name)
      )
        return buildProxy(value, callback, tree.concat(prop));

      return value;
    },

    set: (target, prop, value) => {
      callback(tree.concat(prop));
      return Reflect.set(target, prop, value);
    },

    deleteProperty: (target, prop) => {
      callback(tree.concat(prop));
      return Reflect.deleteProperty(target, prop);
    },
  });
}

export function subscribe(target: any, callback: (key: string) => any | Promise<any>): () => void {
  const fn = ({ detail }: CustomEvent) => callback(detail)
  target[Observe].addEventListener('change', fn)
  return () => target[Observe].removeEventListener('change', fn)
}
