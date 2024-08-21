import {
  Button,
  DatePicker,
  Flex,
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
import { useGetOrders } from "../service/admin/orders/useGetOrders";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PrinterOutlined,
} from "@ant-design/icons";
import Status from "../shared/Status";
import dayjs from "dayjs";
import { useDeleteOrder } from "../service/admin/orders/useDeleteOrder";
import { useUpdateStatusOrder } from "../service/admin/orders/useUpdateStatusOrder";

const dateFormat = "YYYY-MM-DD";

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
        <Select.Option value="Complete">Complete</Select.Option>
        <Select.Option value="Cancel">Cancel</Select.Option>
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

const groupBy = (array, getKey) => {
  return array.reduce((result, currentItem) => {
    const groupKey = getKey(currentItem);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentItem);
    return result;
  }, {});
};

const NewTableAdminOrder = ({ selectedDate, setSelectedRow, selectedRow }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [selectedRowsByGroup, setSelectedRowsByGroup] = useState({});

  const { data: orders, isPending, isError } = useGetOrders();
  const updateStatusOrderMutation = useUpdateStatusOrder();

  const deleteOrderMutation = useDeleteOrder();

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
        const updatedData = {
          ...item,
          ...row,
        };

        // Call the mutation function with the updated status
        updateStatusOrderMutation.mutate({
          id: item._id,
          data: { status: updatedData.status },
        });

        newData.splice(index, 1, updatedData);
        setEditingKey("");
      } else {
        newData.push(row);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const showConfirm = (id) => {
    Modal.confirm({
      title: "Do you want to delete this item?",
      icon: <ExclamationCircleFilled />,
      content: "Deleted data cannot be recovered!",
      okText: "Yes",
      okType: "danger",
      onOk: () => deleteOrderMutation.mutate(id),
    });
  };

  const filteredOrders =
    orders?.payload.filter((order) => {
      const orderDate = dayjs(order.createdAt).format(dateFormat);
      const matchDate = selectedDate ? orderDate === selectedDate : true;

      return matchDate;
    }) || [];

  const dataSource =
    filteredOrders.map((order) => ({
      key: `${order._id}`,
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

  const groupedOrders = Array.isArray(dataSource)
    ? groupBy(dataSource, (order) => order.username) || []
    : {};

  const columns = [
    {
      title: "#",
      dataIndex: "no",
      width: 5,
      render: (text, record, index) => (
        <span className="text-sm font-normal">{index + 1}</span>
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
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginInlineEnd: 8 }}
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
              onClick={() => showConfirm(record.key)}
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
      <Flex vertical gap="middle">
        {Object.keys(groupedOrders).map((username) => (
          <div className="flex flex-col p-3 bg-white rounded-lg" key={username}>
            <div className="flex items-center justify-between">
              <h1 className="mt-3 mb-8 ml-5 text-lg font-semibold">
                {username}
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
                rowSelection={{
                  type: "checkbox",
                  selectedRowKeys: selectedRowsByGroup[username] || [],
                  onChange: (selectedRowKeys) => {
                    const newSelectedRowsByGroup = { ...selectedRowsByGroup };

                    // Perbarui pilihan berdasarkan username grup
                    newSelectedRowsByGroup[username] = selectedRowKeys;

                    // Perbarui state untuk grup dan semua baris yang dipilih
                    setSelectedRowsByGroup(newSelectedRowsByGroup);
                    setSelectedRow(
                      Object.values(newSelectedRowsByGroup).flat()
                    );
                  },
                  onSelect: (record, selected) => {
                    const newSelectedRowsByGroup = { ...selectedRowsByGroup };

                    if (selected) {
                      // Tambahkan baris ke grup yang dipilih
                      newSelectedRowsByGroup[username] = [
                        ...(newSelectedRowsByGroup[username] || []),
                        record.key,
                      ];
                    } else {
                      // Hapus baris dari grup yang dipilih
                      newSelectedRowsByGroup[username] = (
                        newSelectedRowsByGroup[username] || []
                      ).filter((key) => key !== record.key);
                    }

                    // Perbarui state untuk grup dan semua baris yang dipilih
                    setSelectedRowsByGroup(newSelectedRowsByGroup);
                    setSelectedRow(
                      Object.values(newSelectedRowsByGroup).flat()
                    );
                  },
                  onSelectAll: (selected, selectedRows) => {
                    const newSelectedRowsByGroup = { ...selectedRowsByGroup };

                    if (selected) {
                      // Pilih semua baris dalam grup
                      newSelectedRowsByGroup[username] = selectedRows.map(
                        (row) => row.key
                      );
                    } else {
                      // Hapus semua pilihan dari grup
                      delete newSelectedRowsByGroup[username];
                    }

                    // Perbarui state untuk grup dan semua baris yang dipilih
                    setSelectedRowsByGroup(newSelectedRowsByGroup);
                    setSelectedRow(
                      Object.values(newSelectedRowsByGroup).flat()
                    );
                  },
                }}
                loading={isPending}
                dataSource={groupedOrders[username]}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ pageSize: 10 }}
              />
            </Form>
          </div>
        ))}
      </Flex>

      <Modal
        title="Invoice"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => setIsModalOpen(false)}
          >
            Ok
          </Button>,
        ]}
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
