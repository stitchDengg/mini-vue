// 存
let activeEffect;

class ReactiveEffect {
  private _fn: Function;
  constructor(fn) {
    this._fn = fn;
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
    effect.run();
  });
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  // 需要一上来直接调用
  _effect.run();

  return _effect.run.bind(_effect);
}
