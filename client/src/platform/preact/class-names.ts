import { h } from "preact"

export const classNames = (input: Record<string, boolean | undefined>, ...extending: Array<string | undefined | h.JSX.SignalLike<string | undefined>>): string => {
  let className = ''
  for (const [item, enabled] of Object.entries(input)) {
    if (!enabled) continue
    className += ` ${item}`
  }

  for (const e of extending) {
    if (typeof e === 'string') {
      className += ` ${e}`
    }
  }

  return className
}