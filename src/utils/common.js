export const ItemTypes = "DraggableBodyRow";

// 操作类型
export const optionsTyps = {
  didDrop: "didDrop", // 拖拽出区域
  hover: "hover",
  drop: "drop", // 放置
};

// 数据类型
export const dataType = {
  group: "group",
  child: "child",
};

// 得到最终数据： 正在拖拽的行，目标索引行
export const getDragAndDropData = (data, dragId, dropId) => {
  let dragRow, dropRow;
  let dragIndex, dropIndex;
  let parentItem; // 正在拖的项和交换位置的项，二者共同的 parent

  let isHaveDragItem = false;
  let isHaveDropItem = false;

  // 递归 data, 得到正在拖拽的项、即将要将拖拽项放入的项（行本身是可拖拽区域）、它们的索引,
  // 并得到它们共同的 parent 项
  function recursion(data, dragId, dropId, parent) {
    if (isHaveDragItem && isHaveDropItem) {
      return;
    }

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (isHaveDragItem && isHaveDropItem) {
        return;
      }

      if (item.id === dragId) {
        isHaveDragItem = true;
        dragRow = item;
        dragIndex = i;
        parentItem = parent;
      }
      if (item.id === dropId) {
        isHaveDropItem = true;
        dropRow = item;
        dropIndex = i;
        parentItem = parent;
      }

      item.children && recursion(item?.children, dragId, dropId, item);
    }
  }

  recursion(data, dragId, dropId, null);

  return {
    dragRow,
    dropRow,
    dragIndex,
    dropIndex,
    parentItem,
  };
};

export const findFromData = (data, id) => {
  let row, index, parentIndex;

  for (let i = 0; i < data.length; i++) {
    // 父节点拖拽
    let parentDom = data[i];
    if (parentDom.id === id) {
      row = parentDom;
      index = i;
      parentIndex = null;
    }

    // 子节点拖拽
    const ele = parentDom.children || [];
    for (let j = 0; j < ele.length; j++) {
      const child = ele[j];

      if (child.id === id) {
        row = child;
        index = j;
        parentIndex = i;
      }
    }
  }

  return {
    row,
    index,
    parentIndex,
  };
};
