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
import { useGetStock } from "../components/service/stock/useGetStock";

import {
  useOpenStatus,
  useSeperateStatus,
} from "../components/service/admin/useAdminService";
import {
  useUpdateStock,
  useUpdateStockPlus,
} from "../components/service/admin/useUpdateStock";
import { useUpdatePrice } from "../components/service/admin/useUpdatePrice";
import { useGetOrders } from "../components/service/admin/orders/useGetOrders";
import dayjs from "dayjs";
import PrintModal from "../components/modal/PrintModal";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const [formUpdateStock] = Form.useForm();
  const [formAddStock] = Form.useForm();
  const [formUpdatePrice] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);

  const printAreaRef = useRef()

  const {
    data: stock,
    isPending: isStockPending,
    isError: isStockError,
  } = useGetStock();
  const { data: orders, isPending, isError } = useGetOrders();

  const openStatusMutation = useOpenStatus();

  const seperateStatusMutation = useSeperateStatus();

  const updatePriceMutation = useUpdatePrice();

  const updateStockMutation = useUpdateStock();

  const updateStockPlusMutation = useUpdateStockPlus();

  const navigate = useNavigate();

  const typePayment = ["Bank", "Ali"];

  const handleUpdatePrice = (values) => {
    updatePriceMutation.mutate({ price: values.updatePrice });
    formUpdatePrice.resetFields();
  };

  const handleUpdateStock = (values) => {
    updateStockMutation.mutate({ stock: values.updateStock });
    formUpdateStock.resetFields();
  };

  const handleUpdateStockPlus = (values) => {
    updateStockPlusMutation.mutate({ stock: values.addStock });
    formAddStock.resetFields();
  };

  const onSeperate = () => {
    seperateStatusMutation.mutate();
  };

  const onOpenStatus = () => {
    openStatusMutation.mutate();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOnPrint = useReactToPrint({content: () => printAreaRef.current})

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
        data: orders?.payload.map((order) => order.amount),
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
      dataIndex: "createdAt",
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

  const today = dayjs().startOf("day");
  const hargaJual = stock?.payload[0].price;
  const hargaBeli = 2000;
  const profit = hargaJual - hargaBeli;
  const data =
    orders?.payload
      .filter((order) => dayjs(order.createdAt).isSame(today, "day"))
      .map((order) => ({
        key: order.id,
        hargaBeli: hargaBeli,
        hargaJual: hargaJual,
        profit: profit * order.amount,
        subtotal: hargaJual * order.amount,
        ...order,
      })) || [];

  console.log(data);

  return (
    <Flex vertical gap={40}>
      <PrintModal
        isOpen={isModalOpen}
        onCancel={handleCloseModal}
        selectedRow={selectedRow}
        printAreaRef={printAreaRef}
        onConfirm={handleOnPrint}
      />
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
          onClick={() => navigate("/register")}
          className="rounded-xl w-36"
        >
          Add User
        </Button>
        <Flex gap={24}>
          <div className="flex items-center h-full gap-4 px-4 py-2 bg-white rounded-xl">
            <Title level={5} style={{ margin: 0 }}>
              Separate Mode
            </Title>
            <Switch
              checked={stock?.payload[0].separateMode}
              onChange={onSeperate}
            />
          </div>
          <div className="flex items-center h-full gap-4 px-4 py-2 bg-white rounded-xl">
            <Title level={5} style={{ margin: 0 }}>
              Open Status
            </Title>
            <Switch checked={stock?.payload[0].open} onChange={onOpenStatus} />
          </div>
        </Flex>
      </Flex>
      <div className="p-6 bg-white rounded-lg">
        <Title level={4}>Buy Bank/Ali Chart</Title>
        <Bar data={chartData} options={options} />
      </div>
      {typePayment.map((type) => (
        <EditCard
          key={type}
          typePayment={type}
          formAddStock={formAddStock}
          formUpdatePrice={formUpdatePrice}
          formUpdateStock={formUpdateStock}
          onUpdateStock={handleUpdateStock}
          onAddStock={handleUpdateStockPlus}
          onUpdatePrice={handleUpdatePrice}
          stock={`${!isStockPending ? stock?.payload[0].stock : "-"}`}
          price={`${!isStockPending ? stock?.payload[0].price : "-"}`}
        />
      ))}
      <DashboardTable
        columns={columns}
        setSelectedRow={setSelectedRow}
        data={data}
        isLoading={isPending}
        onOpenModal={handleOpenModal}
        price={stock?.payload[0].price}
      />
    </Flex>
  );
};
export default Dashboard;
