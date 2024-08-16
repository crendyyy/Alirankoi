import { Button, Flex, Form, InputNumber, Switch, Table } from "antd";
import Title from "antd/es/typography/Title";

const EditCard = ({typePayment}) => {
  return (
    <Flex gap={24} vertical>
      <Title level={3}>Buy {typePayment}</Title>
      <Flex gap={24}>
        <div className="flex flex-col w-full gap-6 p-6 bg-white rounded-lg">
          <Title level={4} style={{ margin: 0 }}>
            Main Stock {typePayment}
          </Title>
          <div className="w-1/2 p-4 bg-gray-100 rounded-xl flex flex-col gap-0.5">
            <span className="text-sm">Stock</span>
            <Title level={3}>¥11.631</Title>
          </div>
          <Flex vertical>
            <Form
              className="w-full"
              layout="vertical"
              name="add amount"
              initialValues={{ remember: true }}
            >
              <Flex gap="small" align="end">
                <Form.Item
                  name={"add amount"}
                  className="w-full"
                  label="Amount to add"
                >
                  <InputNumber
                    placeholder="-"
                    className="flex items-center w-full h-11"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    className="w-24 h-11"
                    htmlType="submit"
                  >
                    Add
                  </Button>
                </Form.Item>
              </Flex>
            </Form>

            <Form
              className="w-full"
              layout="vertical"
              name="add amount"
              initialValues={{ remember: true }}
            >
              <Flex gap="small" align="end">
                <Form.Item
                  name={"add amount"}
                  className="w-full"
                  label="Amount to update"
                >
                  <InputNumber
                    placeholder="-"
                    className="flex items-center w-full h-11"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    className="w-24 h-11"
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Flex>
            </Form>
          </Flex>
        </div>
        <div className="flex flex-col w-full gap-6 p-6 bg-white rounded-lg">
          <Title level={4} style={{ margin: 0 }}>
            Price {typePayment}
          </Title>
          <div className="w-1/2 p-4 bg-gray-100 rounded-xl flex flex-col gap-0.5">
            <span className="text-sm">Price</span>
            <Title level={3}>Rp 2.215</Title>
          </div>
          <Flex vertical>
            <Form
              className="w-full"
              layout="vertical"
              name="add amount"
              initialValues={{ remember: true }}
            >
              <Flex gap="small" align="end">
                <Form.Item
                  name={"add amount"}
                  className="w-full"
                  label="Amount"
                >
                  <InputNumber
                    placeholder="-"
                    className="flex items-center w-full h-11"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    size="large"
                    className="h-11"
                    htmlType="submit"
                  >
                    Update
                  </Button>
                </Form.Item>
              </Flex>
            </Form>
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
};
export default EditCard;