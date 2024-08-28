import { EyeOutlined, PrinterOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Form, InputNumber, Switch, Table } from "antd";
import Title from "antd/es/typography/Title";
import { formatRupiah } from "../../libs/utils";

const DashboardTable = ({ columns, data, isLoading, price, onOpenModal, setSelectedRow, handleSaveExcel, capitalPrice, typePayment }) => {
  console.log(data);
  const Fotter = () => {
    return (
      <Flex justify="space-between">
        <span className="text-xs font-medium">
          Total amount:{" "}
          <span className="text-xs font-bold">{formatRupiah(data && data.reduce((acc, item) => acc + Number(item.amount), 0), false)}</span>
        </span>
        <span className="text-xs font-medium">
          Total Profit/Margin:{" "}
          <span className="text-xs font-bold">{formatRupiah(data && data.reduce((acc, item) => acc + item.profit, 0))}</span>
        </span>
      </Flex>
    );
  };

  const rowSelection = (selectedRowKeys, selectedRows) => {
    setSelectedRow(selectedRows);
  };
  return (
    <>
      <Flex vertical>
        <Title level={4}>Buy {typePayment} Order</Title>
        <div className="bg-white z-10 rounded-t-lg p-6 pb-8 flex justify-between items-start relative -bottom-2">
          <Flex gap={16}>
            <div className="flex items-center justify-center gap-4 px-6 py-3 bg-green-100 rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-green-700">Harga Modal</span>
                <span className="text-xl font-bold text-green-700">{formatRupiah(capitalPrice)}</span>
              </div>
              <span className="w-0.5 h-3/5 bg-[#15803D]"></span>
              {/* Button Eye Hidden Feature */}
              <button className="flex bg-[#15803D] py-2 px-4 rounded-2xl">
                <EyeOutlined className="text-2xl text-white" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 px-6 py-3 bg-red-100 rounded-lg">
              <span className="text-sm font-medium text-red-700">Harga jual</span>
              <span className="text-xl font-bold text-red-700">{formatRupiah(price)}</span>
            </div>
          </Flex>
          <Flex gap={16}>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              className="bg-gray-500 border border-gray-400 hover:!bg-gray-600"
              onClick={onOpenModal}
            >
              Print
            </Button>
            <Button type="primary" onClick={handleSaveExcel}>
              Export to Excel
            </Button>
          </Flex>
        </div>
        <Table
          className="table-order-admin bg-white rounded-lg"
          rowSelection={{
            type: "checkbox",
            onChange: rowSelection,
          }}
          loading={isLoading}
          columns={columns}
          dataSource={data}
          footer={Fotter}
        />
      </Flex>
    </>
  );
};
export default DashboardTable;
