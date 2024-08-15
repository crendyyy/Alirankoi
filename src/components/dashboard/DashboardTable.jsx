import { PrinterOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Form, InputNumber, Switch, Table } from "antd";
import Title from "antd/es/typography/Title";

const DashboardTable = () => {
  const columns = [
    {
      title: "#",
      dataIndex: "no",
      width: 12,
      render: (text, record, index) => (
        <span className="text-sm font-normal">{index + 1}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      editable: true,
      render: (text, record) => (
        <span className="flex flex-col gap-1 text-sm font-normal">
          <span className="font-medium">Mon Aug 2024 14:37:16</span>
          <span className="text-[#687182] font-light text-xs block">
            GMT+0700 (Western Indonesia Time)
          </span>
        </span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Bank Number",
      dataIndex: "bankNumber",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
    },
    {
      title: "Bank Branch",
      dataIndex: "bankBranch",
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
    },
    {
      title: "Harga Jual",
      dataIndex: "hargaJual",
    },
    {
      title: "Harga Beli",
      dataIndex: "hargaBeli",
    },
    {
      title: "Profit/Margin",
      dataIndex: "profit",
    },
  ];
  const data = [];

  for (let i = 0; i < 16; i++) {
    data.push({
      key: i.toString(),
      bankNumber: `${i}`,
      date: "",
      bankName: `Nama Bank ${i}`,
      bankBranch: `Bank Branch ${i}`,
      accountName: `Account Name ${i}`,
      status: `Success`,
      amount: 1000,
      hargaJual: 2500,
      hargaBeli: 2000,
      profit: 500,
    });
  }

  const Fotter = () => {
    return (
      <Flex justify="space-between">
        <span className="text-xs font-medium">Total amount: <span className="text-xs font-bold">{data.reduce((acc, item) => acc + item.amount, 0)}</span></span>
        <span className="text-xs font-medium">Total Profit/Margin: <span className="text-xs font-bold">{data.reduce((acc, item) => acc + item.profit, 0)}</span></span>
      </Flex>
    );
  };

  // rowSelection object indicates the need for row selection
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
    <>
      <Flex vertical>
        <div className="bg-[#fafafa] border-b-2 border-solid border-gray-100 z-10 rounded-t-lg p-6 pb-8 flex justify-between items-start relative -bottom-2">
          <Flex gap={16}>
            <div className="flex flex-col items-center justify-center gap-1 px-6 py-3 bg-green-100 rounded-lg">
              <span className="text-base font-semibold text-green-700">
                Harga Modal
              </span>
              <span className="text-xl font-bold text-green-700">Rp 2.200</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 px-6 py-3 bg-red-100 rounded-lg">
              <span className="text-base font-semibold text-red-700">
                Harga jual
              </span>
              <span className="text-xl font-bold text-red-700">Rp 2.500</span>
            </div>
          </Flex>
          <Flex gap={16}>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              className="bg-gray-500 border border-gray-400 hover:!bg-gray-600"
            >
              Print
            </Button>
            <Button type="primary">Export to Excel</Button>
          </Flex>
        </div>
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          footer={ Fotter}
        />
      </Flex>
    </>
  );
};
export default DashboardTable;
