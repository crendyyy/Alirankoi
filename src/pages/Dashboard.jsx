import { UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Form, InputNumber, Switch, Table } from "antd";
import Title from "antd/es/typography/Title";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Ali",
        data: labels.map(() => Math.floor(Math.random() * 1000) + 1),
        backgroundColor: "#1367FF",
      },
      {
        label: "Bank",
        data: labels.map(() => Math.floor(Math.random() * 1000) + 1),
        backgroundColor: "#464646",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1000,
        type: "linear",
      },
    },
  };

  const onSeperate = (checked) => {
    console.log(checked);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
  ];
  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
    },
    {
      key: "4",
      name: "Disabled User",
      age: 99,
      address: "Sydney No. 1 Lake Park",
    },
  ];

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
    <Flex vertical gap={40}>
      <Flex vertical gap={4}>
        <Title style={{ margin: 0 }} level={2}>
          Admin
        </Title>
        <Title style={{ margin: 0 }} level={2}>
          Dashboard
        </Title>
      </Flex>
      <Flex justify="space-between">
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          className="rounded-xl w-36"
        >
          Add User
        </Button>
        <Flex gap={24}>
          <div className="flex items-center h-full gap-4 px-4 py-2 bg-white rounded-xl">
            <Title level={5} style={{ margin: 0 }}>
              Separate Mode
            </Title>
            <Switch defaultChecked onChange={onSeperate} />
          </div>
          <div className="flex items-center h-full gap-4 px-4 py-2 bg-white rounded-xl">
            <Title level={5} style={{ margin: 0 }}>
              Open Status
            </Title>
            <Switch defaultChecked onChange={onSeperate} />
          </div>
        </Flex>
      </Flex>
      <div className="p-6 bg-white rounded-lg">
        <Title level={4}>Buy Bank/Ali Chart</Title>
        <Bar data={chartData} options={options} />
      </div>
      <Flex gap={24} vertical>
        <Title level={3}>Buy Bank</Title>
        <Flex gap={24}>
          <div className="flex flex-col w-full gap-6 p-6 bg-white rounded-lg">
            <Title level={4} style={{ margin: 0 }}>
              Main Stock Bank
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
              Price Bank
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
      <Flex gap={24} vertical>
        <Title level={3}>Buy Ali</Title>
        <Flex gap={24}>
          <div className="flex flex-col w-full gap-6 p-6 bg-white rounded-lg">
            <Title level={4} style={{ margin: 0 }}>
              Main Stock Ali
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
              Price Ali
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
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
      />
    </Flex>
  );
};
export default Dashboard;
