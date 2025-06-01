import { isReactive, reactive } from "../src/reactive";
import { describe, expect, it } from "@jest/globals";
import { ReactiveFlags } from "../src/reactive";

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
  });
});
