import { extend } from "@mini-vue/shared/src";
// 存储当前的收集依赖的实例
let activeEffect;
let shouldTrack;

// 清除依赖
function cleanupEffect(effect) {
  effect.deps.filter((dep) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

class ReactiveEffect {
  /** 传入的函数 */
  private _fn: Function;
  /** 实例状态，调用stop后为false */
  private active = true;
  /** 对应的所有依赖 */
  public deps: any = [];
  /** 是否传入调度器参数 */
  public scheduler?: Function;
  /** 传入的停止函数 */
  public onStop?: Function;

  constructor(fn) {
    this._fn = fn;
  }

  // 执行函数依赖
  run() {
    // 会收集依赖
    if (!this.active) {
      this._fn();
    }

    // 这里处理保证只有在run的时候才去收集依赖 其他情况的get不收集 避免重复收集依赖
    shouldTrack = true;
    activeEffect = this;
    const result = this._fn();
    // reset
    shouldTrack = false;
    return result;
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

// 存储所有的依赖
const targetMap = new WeakMap();

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function track(target, key) {
  if (!isTracking()) return;
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

  // 已经在dep中了
  if (dep.has(activeEffect)) {
    return;
  }

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
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
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn);

  //extend
  extend(_effect, options);

  // 需要一上来直接调用
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

/**
 *
 * @param runner 需要去停止的函数
 */
export function stop(runner) {
  // 将这个函数从依赖中移除即可
  // !学习一下这个写法
  runner.effect.stop();
}
