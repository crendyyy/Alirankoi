import { useContext, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { PlusCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Form, InputNumber, Modal, Switch, Table } from "antd";
import Title from "antd/es/typography/Title";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import ExcelJS from "exceljs";
import { useNavigate } from "react-router";
import EditCard from "../components/dashboard/EditCard";
import DashboardTable from "../components/dashboard/DashboardTable";
import { useGetStock } from "../components/service/stock/useGetStock";

import { useOpenStatus, useSeperateStatus } from "../components/service/admin/useAdminService";
import { useUpdateStock, useUpdateStockPlus } from "../components/service/admin/useUpdateStock";
import { useUpdatePrice } from "../components/service/admin/useUpdatePrice";
import { useGetOrders } from "../components/service/admin/orders/useGetOrders";
import dayjs from "dayjs";
import PrintModal from "../components/modal/PrintModal";
import FileSaver from "file-saver";
import LogoutButton from "../components/shared/LogoutButton";

import { AuthContext } from "../context/AuthContext";
import { useGetTes } from "../components/service/tes/useGetTest";
import { formatRupiah } from "../libs/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  console.log(useGetTes());

  const { logout } = useContext(AuthContext);

  const [formUpdateStock] = Form.useForm();
  const [formAddStock] = Form.useForm();
  const [formUpdatePrice] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);

  const printAreaRef = useRef();

  const { data: stock, isPending: isStockPending, isError: isStockError } = useGetStock();
  const { data: orders, isPending, isError } = useGetOrders();

  // orders?.payload.map((data) => {
  //   console.log(data);
  // });

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

  const handleOnPrint = useReactToPrint({
    content: () => printAreaRef.current,
  });

  const labels = ["January", "February", "March", "April", "May", "June", "July"];

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
      render: (text, record, index) => <span className="text-sm font-normal">{index + 1}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text, record) => {
        // Display the full Date string if not editing
        return <span>{new Date(record.createdAt).toString()}</span>;
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
  const hargaJual = stock?.payload[0].bank_sell_price;
  const hargaBeli = stock?.payload[0].bank_buy_price;
  const profit = hargaJual - hargaBeli;
  const data =
    orders?.payload
      .filter((order) => dayjs(order.createdAt).isSame(today, "day"))
      .map((order) => ({
        key: order.id,
        hargaBeli: hargaBeli,
        hargaJual: formatRupiah(hargaJual),
        profit: profit * order.amount,
        subtotal: formatRupiah(hargaJual * order.amount),
        ...order,
      })) || [];

  const generateExcekFile = async (rowToSave) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    const dashboardColums = [
      {
        label: "Date",
        key: "createdAt",
      },
      {
        label: "Amount",
        key: "amount",
      },
      {
        label: "Bank Number",
        key: "bank_number",
      },
      {
        label: "Bank Name",
        key: "bank_detail",
      },
      {
        label: "Bank Branch",
        key: "bank_branch",
      },
      {
        label: "Account Name",
        key: "account_name",
      },
      {
        label: "Harga Jual",
        key: "hargaJual",
      },
      {
        label: "Harga Modal",
        key: "hargaBeli",
      },
      {
        label: "Profit/Margin",
        key: "profit",
      },
      {
        label: "Subtotal",
        key: "subtotal",
      },
    ];

    const columns = dashboardColums.map((col) => ({
      name: col.label,
      filterButton: true,
    }));
    worksheet.addTable({
      name: "Table1",
      ref: "A1",
      headerRow: true,
      style: {
        theme: "TableStyleLight8",
        showRowStripes: true,
      },
      columns: columns,
      rows: rowToSave.map((row) => {
        return dashboardColums.map((col) => row[col.key]);
      }),
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  };

  const handelSaveExcel = async () => {
    const buffer = await generateExcekFile(selectedRow);
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, `${today}.xlsx`);
  };

  return (
    <Flex vertical gap={35}>
      <PrintModal
        isOpen={isModalOpen}
        onCancel={handleCloseModal}
        selectedRow={selectedRow}
        printAreaRef={printAreaRef}
        onConfirm={handleOnPrint}
      />
      <div className="flex justify-between items-start">
        <Flex vertical gap={4}>
          <Title style={{ margin: 0 }} level={2}>
            Admin
          </Title>
          <Title style={{ margin: 0 }} level={2}>
            Dashboard
          </Title>
        </Flex>
        <LogoutButton onClick={logout} />
      </div>
      <Flex justify="space-between" className="mt-5">
        <div className="flex gap-2">
          <button onClick={() => navigate("/register")} className="rounded-xl py-2 px-4 text-white bg-primary flex items-center gap-2">
            <UserAddOutlined className="text-lg" />
            Add User
          </button>
          {/* BUTTON MANUAL ORDER */}
          <button onClick="" className="rounded-xl bg-black py-2 px-4 text-white flex items-center gap-2">
            <PlusCircleOutlined className="text-lg" />
            Manual Order
          </button>
        </div>
        <Flex gap={24}>
          <div className="flex items-center h-full gap-4 px-4 py-2 bg-white rounded-xl">
            <Title level={5} style={{ margin: 0 }}>
              Separate Mode
            </Title>
            <Switch checked={stock?.payload[0].separateMode} onChange={onSeperate} />
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
          stock={`${!isStockPending ? stock?.payload[0].bank_stock : "-"}`}
          price={`${!isStockPending ? stock?.payload[0].price : "-"}`}
        />
      ))}
      <DashboardTable
        columns={columns}
        setSelectedRow={setSelectedRow}
        data={data}
        handleSaveExcel={handelSaveExcel}
        isLoading={isPending}
        onOpenModal={handleOpenModal}
        price={stock?.payload[0].bank_sell_price}
        capitalPrice={hargaBeli}
      />
    </Flex>
  );
};
export default Dashboard;
