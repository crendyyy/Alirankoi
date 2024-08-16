import { matchPath, Outlet, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import ButtomBar from "../components/shared/BottomBar";
import Order from "../pages/Order";
import Setting from "../pages/Setting";
import Profile from "../pages/Profile";
import OrderDetail from "../pages/OrderDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Aside from "../components/shared/Aside";
import Layout, { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Dashboard from "../pages/Dashboard";
import AdminOrders from "../pages/AdminOrders";
import NotFound from "../pages/NotFound";
import ProtectedRoutes from "./ProtectedRoutes";

const LayoutUser = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen flex flex-col justify-center w-full items-center bg-[#F8F8F8]">
      {path === "/login" || path === "/register" ? (
        <main className="relative flex flex-col justify-between min-h-screen max-[1080px]:w-full w-[600px] bg-white">
          <Outlet />
        </main>
      ) : (
        <>
          {matchPath("/order/:orderId", path) ? (
            <main className="relative flex flex-col justify-between min-h-screen max-[1080px]:w-full w-[600px] ">
              <Outlet />
            </main>
          ) : (
            <main className="relative flex flex-col justify-between min-h-screen max-[1080px]:w-full w-[600px] bg-white">
              <div className="flex flex-col flex-grow p-6 mb-[76px] ">
                <Outlet />
              </div>
            </main>
          )}
          <ButtomBar />
        </>
      )}
    </div>
  );
};

const LayoutAdmin = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider
          theme="light"
<<<<<<< Updated upstream
          width={240}
=======
          width={250}
>>>>>>> Stashed changes
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            scrollbarWidth: "thin",
            scrollbarColor: "unset",
          }}
        >
          <Aside />
        </Sider>

<<<<<<< Updated upstream
        <Content style={{ marginLeft: "240px" }}>
          <main className="w-full px-12 py-8">
=======
        <Content style={{ marginLeft: "250px" }}>
          <main className="w-full px-8 py-8">
>>>>>>> Stashed changes
            <Outlet />
          </main>
        </Content>
      </Layout>
    </Layout>
  );
};

const routes = [
  {
    element: <Outlet />,
    children: [
      {
        path: "/",
        element: <LayoutUser />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoutes roles={["user"]}>
                <Home />
              </ProtectedRoutes>
            ),
          },
          {
            path: "/order",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoutes roles={["user"]}>
                    <Order />
                  </ProtectedRoutes>
                ),
              },
              {
                path: ":orderId",
                element: (
                  <ProtectedRoutes roles={["user"]}>
                    <OrderDetail />
                  </ProtectedRoutes>
                ),
              },
            ],
          },
          {
            path: "/setting",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoutes roles={["user"]}>
                    <Setting />
                  </ProtectedRoutes>
                ),
              },
            ],
          },
          {
            path: "/profile",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoutes roles={["user"]}>
                    <Profile />
                  </ProtectedRoutes>
                ),
              },
            ],
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
      {
        path: "/",
        element: (
          <ProtectedRoutes roles={["admin"]}>
            <LayoutAdmin />
          </ProtectedRoutes>
        ),
        children: [
          {
            path: "/dashboard",
            children: [{ index: true, element: <Dashboard /> }],
          },
          {
            path: "/orders",
            children: [{ index: true, element: <AdminOrders /> }],
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
export default routes;
