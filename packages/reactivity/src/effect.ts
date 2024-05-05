// 存
let activeEffect;

class ReactiveEffect {
  private _fn: Function;
  public scheduler?: Function;
  constructor(fn, scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}

// 存储所有的依赖
const targetMap = new WeakMap();

export function track(target, key) {
  // target => key => dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (!dep) return;
  dep.forEach((effect) => {
    if (effect.scheduler) {
      // 如果有这个参数就执行scheduler
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}

/**
 *
 * @param fn 传入需要收集依赖的函数
 * @param option 传入其他参数
 * @returns 返回一个函数runner，调用这个函数会执行fn
 */
export function effect(fn, options?) {
  const { scheduler } = options || {};
  const _effect = new ReactiveEffect(fn, scheduler);
  // 需要一上来直接调用
  _effect.run();

  return _effect.run.bind(_effect);
}
