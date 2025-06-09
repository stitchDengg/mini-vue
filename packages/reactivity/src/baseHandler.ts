import { extend, isObject } from "@mini-vue/shared/src";
import { track, trigger } from "./effect";
import { reactive, readonly } from "./reactive";
import { ReactiveFlags } from "./constant";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

// 使用高阶函数的方式，创建getter和setter
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    // 这里处理isReactive和isReadonly的逻辑
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (key === ReactiveFlags.RAW) {
      return target;
    }

    const res = Reflect.get(target, key);

    if (shallow) {
      return res;
    }

    if (!isReadonly) {
      // 收集依赖
      track(target, key);
    }

    // 这里处理嵌套的情况
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
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
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
