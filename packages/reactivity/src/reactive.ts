import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandler";

export const ReactiveFlags = {
  IS_REACTIVE: "__v_isReactive",
  IS_READONLY: "__v_readonly",
};

function createReactiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}

export function isReactive(value) {
  // 两个感叹号，转换为布尔值
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}
