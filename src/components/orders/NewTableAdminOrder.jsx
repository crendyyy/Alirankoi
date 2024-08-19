import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Table,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useGetOrders } from "../service/admin/useGetOrders";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PrinterOutlined,
} from "@ant-design/icons";
import Status from "../shared/Status";
import dayjs from "dayjs";

const dateFormat = "YYYY/MM/DD";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "date" ? (
      <DatePicker format={dateFormat} />
    ) : inputType === "status" ? (
      <Select placeholder="Status" style={{ width: 120 }}>
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
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
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
  const { data: orders, isPending, isError } = useGetOrders();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      date: dayjs(record.date).isValid()
        ? dayjs(record.date)
        : dayjs(new Date(record.date)),
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey("");

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...orders.payload];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setEditingKey("");
      } else {
        newData.push(row);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Do you want to delete this item?",
      icon: <ExclamationCircleFilled />,
      content: "Deleted data cannot be recovered!",
      okText: "Yes",
      onOk() {
        console.log("OK");
      },
    });
  };

  const dataSource =
     orders?.payload.map((order, index) => ({
          key: order._id,
          no: index + 1,
          date: edit
            ? dayjs(order.createdAt)
            : dayjs(order.createdAt).format(dateFormat),
          amount: order.amount,
          bank_number: order.bank_number,
          bank_detail: order.bank_detail,
          bank_branch: order.bank_branch,
          account_name: order.account_name,
          status: order.status,
          invoice: order.invoice_name,
          username: order.user_id?.username,
        })) || [];

  const columns = [
    {
      title: "#",
      dataIndex: "no",
      width: 5,
      render: (text, record) => (
        <span className="text-sm font-normal">{record.no}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      editable: true,
      render: (text, record) => {
        // Display the full Date string if not editing
        return isEditing(record) ? (
          text
        ) : (
          <span>{new Date(record.date).toString()}</span>
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
      dataIndex: "bank_number",
      editable: true,
    },
    {
      title: "Bank Name",
      dataIndex: "bank_detail",
      editable: true,
    },
    {
      title: "Bank Branch",
      dataIndex: "bank_branch",
      editable: true,
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
      editable: true,
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      render: (_, record) => (
        <a
          onClick={() => {
            setSelectedInvoice(record.invoice);
            setIsModalOpen(true);
          }}
          className="text-xs underline w-fit text-primary"
        >
          See Invoice
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 25,
      editable: true,
      render: (text, record) => <Status status={record.status} />,
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
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <Button className="px-2 py-1 text-white rounded-md bg-primary">
                <EditOutlined />
              </Button>
            </Typography.Link>
            <Button
              className="px-2 py-1 text-white bg-red-500 rounded-md"
              onClick={showConfirm}
            >
              <DeleteOutlined />
            </Button>
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
    <>
      {dataSource.map((order) => (
        <div className="flex flex-col p-3 bg-white rounded-lg mt-7">
          <div key={order.key}>
            <div className="flex items-center justify-between">
              <h1 className="mt-3 mb-8 ml-5 text-lg font-semibold">
                {order.username}
              </h1>
              <div className="flex gap-3 mr-5">
                <Button
                  type="primary"
                  icon={<PrinterOutlined />}
                  className="bg-gray-500 border border-gray-400 hover:!bg-gray-600"
                >
                  Print
                </Button>
                <Button type="primary">Export to Excel</Button>
              </div>
            </div>
            <Form form={form} component={false}>
              <Table
                components={{ body: { cell: EditableCell } }}
                dataSource={dataSource.filter(
                  (filteredOrder) => filteredOrder.username === order.username
                )}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ pageSize: 10 }}
              />
            </Form>
          </div>
        </div>
      ))}
      <Modal
        title="Invoice"
        visible={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <img
          src={`http://localhost:3000/picture/${selectedInvoice}`}
          alt="Invoice"
          width="500"
          height="600"
        />
      </Modal>
    </>
  );
};

export default NewTableAdminOrder;
