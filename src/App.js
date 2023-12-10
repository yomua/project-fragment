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
  getFinalUseData,
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

  const moveRow = useCallback(
    (props) => {
      let { dragId, dropId, dropParentId } = props;

      let {
        dragRow,
        dropRow,
        dragIndex,
        dropIndex,
        parentItem, // 拖拽那一项的 parent，如果没有 parent, 就为 null
      } = getFinalUseData(data, dragId, dropId);

      // 是否拖拽根部
      let dragIsGroup = !dragRow.parentId;
      // 是否放置在根部
      let dropIsGroup = !dropParentId;

      let newData = data;
      // 根拖拽
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
        let newParentItemChildren;
        // 递归 data children, 找到 parentItem
        if (parentItem) {
          newParentItemChildren = update(parentItem.children, {
            $splice: [
              [dragIndex, 1],
              [dropIndex, 0, dragRow],
            ],
          });

          const newParentItem = {
            ...parentItem,
            children: newParentItemChildren,
          };

          // 递归 data, 找到 data 中和 parentItem.id 相同的项
          // 然后使用交换过数据的 parentItem 对其进行替换
          function digui(data, parentItem) {
            for (let i = 0; i < data.length; i++) {
              const item = data[i];
              if (item.id === parentItem.id) {
                data[i] = newParentItem;
                return;
              } else {
                digui(item?.children || [], parentItem);
              }
            }
          }
          digui(newData, newParentItem);
        }
      }

      setData([...newData]);
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
