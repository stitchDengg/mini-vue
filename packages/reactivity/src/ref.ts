import { hasChanged, isObject } from "@mini-vue/shared/src";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private _rawValue: any;
  public dep: Set<any>;

  constructor(value: any) {
    // 如果value是一个普通的值，直接赋值
    // 如果value是一个对象，则需要将这个对象转换为响应式对象
    this._value = convertReactive(value);
    this._rawValue = value;
    this.dep = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }

  set value(newVal) {
    // 对比的时候 需要去处理reactive的值和原始对象的值 所以需要记录一下原始对象的值
    if (!hasChanged(newVal, this._rawValue)) {
      return;
    }
    // 一定是先去修改了value的值，然后再去通知所有的依赖
    this._rawValue = newVal;
    this._value = convertReactive(newVal);
    triggerEffects(this.dep);
  }
}

function trackRefValue(ref: RefImpl) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

// 如果value是一个对象，则需要将这个对象转换为响应式对象
function convertReactive(value: any) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value: any) {
  return new RefImpl(value);
}
