import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import HistoryCard from "../components/shared/HistoryCard";
import { useNavigate } from "react-router-dom";
import { useGetUserOrders } from "../components/service/user/order/useGetUserOrder";
import { useEffect } from "react";
import { BankOutlined } from "@ant-design/icons";

const Order = () => {
  const navigate = useNavigate();

  const { data: orders, isPending, isError } = useGetUserOrders();
  console.log(orders);

  const handleOrderDetail = (order) => {
    navigate(`/order/${order.id}`, { state: { order } });
  };

  return (
    <>
      <Flex vertical gap="small">
        <h1 className="flex items-center gap-1 font-semibold text-lg my-2">
          <BankOutlined className="text-xl " /> Order Bank History
        </h1>
        <div className="flex flex-col gap-2">
          {isPending ? <p>Loading</p> : ""}
          {orders &&
            orders.payload.map((order) => (
              <HistoryCard
                key={order.id}
                onClick={() => handleOrderDetail(order)}
                date={order.createdAt}
                rate={order.bank_number}
                status={order.status}
                totalAmount={order.amount}
              />
            ))}
        </div>
      </Flex>
    </>
  );
};
export default Order;
