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

const Home = () => {
  const navigate = useNavigate();

  const { isModalopen, openModal, closeModal } = useModal();
  const [paymentType, setPaymentType] = useState("");
  const { logout } = useContext(AuthContext);

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
    <div className="flex flex-col w-full gap-12">
      {isModalopen && (
        <PaymentModal onClose={closeModal} typeModal={paymentType} />
      )}
      <div className="flex w-full gap-6">
        <div className="flex w-1/2 flex-col gap-12 bg-gray-100 p-6 max-[460px]:p-3 max-[460px]:gap-3 max-[460px]:rounded-[20px] rounded-[48px] ">
          <div className="flex w-full flex-col gap-6 max-[460px]:gap-3">
            <div className="flex flex-col gap-2 max-[460px]:gap-0.5 w-full">
              <span className="text-sm font-medium text-gray-400 max-[460px]:text-xs">
                Current Exchange
              </span>
              {isPending && <div className="">-</div>}
              <span className="text-3xl max-[460px]:text-2xl font-bold text-black">
                {formatRupiah(stock && stock.payload[0].price)}
              </span>
            </div>
            <div className="flex w-full max-[460px]:p-3 gap-2 p-4 items-center bg-white rounded-3xl ">
              <div className="p-3 max-[460px]:p-1 max-[460px]:h-fit text-white bg-blue-500 rounded-2xl max-[460px]:rounded-xl">
                <WalletIcon />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Stok</span>
                <span className="text-sm font-bold text-black">
                  ¥ {formatRupiah(stock?.payload[0].stock, false)}
                  {isPending && `-`}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal("bank")}
            className="flex items-center justify-center w-full h-12 text-base font-bold text-white bg-blue-500 rounded-full"
          >
            Buy Bank
          </button>
        </div>
        <div className="flex w-1/2 flex-col gap-12 bg-gray-100 p-6 max-[460px]:p-3 max-[460px]:gap-3 max-[460px]:rounded-[20px] rounded-[48px] ">
          <div className="flex w-full flex-col gap-6 max-[460px]:gap-3">
            <div className="flex flex-col gap-2 max-[460px]:gap-0.5 w-full">
              <span className="text-sm font-medium text-gray-400 max-[460px]:text-xs">
                Current Exchange
              </span>
              {isPending && <div className="">-</div>}
              <span className="text-3xl max-[460px]:text-2xl font-bold text-black">
                {formatRupiah(stock?.payload[0].price)}
              </span>
            </div>
            <div className="flex w-full max-[460px]:p-3 gap-2 p-4 items-center bg-white rounded-3xl ">
              <div className="p-3 max-[460px]:p-1 max-[460px]:h-fit text-white bg-blue-500 rounded-2xl max-[460px]:rounded-xl">
                <WalletIcon />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Stok</span>
                <span className="text-sm font-bold text-black">
                  ¥ {formatRupiah(stock?.payload[0].stock, false)}
                  {isPending && `-`}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal("ali")}
            className="flex items-center justify-center w-full h-12 text-base font-bold text-white bg-blue-500 rounded-full"
          >
            Buy Ali
          </button>
        </div>
      </div>
      <Button onClick={logout}>Logout</Button>
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-black">MY HISTORY</span>
          <Link to="/order" className="text-xs text-black">
            View All
          </Link>
        </div>
        {isOrderPending ? <p>Loading</p> : ""}
        {orders?.payload.map((order) => (
          <HistoryCard
            onClick={() => handleOrderDetail(order)}
            key={order.id}
            date={order.createdAt}
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
