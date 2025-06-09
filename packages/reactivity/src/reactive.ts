import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandler";
import { ReactiveFlags } from "./constant";

function createReactiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}

export function isReactive(value: any) {
  // 两个感叹号，转换为布尔值
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value: any) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value: any) {
  return value ? !!value[ReactiveFlags.RAW] : false;
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}
