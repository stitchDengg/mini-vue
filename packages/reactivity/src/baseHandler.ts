import { track, trigger } from "./effect";

// 使用高阶函数的方式，创建getter和setter
function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      // 收集依赖
      track(target, key);
    } else {
      console.log(console.warn);
      // 只读的话，发出警告
      console.warn(`key:${key} set失败，target 是readonly的`, target);
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

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
};
