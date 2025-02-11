import reducer from "../lib/index.js"

// 随机背景色变化
export function changeBackgroundColor() {
  // 获取当前背景色，以便恢复
  const currentColor = document.body.style.backgroundColor || ''; // 如果没有设置背景色，默认为 ''
  
  // 生成随机颜色
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  document.body.style.backgroundColor = randomColor;

  // 创建命令对象，包含 undo 和 redo 操作
  const command = {
    undo: () => {
      // 恢复到之前的背景色
      document.body.style.backgroundColor = currentColor;
    },
    redo: () => {
      // 恢复到新生成的随机背景色
      document.body.style.backgroundColor = randomColor;
    },
  };

  // 将命令添加到 Reducer 中，确保支持 undo/redo
  reducer.addCommand(command);
}
