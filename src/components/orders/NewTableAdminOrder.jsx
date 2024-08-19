import { Button, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Select, Table, Typography } from "antd";
import React, { useState } from "react";
import { useGetOrders } from "../service/admin/useGetOrders";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PrinterOutlined } from "@ant-design/icons";
import Status from "../shared/Status";
import dayjs from "dayjs";

// EDIT
const dateFormat = "YYYY/MM/DD";
const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  const handleChangeStatus = (value) => {
    console.log(`selected ${value}`);
  };
  const inputNode =
    inputType === "date" ? (
      <DatePicker format={dateFormat} />
    ) : inputType === "status" ? (
      <Select placeholder="Status" style={{ width: 120 }} onChange={handleChangeStatus}>
        <Option value="Complete">Complete</Option>
        <Option value="Cancel">Cancel</Option>
      </Select>
    ) : inputType === "number" ? (
      <InputNumber />
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

const NewTableAdminOrder = () => {
  const dataSource = [];
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      date: "",
      amount: "",
      bankNumber: "",
      bankName: "",
      bankBranch: "",
      accountName: "",
      status: "",
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

  const { data: orders, isPending, isError } = useGetOrders();
  isPending || isError
    ? "loading"
    : orders.payload.map((data, index) => {
        // console.log(dayjs(data.createdAt, dateFormat).$d);
        dataSource.push({
          key: data.id,
          no: index + 1,
          date: edit ? dayjs(data.createdAt, dateFormat) : dayjs(data.createdAt, dateFormat).$d.toString(),
          amount: data.amount,
          bankNumber: data.bank_number,
          bankName: data.bank_detail,
          bankBranch: data.bank_branch,
          accountName: data.account_name,
          invoice: data.invoice_name,
          status: data.status,
          action: "Action",
        });
      });

  // Delete
  const { confirm } = Modal;
  const showConfirm = () => {
    confirm({
      title: "Do you want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure? deleted data cannot be recovered!",
      okText: "Yes",
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "no",
      key: "no",
      width: 5,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      editable: true,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      editable: true,
    },
    {
      title: "Bank Number",
      dataIndex: "bankNumber",
      key: "bankNumber",
      editable: true,
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      editable: true,
    },
    {
      title: "Bank Branch",
      dataIndex: "bankBranch",
      key: "bankBranch",
      editable: true,
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
      editable: true,
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      render: (text, record, index) => (
        <a type="primary" onClick={showModal} className="w-fit text-xs underline text-primary">
          See Invoice
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 25,
      editable: true,
      render: (text, record, index) => <Status status={record.status} />,
    },
    {
      title: "Actions",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
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
          <div className="flex gap-0.5">
            <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
              <button className="px-2 py-1 bg-primary rounded-md text-white">
                <EditOutlined />
              </button>
            </Typography.Link>
            <button className="px-2 py-1 bg-red-500 rounded-md text-white" onClick={showConfirm} type="dashed">
              <DeleteOutlined />
            </button>
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

  // rowSelection
  const [selectionType, setSelectionType] = useState("checkbox");
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
  };

  return (
    <div>
      <div className="flex flex-col p-3 bg-white rounded-lg mt-7">
        <div className="flex items-center justify-between">
          {/* {isPending || isError
            ? console.log("loading...")
            : Object.entries(orders.payload).map((data, index) => {
                return (
                  <h1 key={index} className="mt-3 mb-8 ml-5 text-lg font-semibold">
                    {data[1].user_id.username}
                    {console.log(data)}
                  </h1>
                );
              })}
          ; */}
          <h1 className="mt-3 mb-8 ml-5 text-lg font-semibold">Username 1</h1>
          <div className="flex gap-3 mr-5">
            <Button type="primary" icon={<PrinterOutlined />} className="bg-gray-500 border border-gray-400 hover:!bg-gray-600">
              Print
            </Button>
            <Button type="primary">Export to Excel</Button>
          </div>
        </div>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={dataSource}
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={mergedColumns}
            rowClassName="editable-row"
          />
        </Form>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <img src={`/`} alt="Invoice" width="500" height="600" />
        </Modal>
      </div>
    </div>
  );
};

export default NewTableAdminOrder;
