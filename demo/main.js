// 获取按钮，注册对应事件
const addBtn = document.getElementById("addBtn");
const subtractBtn = document.getElementById("subtractBtn");
const multiplyBtn = document.getElementById("multiplyBtn");
const divideBtn = document.getElementById("divideBtn");
const addItemBtn = document.getElementById("addItemBtn");
const changeBgBtn = document.getElementById("changeBgBtn");
const groupBtn = document.getElementById("groupBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

// main.js
// 导入各个模块
import reducer from "../lib/index.js"
import { operation } from "./operations.js";
import { addListItem } from "./listManagement.js";
import { changeBackgroundColor } from "./randomBackgroundColor.js";



// 加减乘除按钮点击事件
addBtn.addEventListener("click", () =>
  operation("add")
);
subtractBtn.addEventListener("click", () =>
  operation("subtract")
);
multiplyBtn.addEventListener("click", () =>
  operation("multiply")
);
divideBtn.addEventListener("click", () =>
  operation("divide")
);

// 列表项添加按钮点击事件
addItemBtn.addEventListener("click", addListItem);

// 随机背景色变化按钮点击事件
changeBgBtn.addEventListener("click", changeBackgroundColor);

// 分组按钮事件监听
toggleGroupButton();

// Undo 和 Redo 按钮事件
undoBtn.addEventListener('click', () => reducer.undo());
redoBtn.addEventListener('click', () => reducer.redo());

let isGrouping = false; // 当前是否正在进行分组操作

// 分组按钮事件监听
function toggleGroupButton() {
  groupBtn.addEventListener('click', () => {
    if (!isGrouping) {
      // 如果当前没有在进行分组操作，则开始分组
      isGrouping = true;
      groupBtn.textContent = 'End Group'; // 更改按钮文本为 End Group
      reducer.setGroupId(); // 调用 Reducer 的 startGroup 方法
    } else {
      // 如果当前已经在进行分组操作，则结束分组
      isGrouping = false;
      groupBtn.textContent = 'Start Group'; // 更改按钮文本为 Start Group
      reducer.clearGroupId(); // 调用 Reducer 的 endGroup 方法
    }
  });
}

