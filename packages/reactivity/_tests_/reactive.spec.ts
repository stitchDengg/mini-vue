import { isReactive, isProxy, reactive } from "../src/reactive";
import { describe, expect, it } from "@jest/globals";
import { effect } from "../src/effect";
import { ReactiveFlags } from "../src/constant";

describe("reactive", () => {
  it("object ", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    // 两个对象绝对不想等
    expect(observed).not.toBe(original);
    expect(observed[ReactiveFlags.IS_REACTIVE]).toBe(true);

    // 期望observed.foo等于1
    expect(observed.foo).toBe(1);

    // 判断这个对象是不是reactive对象
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);

    // 判断一个对象是不是isProxy
    expect(isProxy(observed)).toBe(true);
    expect(isProxy(original)).toBe(false);
  });

  it("nested reactive", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };

    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
});
