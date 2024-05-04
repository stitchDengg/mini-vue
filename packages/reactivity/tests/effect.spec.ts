import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner when call effect", () => {
    // 1.effect(fn) => function(runner) => fn => return
    // 实现一个effect函数，接收一个函数fn，返回一个函数runner，调用runner的时候会执行fn
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);
    const r = runner();
    expect(r).toBe("foo");
    expect(foo).toBe(12);
  });
});
