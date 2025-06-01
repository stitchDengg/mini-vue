import { isReactive, isReadonly, readonly } from "../src/reactive";

describe("readonly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);

    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
    expect(isReactive(wrapped)).toBe(false);
    expect(isReactive(original)).toBe(false);
  });

  it.skip("warn when call set", () => {
    // console.warn = jest.fn();
    // 这里会创建一个mock函数，用于监控console.warn的调用
    console.warn = jest.fn();

    const user = readonly({
      age: 10,
    });

    user.age = 11;

    expect(console.warn).toHaveBeenCalled();
  });
});
