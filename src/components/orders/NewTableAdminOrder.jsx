import { Button, Modal, Table } from "antd";
import React, { useState } from "react";
import { useGetOrders } from "../service/admin/useGetOrders";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  PrinterOutlined,
} from "@ant-design/icons";
import Status from "../shared/Status";

const NewTableAdminOrder = () => {
  const dataSource = [];
  const { data: orders, isPending, isError } = useGetOrders();
  isPending || isError
    ? "loading"
    : orders.payload.map((data, index) => {
        dataSource.push({
          key: data.id,
          no: index + 1,
          date: data.createdAt.slice(0, 10),
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
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Bank Number",
      dataIndex: "bankNumber",
      key: "bankNumber",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "Bank Branch",
      dataIndex: "bankBranch",
      key: "bankBranch",
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      render: (text, record, index) => (
        <a
          type="primary"
          onClick={showModal}
          className="w-fit text-xs underline text-primary"
        >
          See Invoice
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 25,
      render: (text, record, index) => <Status status={record.status} />,
    },
    {
      title: "Actions",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 bg-primary rounded-md text-white">
              <EditOutlined />
            </button>
            <button
              className="px-2 py-1 bg-red-500 rounded-md text-white"
              onClick={showConfirm}
              type="dashed"
            >
              <DeleteOutlined />
            </button>
          </div>
        );
      },
    },
  ];

  // rowSelection
  const [selectionType, setSelectionType] = useState("checkbox");
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  return (
    <div>
      <div className="flex flex-col p-3 bg-white rounded-lg mt-7">
        <div className="flex items-center justify-between">
          <h1 className="mt-3 mb-8 ml-5 text-lg font-semibold">
            {/* {orders.payload.map((data) => data.user_id.username)} */}
            User ID 1
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
        <Table
          dataSource={dataSource}
          columns={columns}
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
        />
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <img src={`/`} alt="Invoice" width="500" height="600" />
        </Modal>
      </div>
    </div>
  );
};

export default NewTableAdminOrder;
