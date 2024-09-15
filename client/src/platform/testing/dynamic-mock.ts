import { mock, Mock } from 'node:test'

export type MatcherFn<T> = (actualValue: T) => boolean;

export interface CalledWithMock<T, Y extends Array<any>> extends Mock<(...args: Y) => T> {
  calledWith:  Mock<(...args: Y) => T>;
}

export type MockedInterface<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer B
    ? CalledWithMock<B, A> & T[K]
    : MockedInterface<T[K]> & T[K];
};

export const mockInterface = <T>(initialValue: any = {}): MockedInterface<T> => {
  const source: any = {
    toString: mock.fn(),
    ...initialValue,
  };
  const proxy: any = new Proxy(source as any, {
    get(target, prop: any) {
      if (!target.hasOwnProperty(prop)) {
        target[prop] = mock.fn();
      }
      return target[prop];
    },
    set(target, prop: string, value: any) {
      target[prop] = value;
      return true;
    },
  });
  return proxy;
};

export const initProperty = (target: any, prop: string | number | symbol) => {
  target[prop] = undefined;
};
