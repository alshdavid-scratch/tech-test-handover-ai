import './spinner.scss'
import { h } from "preact";

export type SpinnerProps = h.JSX.HTMLAttributes<HTMLDivElement> & {}

export function Spinner({ children, ...props }: SpinnerProps) {
  return <div className="component-spinner" {...props}>
    <div className="loader"></div>
    {children && <div className="text">{children}</div>}
  </div>
}