import "./styles.css";
import React, { useState, useCallback, useRef } from "react";
import { Table } from "antd";
import "antd/dist/antd.css";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";

import { columns, tableData } from "./utils/data";
import {
  dataType,
  optionsTyps,
  findFromData,
  getDragAndDropData,
} from "./utils/common";
import { DraggableBodyRow } from "./comp/row";

const App = () => {
  const [data, setData] = useState(tableData);

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const findRow = (id) => {
    // 通过原始数据，根据id查询到对应数据信息和索引
    const { row, index, parentIndex } = findFromData(tableData, id);
    return {
      row,
      rowIndex: index,
      rowParentIndex: parentIndex,
    };
  };

  // 拖拽行并释放时触发，用来将拖拽行插入到目标索引
  const moveRow = useCallback(
    (params) => {
      let { dragId, dropId, dropParentId } = params;

      let {
        dragRow,
        dropRow,
        dragIndex,
        dropIndex,
        parentItem, // 拖拽行和要插入位置项的共同  parent，如果没有 parent, 就为 null
      } = getDragAndDropData(data, dragId, dropId);

      // 是否拖拽根部
      let dragIsGroup = !dragRow.parentId;
      // 是否放置在根部（第一级）
      let dropIsGroup = !dropParentId;

      let newData = data;
      // 根拖拽（第一级）
      if (dragIsGroup && dropIsGroup) {
        newData = update(data, {
          $splice: [
            [dragIndex, 1],
            [dropIndex, 0, dragRow],
          ],
        });
      }
      // 判断拖拽项和放置项是否为同一层级
      else if (dragRow.parentId === dropRow?.parentId) {
        if (parentItem) {
          // 当拖拽结束, 更新正在被拖拽行的父级（直接使用新数据替换旧数据）
          const newParentItem = update(parentItem, {
            children: {
              $splice: [
                [dragIndex, 1],
                [dropIndex, 0, dragRow],
              ],
            },
          });

          // 更新 dataSource,
          // 递归 dataSource, 找到 data 中和 parentItem.id 相同的项, 然后使用改变后的数据对其进行替换
          function replaceNode(data, parentItem) {
            return update(data, {
              $apply: (arr) =>
                arr.map((item) => {
                  // 找到需要替换的 item 并替换为新数据
                  if (item.id === parentItem.id) {
                    return newParentItem;
                  }

                  // 递归，处理可能存在的子级
                  if (item.children) {
                    return update(item, {
                      children: {
                        $apply: (subArr) => replaceNode(subArr, parentItem),
                      },
                    });
                  }

                  return item;
                }),
            });
          }

          newData = replaceNode(data, newParentItem);
        }
      }

      setData(newData);
    },
    [data]
  );

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Table
          columns={columns}
          dataSource={data}
          components={components}
          rowKey={(record) => record.id}
          onRow={(record, index) => ({
            record,
            data,
            index,
            moveRow,
            findRow,
          })}
        />
      </DndProvider>
    </div>
  );
};

export default App;
