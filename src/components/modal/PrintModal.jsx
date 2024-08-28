import { Modal, Table } from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { formatRupiah } from "../../libs/utils";

const PrintModal = ({
  isOpen,
  onConfirm,
  onCancel,
  selectedRow,
  printAreaRef,
  typeModal,
}) => {
  console.log(typeModal);
  const columnsDashboard = [
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Harga Jual",
      dataIndex: "selling_price",
    },
    {
      title: "Harga Modal",
      dataIndex: "buying_price",
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

  const columnsOrders = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        // Display the full Date string if not editing
        return <span>{new Date(record.date).toString()}</span>;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Bank Number",
      dataIndex: "bank_number",
    },
    {
      title: "Bank Name",
      dataIndex: "bank_detail",
    },
    {
      title: "Bank Branch",
      dataIndex: "bank_branch",
    },
    {
      title: "Account Name",
      dataIndex: "account_name",
    },
  ];

  const columns =
    typeModal === "printPageOrders" ? columnsOrders : columnsDashboard;

  const data = selectedRow.map((order) => ({
    key: order.id,
    date: dayjs(order.date),
    ...order,
  }));
  const handleConfirm = () => {
    onConfirm();
  };
  return (
    <Modal
      open={isOpen}
      onOk={handleConfirm}
      onCancel={onCancel}
      width={typeModal === "printPageOrders" ? 700 : "fit-content"}
    >
      <div ref={printAreaRef} className="flex flex-col gap-6 ">
        <Title level={3}>Nama Pelanggan</Title>
        <Table columns={columns} dataSource={data} pagination={false} />
        <div className="flex items-center justify-between w-full ">
          <Title level={4}>
            {typeModal === "printPageOrders"
              ? "Total Amount"
              : "Total Transaksi"}
          </Title>
          <Title level={4}>
            {typeModal === "printPageOrders"
              ? selectedRow.reduce(
                  (total, transaction) => total + Number(transaction.amount),
                  0
                )
              : formatRupiah(
                  selectedRow.reduce(
                    (total, transaction) => total + transaction.subtotal,
                    0
                  )
                )}
          </Title>
        </div>
      </div>
    </Modal>
  );
};
export default PrintModal;
