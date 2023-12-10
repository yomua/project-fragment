export const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "人数",
    dataIndex: "number",
    key: "number",
  },
];

export const tableData = [
  {
    parentId: null,
    id: "0",
    name: "分组1",
    number: "10",
    type: "group",
    children: [
      {
        parentId: "0",
        id: "0-0",
        name: "分组1-测试1",
        number: "2",
        type: "child",
        children: [
          {
            parentId: "0-0",
            id: "0-0-0",
            name: "0-0-0",
            number: "2",
            type: "child",
            children: [
              {
                parentId: "0-0-0",
                id: "0-0-0-0",
                name: "0-0-0-0",
                number: "2",
                type: "child",
                isDrag: true,
              },
              {
                parentId: "0-0-0",
                id: "0-0-0-1",
                name: "0-0-0-1",
                number: "2",
                type: "child",
                isDrag: true,
              },
            ],
          },
          {
            parentId: "0-0",
            id: "0-0-1",
            name: "0-0-1",
            number: "2",
            type: "child",
          },
        ],
      },
      {
        parentId: "0",
        id: "0-1",
        name: "分组1-测试2",
        number: "5",
        type: "child",
      },
      {
        parentId: "0",
        id: "0-2",
        name: "分组1-测试3",
        number: "3",
        type: "child",
        children: [
          {
            parentId: "0-2",
            id: "0-2-0",
            name: "0-2-0",
            number: "2",
            type: "child",
          },
          {
            parentId: "0-2",
            id: "0-2-1",
            name: "0-2-1",
            number: "2",
            type: "child",
          },
        ],
      },
    ],
  },
  {
    parentId: null,
    id: "1",
    name: "分组2",
    number: "3",
    type: "group",
    children: [
      {
        parentId: "1",
        id: "1-0",
        name: "分组2-测试1",
        number: "2",
        type: "child",
      },
      {
        parentId: "1",
        id: "1-1",
        name: "分组2-测试2",
        number: "1",
        type: "child",
      },
    ],
  },
  {
    parentId: null,
    id: "2",
    name: "测试child-1",
    number: "3",
    type: "child",
  },
  {
    parentId: null,
    id: "3",
    name: "测试child-2",
    number: "2",
    type: "child",
    children: [
      {
        parentId: "3",
        id: "3-0",
        name: "3-0",
        number: "2",
        type: "child",
      },
      {
        parentId: "3",
        id: "3-1",
        name: "3-1",
        number: "2",
        type: "child",
      },
    ],
  },
];
