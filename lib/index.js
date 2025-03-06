class Reducer {
  static #instance = null; // 静态私有字段声明
  #isExecuting = false; // 标识是否正在执行 undo 或 redo
  #groupId = null; // 当前操作的 groupId，默认为 null
  #limit = 20; // 默认设置最大存储步数，默认为 20

  constructor(isInstance = true) {
    if (isInstance && Reducer.#instance) {
      return Reducer.#instance;
    }
    Reducer.#instance = this;
    this.undoCommands = []; // 存储 undo 操作的命令
    this.redoCommands = []; // 存储 redo 操作的命令
    this.callbacks = []; // 存储回调函数
  }

  /**
   * 设置当前 #groupId，便于操作归属分组
   */
  setGroupId() {
    this.#groupId = Date.now(); // 用当前时间戳作为唯一的 groupId
  }

  /**
   * 清除当前的 groupId
   */
  clearGroupId() {
    this.#groupId = null; // 清除 groupId
  }

  /**
   * 添加新命令到 undo 栈，并清空 redo 栈
   * @param {Object} command - 具有 `undo` 和 `redo` 方法的命令对象
   * @param {boolean} isTriggerCallbacks - 是否触发回调
   */
  addCommand(command, isTriggerCallbacks) {
    if (this.#isExecuting) return this; // 防止在 undo/redo 操作时添加新命令，导致混乱

    command.groupId = this.#groupId; // 给命令绑定当前 groupId

    // 如果超出限制，删除最早的命令
    while (this.undoCommands.length >= this.#limit) {
      this.undoCommands.shift(); // 删除最早的命令
    }

    this.undoCommands.push(command); // 将命令加入 undo 栈
    this.redoCommands = []; // 清空 redo 栈
    isTriggerCallbacks && this.triggerCallbacks(this); // 触发回调
  }

  /**
   * 执行 undo 操作
   * @param {boolean} isTriggerCallbacks - 是否触发回调
   */
  undo(isTriggerCallbacks = true) {
    if (this.isUndoDisabled()) return; // 如果 undo 不可用，直接返回

    const commandsToUndo = [];
    let lastCommand = this.undoCommands.pop(); // 取出最后一个命令
    commandsToUndo.push(lastCommand);

    // 继续向前查找相同 groupId 的命令
    while (
      lastCommand.groupId &&
      this.undoCommands.length &&
      this.undoCommands[this.undoCommands.length - 1].groupId ===
        lastCommand.groupId
    ) {
      commandsToUndo.push(this.undoCommands.pop());
    }
    // 执行所有同组的命令
    for (let i = 0; i <= commandsToUndo.length - 1; i++) {
      this.execute(commandsToUndo[i], "undo");
      this.redoCommands.push(commandsToUndo[i]); // 依次放入 redo 栈
    }

    isTriggerCallbacks && this.triggerCallbacks(this); // 触发回调
  }

  /**
   * 执行 redo 操作
   * @param {boolean} isTriggerCallbacks - 是否触发回调
   */
  redo(isTriggerCallbacks = true) {
    if (this.isRedoDisabled()) return; // 如果 redo 不可用，直接返回

    const commandsToRedo = [];
    let lastCommand = this.redoCommands.pop(); // 取出 redo 栈顶的命令
    commandsToRedo.push(lastCommand);

    // 继续向后查找相同 groupId 的命令
    while (
      lastCommand.groupId &&
      this.redoCommands.length &&
      this.redoCommands[this.redoCommands.length - 1].groupId ===
        lastCommand.groupId
    ) {
      commandsToRedo.push(this.redoCommands.pop());
    }

    // 执行所有同组的命令
    for (let i = 0; i <= commandsToRedo.length - 1; i++) {
      this.execute(commandsToRedo[i], "redo");
      this.undoCommands.push(commandsToRedo[i]); // 依次放入 undo 栈
    }

    isTriggerCallbacks && this.triggerCallbacks(this); // 触发回调
  }

  /**
   * 执行具体的 command 操作
   * @param {Object} command - 需要执行的命令
   * @param {string} action - 'undo' 或 'redo'
   */
  execute(command, action) {
    if (!command || typeof command[action] !== "function") return;

    this.#isExecuting = true; // 标记正在执行
    try {
      command[action](); // 执行 undo 或 redo 方法
    } catch (error) {
      console.error(`Error executing ${action} on command`, error);
    } finally {
      this.#isExecuting = false; // 结束后重置状态
    }
  }

  /**
   * 设置 undo 记录的最大存储步数
   * @param {number} max - 最大存储步数
   */
  setLimit(max) {
    this.#limit = max;
  }

  /**
   * 判断 undo 是否可用
   * @returns {boolean}
   */
  isUndoDisabled() {
    return this.undoCommands.length <= 0; // 如果 undo 栈为空，则不可用
  }

  /**
   * 判断 redo 是否可用
   * @returns {boolean}
   */
  isRedoDisabled() {
    return this.redoCommands.length <= 0; // 如果 redo 栈为空，则不可用
  }

  /**
   * 清空 undo 和 redo 记录
   * @param {boolean} isTriggerCallbacks - 是否触发回调
   */
  clear(isTriggerCallbacks = true) {
    this.undoCommands = [];
    this.redoCommands = [];
    isTriggerCallbacks && this.triggerCallbacks(this); // 触发回调
  }

  /**
   * 订阅回调函数，在 undo/redo 变化时触发
   * @param {Function} callbackFunc - 需要执行的回调函数
   */
  subscribeCallback(callbackFunc) {
    if (typeof callbackFunc === "function") {
      this.callbacks.push(callbackFunc); // 将回调函数加入列表
    }
  }

  /**
   * 触发所有订阅的回调
   * @param {any} action - 传递给回调的参数
   */
  triggerCallbacks(action) {
    this.callbacks.forEach((callbackFunc) => callbackFunc(action));
  }

  /**
   * 取消订阅回调
   * @param {Function} callbackFunc - 需要移除的回调函数
   */
  removeCallback(callbackFunc) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callbackFunc); // 移除指定回调
  }

  /**
   * 清空所有回调
   */
  clearCallbacks() {
    this.callbacks = []; // 清空回调函数列表
  }
}

// 创建实例并导出
const reducer = new Reducer();
export default reducer;

window.reducer = reducer;
