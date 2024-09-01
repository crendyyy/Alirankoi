import React from "react";

import { formatRupiah } from "../../libs/utils";
import Status from "../shared/Status";

const OrderInfo = ({ order }) => {
  return (
    <div className="flex flex-col gap-6 p-6 max-sm:p-5 text-sm font-normal bg-white rounded-3xl max-sm:text-[13px]">
    <div className="flex justify-between">
      <p>Status</p>
      <Status status={order?.status} />
    </div>
    <div className="flex justify-between">
      <p>Buy</p>
      <p>{order?.order_type}</p>
    </div>
    <div className="flex justify-between">
      <p>Order Id</p>
      <p>{order?.id}</p>
    </div>
    <div className="flex justify-between">
      <p>Date</p>
      <p>{order?.createdAt}</p>
    </div>
    <div className="flex justify-between">
      <p>Rate</p>
      <p>{formatRupiah(order?.selling_price)}</p>
    </div>
    <div className="flex justify-between">
      <p>Amount</p>
      <p>¥ {formatRupiah(order?.amount, false)}</p>
    </div>
  </div>
  );
};

export default OrderInfo;
