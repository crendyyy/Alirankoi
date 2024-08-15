import { NavLink } from "react-router-dom";
import Title from "antd/es/typography/Title";
import logoKoi from "/logo/logo-koi.png";
import { FileDoneOutlined, HomeOutlined } from "@ant-design/icons";

const Sidebar = () => {
  return (
    <>
      <div className="p-8 flex justify-center">
        <img src={logoKoi} alt="Logo Koi" width={73} />
      </div>

      <div className="flex flex-col gap-4 px-4">
        <Menu link="/dashboard">
          <HomeOutlined className="text-xl" /> Dashboard
        </Menu>

        <Menu link="/orders">
          <FileDoneOutlined className="text-xl" /> Orders
        </Menu>
      </div>
    </>
  );
};

const Menu = ({ link, children }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive, isPending }) =>
        `flex h-12 items-center gap-4 rounded-xl pl-4 font-semibold text-gray-400 ${
          isActive
            ? "bg-primary text-white hover:text-white"
            : "text-gray-400 border border-gray-300 hover:text-gray-600 hover:border-gray-400"
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default Sidebar;
