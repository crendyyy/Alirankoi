import React, { useState } from "react";
import { Button, DatePicker, Form, Input, InputNumber, Popconfirm, Select, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PrinterOutlined } from "@ant-design/icons";
import Status from "../shared/Status";
const originData = [];

for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    no: `${i + 1}`,
    bankNumber: `${i}`,
    date: "",
    bankName: `Nama Bank ${i}`,
    bankBranch: `Bank Branch ${i}`,
    accountName: `Account Name ${i}`,
    status: `Success`,
    amount: `1000`,
    tes: `${i}`,
  });
}
const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  function handleChangeStatus(value) {
    console.log(`selected ${value}`);
  }
  const inputNode =
    inputType === "date" ? (
      <DatePicker />
    ) : inputType === "status" ? (
      <Select placeholder="Status" style={{ width: 120 }} onChange={handleChangeStatus}>
        <Option value="Complete">Complete</Option>
        <Option value="Cancel">Cancel</Option>
      </Select>
    ) : (
      <Input />
    );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const TableAdminOrder = () => {
  // Select
  function handleChangeStatus(value) {
    console.log(`selected ${value}`);
  }

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      amount: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "#",
      dataIndex: "no",
      width: 10,
    },
    {
      title: "Date",
      dataIndex: "date",
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <DatePicker />
        ) : (
          <span className="flex flex-col gap-1 text-sm font-normal">
            <span className="font-medium">Mon Aug 2024 14:37:16</span>
          </span>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      editable: true,
    },
    {
      title: "Bank Number",
      dataIndex: "bankNumber",
      editable: true,
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      editable: true,
    },
    {
      title: "Bank Branch",
      dataIndex: "bankBranch",
      editable: true,
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      editable: true,
    },
    {
      title: "Invoice",
      dataIndex: "",
      render: (text, record, index) => (
<<<<<<< Updated upstream
        <Button className="w-full" type="primary">
          See Invoice
        </Button>
=======
        <a type="primary" className="w-fit text-xs underline text-primary">
          See Invoice
        </a>
>>>>>>> Stashed changes
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      editable: true,
      render: (text, record, index) => <Status status="Complete" />,
    },
    {
      title: "Actions",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="flex flex-col">
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginInlineEnd: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className="flex items-center gap-1">
            <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
              <button className="px-2 py-1 bg-primary rounded-md text-white">
                <EditOutlined />
              </button>
            </Typography.Link>
            <button className="px-2 py-1 bg-red-500 rounded-md text-white">
              <DeleteOutlined />
            </button>
            {/* <Select
              placeholder="Status"
              style={{ width: "100%" }}
              onChange={handleChangeStatus}
            >
              <Option value="Complete">Complete</Option>
              <Option value="Cancel">Cancel</Option>
            </Select>
            <Button type="primary">Update Status</Button> */}
          </div>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div className="flex flex-col p-3 bg-white rounded-lg mt-7">
      <Form form={form} component={false}>
        <div className="flex items-center justify-between">
          <h1 className="mt-3 mb-8 ml-5 text-lg font-semibold">User Order 1</h1>
          <div className="flex gap-3">
            <Button type="primary" icon={<PrinterOutlined />} className="bg-gray-500 border border-gray-400 hover:!bg-gray-600">
              Print
            </Button>
            <Button type="primary">Export to Excel</Button>
          </div>
        </div>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};
export default TableAdminOrder;
