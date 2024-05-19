import { isReactive, reactive } from "../src/reactive";

describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    // 两个对象绝对不想等
    expect(observed).not.toBe(original);

    // 期望observed.foo等于1
    expect(observed.foo).toBe(1);

    // 判断这个对象是不是reactive对象
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });
});
