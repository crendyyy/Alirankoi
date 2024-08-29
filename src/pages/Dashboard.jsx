import { useContext, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { PlusCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Flex, Form, InputNumber, Modal, Switch, Table } from "antd";
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
import ExcelJS from "exceljs";
import { useNavigate } from "react-router";
import EditCard from "../components/dashboard/EditCard";
import DashboardTable from "../components/dashboard/DashboardTable";
import { useGetStock } from "../components/service/stock/useGetStock";

import {
  useOpenStatus,
  useSeperateStatus,
} from "../components/service/admin/useAdminService";
import {
  useUpdateStock,
  useUpdateStockPlus,
} from "../components/service/admin/useUpdateStock";
import {
  useUpdateBuyPrice,
  useUpdatePrice,
} from "../components/service/admin/useUpdatePrice";
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
  const { logout } = useContext(AuthContext);

  const [formUpdateStockBank] = Form.useForm();
  const [formAddStockBank] = Form.useForm();
  const [formUpdatePriceBank] = Form.useForm();
  const [formUpdateCapitalPriceBank] = Form.useForm();

  const [formUpdateStockAli] = Form.useForm();
  const [formAddStockAli] = Form.useForm();
  const [formUpdatePriceAli] = Form.useForm();
  const [formUpdateCapitalPriceAli] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hideBuyPrice, setHideBuyPrice] = useState({ bank: true, ali: true });
  const [selectedRow, setSelectedRow] = useState([]);

  const printAreaRef = useRef();

  const {
    data: stock,
    isPending: isStockPending,
    isError: isStockError,
  } = useGetStock();
  const { data: orders, isPending, isError } = useGetOrders();

  // orders?.payload.map((data) => {
  //   console.log(data);
  // });

  const openStatusMutation = useOpenStatus();

  const seperateStatusMutation = useSeperateStatus();

  const updatePriceMutation = useUpdatePrice();

  const updateBuyPriceMutation = useUpdateBuyPrice();

  const updateStockMutation = useUpdateStock();

  const updateStockPlusMutation = useUpdateStockPlus();

  const navigate = useNavigate();

  const [typePayment, setTypePayment] = useState(["Bank", "Ali"]);

  const handleUpdatePriceBank = (values) => {
    updatePriceMutation.mutate({ bank_price: values.updatePriceBank });
    formUpdatePriceBank.resetFields();
  };

  const handleUpdatePriceAli = (values) => {
    updatePriceMutation.mutate({ ali_price: values.updatePriceAli });
    formUpdatePriceAli.resetFields();
  };

  const handleUpdateBuyPriceBank = (values) => {
    updateBuyPriceMutation.mutate({
      bank_buy_price: values.updatePriceCapitalBank,
    });
    formUpdateCapitalPriceBank.resetFields();
  };

  const handleUpdateBuyPriceAli = (values) => {
    updateBuyPriceMutation.mutate({
      ali_buy_price: values.updatePriceCapitalAli,
    });
    formUpdateCapitalPriceAli.resetFields();
  };

  const handleUpdateStockBank = (values) => {
    updateStockMutation.mutate({ bank_stock: values.updateStockBank });
    formUpdateStockBank.resetFields();
  };

  const handleUpdateStockAli = (values) => {
    updateStockMutation.mutate({ ali_stock: values.updateStockAli });
    formUpdateStockAli.resetFields();
  };

  const handleUpdateStockPlusBank = (values) => {
    updateStockPlusMutation.mutate({ bank_stock: values.addStockBank });
    formAddStockBank.resetFields();
  };

  const handleUpdateStockPlusAli = (values) => {
    updateStockPlusMutation.mutate({ ali_stock: values.addStockAli });
    formAddStockAli.resetFields();
  };

  const onSeperate = () => {
    seperateStatusMutation.mutate();
  };

  const onOpenStatus = () => {
    openStatusMutation.mutate();
  };

  // PRINT MODAL
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // QR MODAL
  const [isModalOpenQr, setIsModalOpenQr] = useState(false);
  const showModal = () => {
    setIsModalOpenQr(true);
  };
  const handleOk = () => {
    setIsModalOpenQr(false);
  };
  const handleCancel = () => {
    setIsModalOpenQr(false);
  };

  const handleHideBuyPriceBank = (prev) => {
    setHideBuyPrice((prevState) => ({ ...prevState, bank: !prev }));
  };

  const handleHideBuyPriceAli = (prev) => {
    setHideBuyPrice((prevState) => ({ ...prevState, ali: !prev }));
  };

  const handleOnPrint = useReactToPrint({
    content: () => printAreaRef.current,
  });

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

  const columnsBank = [
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
      dataIndex: "selling_price",
    },
    ...(hideBuyPrice.bank
      ? []
      : [
          {
            title: "Harga Modal",
            dataIndex: "buying_price",
          },
        ]),
    {
      title: "Profit/Margin",
      dataIndex: "profit",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
    },
  ];

  const columnsAli = [
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
      title: "Nomor/Email",
      dataIndex: "ali_number_or_email",
    },
    {
      title: "Name",
      dataIndex: "ali_name",
    },
    {
      title: "Qr Code",
      dataIndex: "ali_qr",
      render: (_, record) => (
        <a onClick={showModal} className="text-xs underline w-fit text-primary">
          See QR Code
        </a>
      ),
    },
    {
      title: "Harga Jual",
      dataIndex: "selling_price",
    },
    ...(hideBuyPrice.ali
      ? []
      : [
          {
            title: "Harga Modal",
            dataIndex: "buying_price",
          },
        ]),
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
  console.log(stock);
  const dataBank =
    orders?.payload
      .filter((order) => order.order_type === "Bank")
      .map((order) => ({
        key: order.id,
        profit:
          (order.selling_price - order.buying_price) * Number(order.amount),
        subtotal: order.selling_price * Number(order.amount),
        ...order,
      })) || [];

  const dataAli =
    orders?.payload
      .filter((order) => dayjs(order.createdAt).isSame(today, "day"))
      .filter((order) => order.order_type === "Alipay")
      .map((order) => ({
        key: order.id,
        profit:
          (order.selling_price - order.buying_price) * Number(order.amount),
        subtotal: order.selling_price * Number(order.amount),
        ...order,
      })) || [];

  console.log(dataBank);
  console.log(dataAli);

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
      <div className="flex items-start justify-between">
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
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-xl bg-primary"
          >
            <UserAddOutlined className="text-lg" />
            Add User
          </button>
          {/* BUTTON MANUAL ORDER */}
          <button
            onClick=""
            className="flex items-center gap-2 px-4 py-2 text-white bg-black rounded-xl"
          >
            <PlusCircleOutlined className="text-lg" />
            Manual Order
          </button>
        </div>
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
          formAddStockBank={formAddStockBank}
          formAddStockAli={formAddStockAli}
          formUpdatePriceBank={formUpdatePriceBank}
          formUpdatePriceAli={formUpdatePriceAli}
          formUpdateStockBank={formUpdateStockBank}
          formUpdateStockAli={formUpdateStockAli}
          formUpdateCapitalPriceBank={formUpdateCapitalPriceBank}
          formUpdateCapitalPriceAli={formUpdateCapitalPriceAli}
          onUpdateStockBank={handleUpdateStockBank}
          onUpdateStockAli={handleUpdateStockAli}
          onAddStockBank={handleUpdateStockPlusBank}
          onAddStockAli={handleUpdateStockPlusAli}
          onUpdatePriceBank={handleUpdatePriceBank}
          onUpdatePriceAli={handleUpdatePriceAli}
          onUpdateCapitalPriceBank={handleUpdateBuyPriceBank}
          onUpdateCapitalPriceAli={handleUpdateBuyPriceAli}
          stockBank={`${!isStockPending ? stock?.payload[0].bank_stock : "-"}`}
          stockAli={`${!isStockPending ? stock?.payload[0].ali_stock : "-"}`}
          priceBank={`${!isStockPending ? stock?.payload[0].bank_price : "-"}`}
          priceAli={`${!isStockPending ? stock?.payload[0].ali_price : "-"}`}
          capitalPriceBank={`${
            !isStockPending ? stock?.payload[0].bank_buy_price : "-"
          }`}
          capitalPriceAli={`${
            !isStockPending ? stock?.payload[0].ali_buy_price : "-"
          }`}
        />
      ))}
      {typePayment.map((type) => (
        <DashboardTable
          key={type}
          typePayment={type}
          columnsBank={columnsBank}
          columnsAli={columnsAli}
          setSelectedRow={setSelectedRow}
          data={dataBank}
          dataAli={dataAli}
          handleSaveExcel={handelSaveExcel}
          hideBuyPrice={hideBuyPrice}
          handleHideBuyPriceBank={handleHideBuyPriceBank}
          handleHideBuyPriceAli={handleHideBuyPriceAli}
          isLoading={isPending}
          onOpenModal={handleOpenModal}
          priceBank={`${!isStockPending ? stock?.payload[0].bank_price : "-"}`}
          priceAli={`${!isStockPending ? stock?.payload[0].ali_price : "-"}`}
          capitalPriceBank={`${
            !isStockPending ? stock?.payload[0].bank_buy_price : "-"
          }`}
          capitalPriceAli={`${
            !isStockPending ? stock?.payload[0].ali_buy_price : "-"
          }`}
        />
      ))}
      <Modal
        title="Basic Modal"
        open={isModalOpenQr}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => setIsModalOpenQr(false)}
          >
            Ok
          </Button>,
        ]}
      >
        <img src="" alt="QR Code" width="500" height="600" />
      </Modal>
    </Flex>
  );
};
export default Dashboard;
