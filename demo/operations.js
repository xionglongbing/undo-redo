import reducer from "../lib/index.js"

const currentValueElem = document.getElementById("currentValue");
const inputValueElem = document.getElementById("inputValue");
// 初始化值
let currentValue = 18;

// 更新显示的当前值
function updateCurrentValue(value) {
  currentValueElem.textContent = value;
}

// operations.js
// 执行加减乘除操作的函数
export function operation(operation) {
    const inputValue = parseFloat(inputValueElem.value);
    const prevValue = currentValue;
    let newValue = 0;
  
    if (operation === 'add') {
      newValue = prevValue + inputValue;
    } else if (operation === 'subtract') {
      newValue = prevValue - inputValue;
    } else if (operation === 'multiply') {
      newValue = prevValue * inputValue;
    } else if (operation === 'divide') {
      newValue = prevValue / inputValue;
    }
  
    // 创建命令对象，支持 undo 和 redo
    const command = {
      prevValue,
      undo: () => {
        currentValue = prevValue;
        updateCurrentValue(currentValue);  // 更新显示的当前值
      },
      redo: () => {
        currentValue = newValue;
        updateCurrentValue(currentValue);  // 更新显示的当前值
      }
    };
  
    // 添加命令到 reducer
    reducer.addCommand(command);
  
    currentValue = newValue;
    updateCurrentValue(currentValue);  // 更新显示的当前值
  }
  