import { Modal, Table } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";

const PrintModal = ({ isOpen, onConfirm, onCancel, selectedRow }) => {
  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Harga Jual",
      dataIndex: "hargaJual",
    },
    {
      title: "Harga Modal",
      dataIndex: "hargaBeli",
    },
    {
      title: "Profit/Margin",
      dataIndex: "profit",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
    },
  ];

  const data = selectedRow.map((order) => ({
    key: order.id,
    ...order,
  }));
  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <Modal open={isOpen} onOk={handleConfirm} onCancel={onCancel}>
      <div className="flex flex-col gap-6 ">
        <Title level={3}>Nama Pelanggan</Title>
        <Table columns={columns} dataSource={data} />
        <div className="flex items-center justify-between w-full ">
          <Title level={4}>Total Penjualan</Title>
          <Title level={4}>10000</Title>
        </div>
      </div>
    </Modal>
  );
};
export default PrintModal;
