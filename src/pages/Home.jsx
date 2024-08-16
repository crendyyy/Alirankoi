import React, { useState } from "react";
import HomeIcon from "../components/icons/HomeIcon";
import HistoryCard from "../components/shared/HistoryCard";
import { Link, useNavigate } from "react-router-dom";
import useModal from "../Hooks/useModal";
import PaymentModal from "../components/modal/PaymentModal";
import WalletIcon from "../components/icons/WalletIcon";
import { useGetUserOrders } from "../components/service/user/useGetUserOrder";
import { data } from "autoprefixer";

const Home = () => {
  const navigate = useNavigate();

  const { isModalopen, openModal, closeModal } = useModal();
  const [paymentType, setPaymentType] = useState("");

  const { data: orders, isPending, isError } = useGetUserOrders();
  console.log(orders);

  // const Orders = [
  //   {
  //     totalAmount: 10000,
  //     date: "17:10 - 18/08/24",
  //     rate: 22400,
  //     status: "Succes",
  //     orderId: 1,
  //   },
  //   {
  //     totalAmount: 5000,
  //     date: "17:10 - 18/08/24",
  //     rate: 22400,
  //     status: "Pending",
  //     orderId: 2,
  //   },
  //   {
  //     totalAmount: 5000,
  //     date: "17:10 - 18/08/24",
  //     rate: 22400,
  //     status: "Canceled",
  //     orderId: 3,
  //   },
  // ];

  const handleOrderDetail = (order) => {
    navigate(`/order/${order.orderId}`, { state: { order } });
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
              <span className="text-3xl max-[460px]:text-2xl font-bold text-black">
                Rp 2.234
              </span>
            </div>
            <div className="flex w-full max-[460px]:p-3 gap-2 p-4 items-center bg-white rounded-3xl ">
              <div className="p-3 max-[460px]:p-1 max-[460px]:h-fit text-white bg-blue-500 rounded-2xl max-[460px]:rounded-xl">
                <WalletIcon />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Stok</span>
                <span className="text-sm font-bold text-black">¥12.000</span>
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
              <span className="text-3xl max-[460px]:text-2xl font-bold text-black">
                Rp 2.234
              </span>
            </div>
            <div className="flex w-full max-[460px]:p-3 gap-2 p-4 items-center bg-white rounded-3xl ">
              <div className="p-3 max-[460px]:p-1 max-[460px]:h-fit text-white bg-blue-500 rounded-2xl max-[460px]:rounded-xl">
                <WalletIcon />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Stok</span>
                <span className="text-sm font-bold text-black">¥12.000</span>
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
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-black">MY HISTORY</span>
          <Link to="/order" className="text-xs text-black">
            View All
          </Link>
        </div>
        {isPending ? <p>Loading</p> : ""}
        {orders &&
          orders.payload.map((order) => (
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
