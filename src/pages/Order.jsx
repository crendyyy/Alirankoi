import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import HistoryCard from "../components/shared/HistoryCard";
import { useNavigate } from "react-router-dom";
import { useGetUserOrders } from "../components/service/user/order/useGetUserOrder";
import { useEffect } from "react";

const Order = () => {
  const navigate = useNavigate();

  const { data: orders, isPending, isError } = useGetUserOrders();
  console.log(orders);

  const handleOrderDetail = (order) => {
    navigate(`/order/${order.orderId}`, { state: { order } });
  };

  return (
    <>
      <Flex vertical gap="small">
        <Title level={5}>MY HISTORY</Title>
        <Flex vertical gap="middle">
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
        </Flex>
      </Flex>
    </>
  );
};
export default Order;
