import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter: any;
  private _dirty: boolean = true;
  private _value: any;
  private _effect: ReactiveEffect;

  constructor(getter: any) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    // get
    // 这个锁只有当依赖的响应式数据发生变化的时候才会打开
    //
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }

    return this._value; // 缓存
  }
}

export function computed(getter: any) {
  return new ComputedRefImpl(getter);
}
