import React, { useContext, useEffect, useState } from "react";
import HomeIcon from "../components/icons/HomeIcon";
import HistoryCard from "../components/shared/HistoryCard";
import { Link, useNavigate } from "react-router-dom";
import useModal from "../Hooks/useModal";
import PaymentModal from "../components/modal/PaymentModal";
import WalletIcon from "../components/icons/WalletIcon";
import { useGetUserOrders } from "../components/service/user/order/useGetUserOrder";
import { Button } from "antd";
import { AuthContext } from "../context/AuthContext";
import { useGetStock } from "../components/service/stock/useGetStock";
import { formatRupiah } from "../libs/utils";
import LogoutButton from "../components/shared/LogoutButton";
import {
  AlipayOutlined,
  BankOutlined,
  CheckCircleOutlined,
  WalletOutlined,
} from "@ant-design/icons";

const Home = () => {
  const navigate = useNavigate();

  const { isModalopen, openModal, closeModal } = useModal();
  const [paymentType, setPaymentType] = useState("");
  const { logout, auth } = useContext(AuthContext);

  console.log(auth.user?.username);

  const {
    data: orders,
    isPending: isOrderPending,
    isError: isOrderError,
  } = useGetUserOrders();

  const { data: stock, isPending: isPending, isError: isError } = useGetStock();

  const handleOrderDetail = (order) => {
    navigate(`/order/${order.id}`, { state: { order } });
  };

  const handleOpenModal = (type) => {
    setPaymentType(type);
    openModal();
  };

  return (
    <div className="flex flex-col w-full gap-10 max-sm:gap-10">
      {isModalopen && (
        <PaymentModal onClose={closeModal} typeModal={paymentType} />
      )}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl text-black max-sm:text-base">
          Hello, {auth.user?.username} 👋
        </h1>
        <LogoutButton onClick={logout} />
      </div>

      <div className="flex w-full gap-6 max-sm:gap-3">
        {/* Buy Bank */}
        <div className="flex w-1/2 flex-col m-auto gap-8 bg-[#11CD9F] p-6 max-sm:py-4 max-sm:px-3 max-sm:gap-6 max-sm:rounded-[18px] rounded-[32px] ">
          <div className="flex w-full flex-col gap-6 max-sm:gap-3">
            <div className="flex flex-col gap-2 max-sm:gap-0 w-full">
              <span className="text-sm font-normal text-white max-sm:text-xs">
                Current Exchange Rate
              </span>
              {isPending && <div className="">-</div>}
              <span className="text-3xl max-sm:text-xl font-bold text-white">
                {formatRupiah(stock && stock.payload[0].price)}
              </span>
            </div>
            <div className="flex w-full max-sm:p-2 gap-2 p-4 items-center bg-white rounded-2xl ">
              <div className="p-2 max-sm:p-1 flex justify-center items-center rounded-xl text-black bg-[#11CD9F]">
                <WalletIcon className="text-2xl" />
              </div>

              <div className="flex flex-col gap-0.5 text-black">
                <span className="text-xs">Stok</span>
                <span className="text-sm font-bold max-sm:text-xs">
                  ¥ {formatRupiah(stock?.payload[0].stock, false)}
                  {isPending && `-`}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal("Bank")}
            className="flex items-center justify-center gap-2 w-full p-3 max-sm:p-2.5 text-base max-sm:text-xs font-bold text-black bg-white rounded-full"
          >
            <BankOutlined className="text-2xl max-sm:text-lg text-[#11CD9F]" />
            Buy Bank
          </button>
        </div>

        {/* Buy Ali */}
        <div className="flex w-1/2 flex-col m-auto gap-8 bg-[#0099E5] p-6 max-sm:py-4 max-sm:px-3 max-sm:gap-6 max-sm:rounded-[18px] rounded-[32px] ">
          <div className="flex w-full flex-col gap-6 max-sm:gap-3">
            <div className="flex flex-col gap-2 max-sm:gap-0 w-full">
              <span className="text-sm font-normal text-white max-sm:text-xs">
                Current Exchange Rate
              </span>
              {isPending && <div className="">-</div>}
              <span className="text-3xl max-sm:text-xl font-bold text-white">
                {formatRupiah(stock && stock.payload[0].price)}
              </span>
            </div>
            <div className="flex w-full max-sm:p-2 gap-2 p-4 items-center bg-white rounded-2xl ">
              <div className="p-2 max-sm:p-1 flex justify-center items-center rounded-xl text-white bg-[#0099E5]">
                <WalletIcon className="text-2xl" />
              </div>

              <div className="flex flex-col gap-0.5 text-black">
                <span className="text-xs">Stok</span>
                <span className="text-sm font-bold max-sm:text-xs">
                  ¥ {formatRupiah(stock?.payload[0].stock, false)}
                  {isPending && `-`}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal("Ali")}
            className="flex items-center justify-center gap-2 w-full p-3 max-sm:p-2.5 text-base max-sm:text-xs font-bold text-black bg-white rounded-full"
          >
            <AlipayOutlined className="text-2xl max-sm:text-lg text-[#0099E5]" />
            Buy Ali
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full gap-3 max-sm:gap-2">
        <div className="flex items-center justify-between max-sm:mb-2">
          <span className="text-lg font-semibold text-black max-sm:text-base">
            My History
          </span>
          <Link to="/order" className="text-xs text-gray-500 underline">
            View All
          </Link>
        </div>
        {isOrderPending ? <p>Loading</p> : ""}
        {orders?.payload.map((order) => (
          <HistoryCard
            onClick={() => handleOrderDetail(order)}
            key={order.id}
            date={order.createdAt.slice(0, 10)}
            rate={order.bank_number}
            status={order.status}
            totalAmount={order.amount}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
