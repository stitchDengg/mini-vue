import { isReactive, isReadonly, readonly } from "../src/reactive";

describe("readonly", () => {
  it("should make nested values readonly", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);

    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
    expect(isReactive(wrapped)).toBe(false);
    expect(isReactive(original)).toBe(false);
    expect(isReactive(wrapped.bar)).toBe(false);
    expect(isReadonly(wrapped.bar)).toBe(true);
    expect(isReactive(original.bar)).toBe(false);
    expect(isReadonly(original.bar)).toBe(false);
  });
});
