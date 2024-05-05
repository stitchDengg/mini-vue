import { effect } from "../src/effect";
import { reactive } from "../src/reactive";

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

  it("scheduler", () => {
    // 1.通过effect的第二个参数scheduler，可以自定义调度器
    // 2.当effect第一次执行的时候 还会执行fn
    // 3.当响应式对象发生变化的时候就不会执行fn，而是调用scheduler
    // 4. 当执行runner的时候会再次执行fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);
  });
});
