import reducer from "../lib/index.js";

// 获取 DOM 元素
const itemListElem = document.getElementById("itemList");
const listItemInputElem = document.getElementById("listItemInput");
// listManagement.js
// 列表项添加与删除
export function addListItem() {
  const itemText = listItemInputElem.value.trim();
  if (!itemText) {
    return;
  }

  const li = document.createElement('li');
  li.textContent = itemText;

  // 创建删除按钮
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => deleteListItem(li);

  li.appendChild(deleteBtn);
  itemListElem.appendChild(li);

  // 添加命令到 reducer
  const command = {
    undo: () => li.remove(),
    redo: () => itemListElem.appendChild(li),
  };

  reducer.addCommand(command);
  listItemInputElem.value = ''; // 清空输入框
}

// 删除列表项
function deleteListItem(li) {
  // 移除 li 元素
  itemListElem.removeChild(li);

  // 添加命令到 reducer
  const command = {
    undo: () => itemListElem.appendChild(li), // 撤销时将 li 恢复
    redo: () => itemListElem.removeChild(li), // 重做时将 li 删除
  };

  reducer.addCommand(command);
}
