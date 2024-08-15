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
import EditCard from "../components/dashboard/EditCard";
import DashboardTable from "../components/dashboard/DashboardTable";
import { useNavigate } from "react-router";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const typePayment = ["Bank", "Ali"];

  const navigate = useNavigate()

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
          onClick={() => navigate('/register')}
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
      {typePayment.map((type) => (
        <EditCard key={type} typePayment={type} />
      ))}
      <DashboardTable />
    </Flex>
  );
};
export default Dashboard;
