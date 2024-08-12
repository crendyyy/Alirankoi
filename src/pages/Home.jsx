import React from "react";
import HomeIcon from "../components/icons/HomeIcon";

const Home = () => {
  return (
    <div className="flex flex-col w-full gap-12">
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
        <button className="flex items-center justify-center h-12 text-base font-bold text-white bg-blue-500 rounded-full">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Home;
