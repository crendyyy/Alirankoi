import { AlipayCircleOutlined, AlipayOutlined, BankOutlined } from "@ant-design/icons";
import { Button, Flex, Form, InputNumber, Switch, Table } from "antd";
import Title from "antd/es/typography/Title";
import { formatRupiah } from "../../libs/utils";

const EditCard = ({
  typePayment,
  stock,
  price,
  onUpdateStock,
  onAddStock,
  onUpdatePrice,
  formUpdateStock,
  formAddStock,
  formUpdatePrice,
}) => {
  return (
    <Flex gap={24} vertical>
      <h1 className="font-bold text-2xl flex gap-2 items-center">
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
              <Title level={3}>¥ {stock}</Title>
            </div>
            <div className="flex flex-col w-full">
              {/* Amount to Add */}
              <Form className="w-full" layout="vertical" form={formAddStock} onFinish={onAddStock} initialValues={{ remember: true }}>
                <div className="flex items-end">
                  <Form.Item name="addStock" className="w-full" label="Amount to add">
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
                </div>
              </Form>

              {/* Amount to Update */}
              <Form className="w-full" layout="vertical" form={formUpdateStock} onFinish={onUpdateStock} initialValues={{ remember: true }}>
                <Flex gap="small" align="end">
                  <Form.Item name="updateStock" className="w-full" label="Amount to update">
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
        <div className="flex flex-col w-full justify-between gap-6">
          <div className="flex flex-row w-full gap-6 p-6 bg-white rounded-lg h-1/2">
            <div className="w-1/2 rounded-xl flex flex-col gap-0.5">
              <span className="text-sm">Price Buy {typePayment}</span>
              <Title level={3}>{formatRupiah(price)}</Title>
            </div>
            <Flex vertical className="w-full">
              <Form className="w-full" layout="vertical" form={formUpdatePrice} onFinish={onUpdatePrice} initialValues={{ remember: true }}>
                <Flex gap="small" align="end">
                  <Form.Item name="updatePrice" className="w-full">
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
              <Title level={3}>{formatRupiah(price)}</Title>
            </div>
            <div className="flex w-full">
              <Form className="w-full" layout="vertical" form={formUpdatePrice} onFinish={onUpdatePrice} initialValues={{ remember: true }}>
                <Flex gap="small" align="end">
                  <Form.Item name="updatePrice" className="w-full">
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
