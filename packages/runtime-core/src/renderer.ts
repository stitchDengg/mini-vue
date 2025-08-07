export function render(vnode, container) {
  // 调用patch方法
  patch(vnode, container);
}

function patch(vnode, container) {
  // 判断vnode是否是组件
  if (typeof vnode.type === "string") {
    // 处理组件
  } else {
    // 处理元素
  }
}
