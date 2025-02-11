
import reducer from "../lib/index.js"

// 获取 DOM 元素
const itemListElem = document.getElementById("itemList");
const listItemInputElem = document.getElementById("listItemInput");
// listManagement.js
// 列表项添加与删除
export function addListItem() {
    const itemText = listItemInputElem.value.trim();
    if (!itemText) {
        return ;
    }
    const li = document.createElement('li');
    li.textContent = itemText;
    itemListElem.appendChild(li);
  
    // 添加命令到 reducer
    const command = {
      undo: () => li.remove(),
      redo: () => itemListElem.appendChild(li),
    };
  
    reducer.addCommand(command);
    listItemInputElem.value = ''; // 清空输入框
  }
  