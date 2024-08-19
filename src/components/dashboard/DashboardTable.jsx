import { PrinterOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Form, InputNumber, Switch, Table } from "antd";
import Title from "antd/es/typography/Title";

const DashboardTable = ({ columns, data, isLoading, price }) => {
  const Fotter = () => {
    return (
      <Flex justify="space-between">
        <span className="text-xs font-medium">
          Total amount:{" "}
          <span className="text-xs font-bold">
            {data && data.reduce((acc, item) => acc + Number(item.amount), 0)}
          </span>
        </span>
        <span className="text-xs font-medium">
          Total Profit/Margin:{" "}
          <span className="text-xs font-bold">
            {data && data.reduce((acc, item) => acc + item.profit, 0)}
          </span>
        </span>
      </Flex>
    );
  };
  console.log(data);

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
              <span className="text-xl font-bold text-red-700">{price}</span>
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
