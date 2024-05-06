import { mutableHandlers, readonlyHandlers } from "./baseHandler";

function createReactiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}
