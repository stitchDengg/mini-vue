import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先去转换为vNode 后续所有操作都基于vNode操作
      const vnode = createVNode(rootComponent);

      // 挂载
      render(vnode, rootContainer);
    },
  };
}
