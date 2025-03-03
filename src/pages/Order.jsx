import { Empty, Flex } from "antd";
import Title from "antd/es/typography/Title";
import HistoryCard from "../components/shared/HistoryCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetUserOrders } from "../components/service/user/order/useGetUserOrder";
import { useEffect } from "react";
import { BankOutlined } from "@ant-design/icons";

const Order = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const { data: orders, isPending, isError } = useGetUserOrders();

  const handleOrderDetail = (order) => {
    navigate(`/order/${order.order_type.toLowerCase()}/${order._id}`, {
      state: { order },
    });
  };

  return (
    <>
      <Flex vertical gap="small">
        <h1 className="flex items-center gap-1 font-semibold text-lg my-2">
          <BankOutlined className="text-xl " /> History Order Buy{" "}
          {path === "/order/bank" ? "Bank" : "Ali"}
        </h1>
        <div className="flex flex-col gap-2">
          {isPending ? <p>Loading</p> : ""}
          {orders?.payload.filter((order) => order.order_type === "Bank")
            .length > 0 ? (
            path === "/order/bank" ? (
              orders?.payload
                .filter((order) => order.order_type === "Bank")
                .map((order) => (
                  <HistoryCard
                    key={order.id}
                    onClick={() => handleOrderDetail(order)}
                    date={order.createdAt.slice(0, 10)}
                    rate={order.selling_price}
                    status={order.status}
                    orderType={order.order_type}
                    totalAmount={order.totalAmount}
                  />
                ))
            ) : (
              orders?.payload
                .filter((order) => order.order_type === "Alipay")
                .map((order) => (
                  <HistoryCard
                    key={order._id}
                    onClick={() => handleOrderDetail(order)}
                    date={order.createdAt.slice(0, 10)}
                    rate={order.selling_price}
                    status={order.status}
                    orderType={order.order_type}
                    totalAmount={order.totalAmount}
                  />
                ))
            )
          ) : (
            <div className="h-screen flex items-center justify-center">
              <Empty description="No Order" />
            </div>
          )}
        </div>
      </Flex>
    </>
  );
};
export default Order;
