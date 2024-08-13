import { Outlet, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import ButtomBar from "../components/shared/BottomBar";
import Order from "../pages/Order";
import Setting from "../pages/Setting";
import Profile from "../pages/Profile";
import OrderDetail from "../pages/OrderDetail";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen flex flex-col justify-center w-full items-center bg-[#F8F8F8]">
      <main className="relative flex flex-col justify-between min-h-screen max-[1080px]:w-full w-1/3 bg-white">
        <div className="flex flex-col flex-grow p-6 mb-[76px] ">
          <Outlet />
        </div>

        <ButtomBar />
      </main>
    </div>
  );
};

const routes = [
  {
    element: <Outlet />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          {
            path: "/order",
            children: [
              { index: true, element: <Order /> },
              { path: ":orderId", element: <OrderDetail /> },
            ],
          },
          {
            path: "/setting",
            children: [{ index: true, element: <Setting /> }],
          },
          {
            path: "/profile",
            children: [{ index: true, element: <Profile /> }],
          },
        ],
      },
    ],
  },
];
export default routes;
