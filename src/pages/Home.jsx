import React from "react";
import HomeIcon from "../components/icons/HomeIcon";
import HistoryCard from "../components/shared/HistoryCard";
import { Link } from "react-router-dom";
import useModal from "../Hooks/useModal";
import PaymentModal from "../components/modal/PaymentModal";

const Home = () => {
  const { isModalopen, openModal, closeModal } = useModal();

  const Orders = [
    {
      totalAmount: 10000,
      date: "17:10 - 18/08/24",
      rate: 22400,
      status: "Succes",
      orderId: 1,
    },
    {
      totalAmount: 5000,
      date: "17:10 - 18/08/24",
      rate: 22400,
      status: "Pending",
      orderId: 2,
    },
    {
      totalAmount: 5000,
      date: "17:10 - 18/08/24",
      rate: 22400,
      status: "Canceled",
      orderId: 3,
    },
  ];

  return (
    <div className="flex flex-col w-full gap-12">
      {isModalopen && <PaymentModal onClose={closeModal} />}
      <div className="flex flex-col gap-12 bg-gray-100 p-6 rounded-[48px] ">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-400">
              Current Exchange
            </span>
            <span className="text-3xl font-bold text-black">Rp 2.234</span>
          </div>
          <div className="flex gap-2 p-4 bg-white rounded-3xl w-fit">
            <div className="p-3 text-white bg-blue-500 rounded-2xl">
              <HomeIcon />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Stok</span>
              <span className="text-sm font-bold text-black">¥12.000</span>
            </div>
          </div>
        </div>
        <button
          onClick={openModal}
          className="flex items-center justify-center h-12 text-base font-bold text-white bg-blue-500 rounded-full"
        >
          Buy Now
        </button>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-black">MY HISTORY</span>
          <Link to="/order" className="text-xs text-black">
            View All
          </Link>
        </div>
        {Orders.map((order) => (
          <HistoryCard
            key={order.orderId}
            date={order.date}
            rate={order.rate}
            status={order.status}
            totalAmount={order.totalAmount}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
