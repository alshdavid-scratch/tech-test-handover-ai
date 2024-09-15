import { useState } from "preact/hooks"

export type InputHookResult = {
  value: string, 
  onInput: (e: any) => any
  onKeyDown?: (e: any) => any
  reset: () => any
  triggerEnter: () => any
}

export type UseInputOptions = {
  onEnter?: (value: string) => any
  initialValue: string,
}

export function useInput(options: UseInputOptions): InputHookResult {
  const [i, setI] = useState(options.initialValue)

  const props: InputHookResult = {
    value: i, 
    onInput: (e: any) => setI(e.target.value),
    reset: () => setI(''),
    triggerEnter: () => options.onEnter?.(i)
  }

  if (options.onEnter) {
    props.onKeyDown = (e) => {
      if (e.key === 'Enter') {
        options.onEnter!(e.target.value)
      }
    }
  }

  return props
}
