import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { dataType, ItemTypes, optionsTyps } from "../utils/common";

export const DraggableBodyRow = (props) => {
  let {
    record,
    data,
    index,
    className,
    style,
    moveRow,
    findRow,
    ...restProps
  } = props;

  if (!record) return null;

  let isDrag = true; // 允许所有行（所有层级）可以拖拽

  const rowRef = useRef();

  const [{ handlerId, isOver, dropClassName }, drop] = useDrop({
    accept: ItemTypes,
    collect: (monitor) => {
      const {
        id: dragId,
        parentId: dragParentId,
        index: dragPreIndex,
        isGroup,
      } = monitor.getItem() || {};

      if (dragId === record.id) {
        return {};
      }

      // 是否可以拖拽替换
      let isOver = monitor.isOver();
      if (isGroup) {
        // 要覆盖的数据是分组，或者是最外层的子项可以替换，其他情况不可以
        let recordIsGroup = record.type === dataType.group;
        if (!recordIsGroup) {
          isOver = false;
        }
      } else {
        // 要覆盖的数据是子项，但不在同分组不可以替换
        if (dragParentId !== record.parentId) {
          isOver = false;
        }
      }

      return {
        isOver,
        dropClassName: "drop-over-downward",
        handlerId: monitor.getHandlerId(),
      };
    },
    // hover 不影响功能，只是提供一个良好的视觉效果，即：拖拽到目标时，目标会被挤开（下滑或上移）
    // hover: (item, monitor) => {
    //   if (!rowRef.current) {
    //     return;
    //   }
    //   const dragIndex = item.index;
    //   const dropIndex = index;
    //   // Don't replace items with themselves
    //   if (dragIndex === dropIndex) {
    //     return;
    //   }

    //   let opt = {
    //     dragId: item.id, // 拖拽id
    //     dropId: record.id, // 要放置位置行的id
    //     dropParentId: record.parentId,
    //     operateType: optionsTyps.hover, // hover操作
    //   };

    //   // console.log("hover", opt);
    //   moveRow(opt);
    //   // Note: we're mutating the monitor item here!
    //   // Generally it's better to avoid mutations,
    //   // but it's good here for the sake of performance
    //   // to avoid expensive index searches.
    //   item.index = dropIndex;
    // },
    // item: 由 useDrag - item 定义
    drop: (item, monitor) => {
      let opt = {
        dragId: item.id, // 当前正在拖拽行 id
        dropId: record.id,
        dropParentId: record.parentId, // 当前拖拽行的父级 id
        operateType: optionsTyps.drop,
      };

      moveRow(opt);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes,
    item: {
      id: record.id,
      parentId: record.parentId,
      index,
      isGroup: record.type === dataType.group,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => {
      return isDrag;
    },
    // 目前可以不需要
    // end: (item, monitor) => {
    //   const { id: droppedId, originalRow } = item;
    //   const didDrop = monitor.didDrop();
    //   // 超出可拖拽区域，需要将拖拽行还原
    //   if (!didDrop) {
    //     let opt = {
    //       dragId: droppedId, // 拖拽id
    //       dropId: originalRow.id, // 要放置位置行的id
    //       dropParentId: originalRow.parentId,
    //     };
    //     // console.log("useDrag:", opt);
    //     moveRow(opt);
    //   }
    // },
  });

  drop(drag(rowRef));

  // 拖拽行的位置显示透明
  const opacity = isDragging ? 0 : 1;

  return (
    <tr
      ref={rowRef}
      className={`${className}
      ${isOver ? dropClassName : ""} 
      ${isDrag ? "can-drag" : ""}`}
      style={isDrag ? { cursor: "move", opacity, ...style } : { ...style }}
      data-handler-id={handlerId}
      {...restProps}
    />
  );
};
