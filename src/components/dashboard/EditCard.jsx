import { AlipayCircleOutlined, AlipayOutlined, BankOutlined } from "@ant-design/icons";
import { Button, Flex, Form, InputNumber, Switch, Table } from "antd";
import Title from "antd/es/typography/Title";
import { formatRupiah } from "../../libs/utils";

const EditCard = ({
  typePayment,
  stockBank,
  stockAli,
  priceBank,
  priceAli,
  capitalPriceBank,
  capitalPriceAli,
  onUpdateStockBank,
  onUpdateStockAli,
  onAddStockBank,
  onAddStockAli,
  onUpdatePriceBank,
  onUpdatePriceAli,
  onUpdateCapitalPriceBank,
  onUpdateCapitalPriceAli,
  formUpdateStockBank,
  formUpdateStockAli,
  formAddStockBank,
  formAddStockAli,
  formUpdatePriceBank,
  formUpdatePriceAli,
  formUpdateCapitalPriceBank,
  formUpdateCapitalPriceAli,
}) => {
  return (
    <Flex gap={24} vertical>
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        {typePayment == "Bank" ? <BankOutlined /> : <AlipayOutlined />} Buy {typePayment}
      </h1>
      <Flex gap={24}>
        <div className="flex flex-col w-full gap-6 p-6 bg-white rounded-lg">
          <Title level={4} style={{ margin: 0 }}>
            Main Stock {typePayment}
          </Title>
          <div className="flex">
            <div className="rounded-xl flex flex-col w-1/2 gap-0.5">
              <span className="text-sm">Stock</span>
              <Title level={3}>¥ {typePayment == "Bank" ? stockBank : stockAli}</Title>
            </div>
            <div className="flex flex-col w-full">
              {/* Amount to Add */}
              <Form
                className="w-full"
                layout="vertical"
                form={typePayment == "Bank" ? formAddStockBank : formAddStockAli}
                onFinish={typePayment == "Bank" ? onAddStockBank : onAddStockAli}
                initialValues={{ remember: true }}
              >
                <Flex gap="small" align="end">
                  <Form.Item name={`${typePayment == "Bank" ? "addStockBank" : "addStockAli"}`} className="w-full" label="Amount to add">
                    <InputNumber
                      placeholder="Enter Price"
                      min={0}
                      className="bg-[#F7F9FC] w-full placeholder:text-[#B3B8D0] text-sm p-2 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" className="w-24 h-11 bg-primary" htmlType="submit">
                      Update
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>

              {/* Amount to Update */}
              <Form
                className="w-full"
                layout="vertical"
                form={typePayment == "Bank" ? formUpdateStockBank : formUpdateStockAli}
                onFinish={typePayment == "Bank" ? onUpdateStockBank : onUpdateStockAli}
                initialValues={{ remember: true }}
              >
                <Flex gap="small" align="end">
                  <Form.Item
                    name={`${typePayment == "Bank" ? "updateStockBank" : "updateStockAli"}`}
                    className="w-full"
                    label="Amount to update"
                  >
                    <InputNumber
                      placeholder="Enter Price"
                      min={0}
                      className="bg-[#F7F9FC] w-full placeholder:text-[#B3B8D0] text-sm p-2 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" className="w-24 h-11 bg-primary" htmlType="submit">
                      Update
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            </div>
          </div>
        </div>

        {/* Buy */}
        <div className="flex flex-col justify-between w-full gap-6">
          <div className="flex flex-row w-full gap-6 p-6 bg-white rounded-lg h-1/2">
            <div className="w-1/2 rounded-xl flex flex-col gap-0.5">
              <span className="text-sm">Price Buy {typePayment}</span>
              <Title level={3}>{formatRupiah(`${typePayment == "Bank" ? priceBank : priceAli}`)}</Title>
            </div>
            <Flex vertical className="w-full">
              <Form
                className="w-full"
                layout="vertical"
                form={typePayment == "Bank" ? formUpdatePriceBank : formUpdatePriceAli}
                onFinish={typePayment == "Bank" ? onUpdatePriceBank : onUpdatePriceAli}
                initialValues={{ remember: true }}
              >
                <Flex gap="small" align="end">
                  <Form.Item name={`${typePayment == "Bank" ? "updatePriceBank" : "updatePriceAli"}`} className="w-full">
                    <InputNumber
                      placeholder="Enter to Update Price"
                      min={0}
                      className="bg-[#F7F9FC] w-full placeholder:text-[#B3B8D0] text-sm p-2 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" className="h-11 bg-primary" htmlType="submit">
                      Update
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            </Flex>
          </div>

          <div className="flex flex-row w-full gap-6 p-6 bg-white rounded-lg h-1/2">
            <div className="w-1/2 rounded-xl flex flex-col gap-0.5">
              <span className="text-sm">Captal Price {typePayment}</span>
              <Title level={3}>{formatRupiah(`${typePayment == "Bank" ? capitalPriceBank : capitalPriceAli}`)}</Title>
            </div>
            <div className="flex w-full">
              <Form
                className="w-full"
                layout="vertical"
                form={typePayment == "Bank" ? formUpdateCapitalPriceBank : formUpdateCapitalPriceAli}
                onFinish={typePayment == "Bank" ? onUpdateCapitalPriceBank : onUpdateCapitalPriceAli}
                initialValues={{ remember: true }}
              >
                <Flex gap="small" align="end">
                  <Form.Item name={`${typePayment == "Bank" ? "updatePriceCapitalBank" : "updatePriceCapitalAli"}`} className="w-full">
                    <InputNumber
                      placeholder="Enter to Update Price"
                      min={0}
                      className="bg-[#F7F9FC] w-full placeholder:text-[#B3B8D0] text-sm p-2 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" className="h-11 bg-primary" htmlType="submit">
                      Update
                    </Button>
                  </Form.Item>
                </Flex>
              </Form>
            </div>
          </div>
        </div>
      </Flex>
    </Flex>
  );
};
export default EditCard;
