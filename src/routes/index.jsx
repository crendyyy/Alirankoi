import { Outlet } from "react-router-dom";
import Home from "../pages/Home";
import ButtomBar from "../components/shared/BottomBar";
import Order from "../pages/Order";
import Setting from "../pages/Setting";
import Profile from "../pages/Profile";

const Layout = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#F8F8F8]">
      <main className="flex flex-col bg-white justify-between w-1/3 h-full">
        <div className="p-6 flex flex-col">
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
          { path: "/order", children: [{ index: true, element: <Order /> }] },
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
