import { matchPath, Outlet, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import ButtomBar from "../components/shared/BottomBar";
import Order from "../pages/Order";
import Setting from "../pages/Setting";
import Profile from "../pages/Profile";
import OrderDetail from "../pages/OrderDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen flex flex-col justify-center w-full items-center bg-[#F8F8F8]">
      {path === "/login" || path === "/register" ? (
        <main className="relative flex flex-col justify-between min-h-screen max-[1080px]:w-full w-[600px] bg-white">
          <Outlet />
        </main>
      ) : (
        <main className="relative flex flex-col justify-between min-h-screen max-[1080px]:w-full w-[600px] bg-white">
          {matchPath("/order/:orderId", path) ? (
            <Outlet />
          ) : (
            <div className="flex flex-col flex-grow p-6 mb-[76px] ">
              <Outlet />
            </div>
          )}

          <ButtomBar />
        </main>
      )}
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
          {
            path: "/login",
            children: [{ index: true, element: <Login /> }],
          },
          {
            path: "/register",
            children: [{ index: true, element: <Register /> }],
          },
        ],
      },
    ],
  },
];
export default routes;
