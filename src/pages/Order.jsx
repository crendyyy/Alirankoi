import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import HistoryCard from "../components/shared/HistoryCard";
import { useLocation, useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();

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

  const handleOrderDetail = (order) => {
    navigate(`/order/${order.orderId}`, { state: { order } });
  };

  return (
    <>
      <Flex vertical gap="small">
        <Title level={5}>MY HISTORY</Title>
        <Flex vertical gap="middle">
          {Orders.map((order) => (
            <HistoryCard
              onClick={() => handleOrderDetail(order)}
              date={order.date}
              rate={order.rate}
              status={order.status}
              totalAmount={order.totalAmount}
            />
          ))}
        </Flex>
      </Flex>
    </>
  );
};
export default Order;
