# 响应式流程

## 1.1 reactive方法

reactive方法主要起的作用是把一个对象包装成响应式对象，做的主要工作有：

1. 把一个对象包裹成响应式对象 通过Proxy和Relfex方法去拦截get和set
2. 其中get方法的时候会通过track方法收集依赖 set方法会通过trigger方法触发收集的所有依赖，每一个key都算一个依赖，所以同一个对象可能有多个依赖

核心代码如下

``` javascript
  function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      if (key === ReactiveFlags.IS_REACTIVE) {
        return !isReadonly;
      }
      // 收集依赖
      track(target, key);
    } else {
      if (key === ReactiveFlags.IS_READONLY) {
        return true;
      }
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
```

## 1.2 effect方法

effect方法也是响应式的核心，这里主要主要注意点如下

1. effect方法首先会执行一次，也就是如果这个时候有依赖的响应式对象，会触发一次get收集依赖
2. 注意stop的使用，这里非常巧妙的用runnner方法存储了当前effect实例，所以stop方法可以清除当前effect收集的所有deps
3. 这里stop方法清除以后，如果使用 varible ++ 的形式还是会触发， 需要进行优化 ，这里的逻辑是只有在run的时候才会收集依赖，其他情况下不收集依赖。

核心代码如下

``` typescript
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

```
