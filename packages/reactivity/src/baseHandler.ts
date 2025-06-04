import { extend, isObject } from "@mini-vue/shared/src";
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);
const shallowReadonlyGet = createGetter(true, true);

// 使用高阶函数的方式，创建getter和setter
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);

    if (shallow) {
      return res;
    }

    // 这里处理嵌套的情况
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
      // 收集依赖
      track(target, key);
    }

    return res;
  };
}

function createSetter(isReadonly = false) {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    if (!isReadonly) {
      // 触发所有依赖
      trigger(target, key);
    }
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
