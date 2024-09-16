import { Window, Document, MutationObserver, MutationRecord, Element } from 'happy-dom';

export type DisposeFn = () => void

export class BrowserPage {
  #html: string
  #windowRef: Window | undefined
  #observer: MutationObserver | undefined
  #observers: Set<(value: MutationRecord[]) => any | Promise<any>>

  get window(): Window {
    return this.#windowRef!
  }

  get document(): Document {
    return this.#windowRef!.document
  }

  constructor(html: string = DEFAULT_DOM) {
    this.#html = html
    this.#observers = new Set()
  }

  onChange(callback: (value: MutationRecord[]) => any | Promise<any>): DisposeFn {
    this.#observers.add(callback)
    return () => this.#observers.delete(callback)
  }

  async exec() {
    this.#windowRef = new Window({
      innerWidth: 1024,
      innerHeight: 768,
      url: 'http://localhost:8080'
    });

    const document = this.#windowRef.document;
    
    document.write(this.#html);
    await this.#windowRef.happyDOM.waitUntilComplete();

    this.#observer = new this.#windowRef.MutationObserver((ev) => {
      this.#observers.forEach(cb => cb(ev))
    })

    this.#observer.observe(document.body, { 
      attributes: true,
      childList: true,
      subtree: true 
    })
  }

  async wait() {
    await this.#windowRef?.happyDOM.waitUntilComplete();
  }

  async waitForSelector(selector: string, timeout: number = 1000): Promise<Array<Element> | null> {
    let timeoutId: NodeJS.Timeout | undefined
    let dispose: undefined | DisposeFn = undefined

    const result = await Promise.race([
      new Promise<null>(res => {
        timeoutId = setTimeout(() => {
          timeoutId = undefined
          res(null)
        }, timeout)
      }),
      new Promise<Array<Element>>(res => {
        dispose = this.onChange(() => {
          const r = this.document.querySelectorAll(selector)
          if (r && r.length) {
            res(Array.from(r))
          }
        })
      })
    ])

    // @ts-expect-error
    if (dispose !== undefined) dispose()
    if (timeoutId) clearTimeout(timeoutId)

    return result
  }

  async eval(script: string) {
    this.#windowRef?.eval(script)
    await this.#windowRef?.happyDOM.waitUntilComplete();
  }

  async evalFunction(fn: () => any | Promise<any>) {
    await this.eval(fn.toString())
  }

  async close() {
    this.#observer?.disconnect()
    this.#windowRef?.close()
  }

  async [Symbol.asyncDispose]() {
    if (!this.#windowRef) {
      return
    }
    await this.#windowRef.happyDOM.close();
  }

  async [Symbol.dispose]() {
    if (!this.#windowRef) {
      return
    }
    await this.#windowRef.happyDOM.close();
  }
}

const DEFAULT_DOM = `
  <!doctype html>
  <html lang="en">
    <head>
      <title>Virtual DOM</title>
    </head>
    <body>
    </body>
  </html>
`