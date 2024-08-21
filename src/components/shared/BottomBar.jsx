import { NavLink } from "react-router-dom";
import DiscountIcon from "../icons/DiscountIcon";
import { AlipayOutlined, BankOutlined, HomeOutlined } from "@ant-design/icons";

const ButtomBar = () => {
  return (
    <div className="fixed bottom-0 z-10 flex w-[600px] max-[1080px]:w-full overflow-hidden bg-white border-t border-gray-200 border-solid">
      <div className="flex justify-between w-full">
        <Menu icon={HomeOutlined} link="/" text="Home" />
        <Menu icon={BankOutlined} link="/order" text="Order Bank" />
        <Menu icon={AlipayOutlined} link="/order" text="Order Ali" />
      </div>
    </div>
  );
};

const Menu = ({ text, icon: Icon, link }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive, isPending }) =>
        `flex flex-col p-1 cursor-pointer items-center w-full font-semibold hover:bg-primary hover:text-white text-xs gap-1 border-2 border-white rounded-lg ${
          isActive ? "bg-primary shadow-button text-white" : "text-black"
        }`
      }
    >
      <Icon className="text-xl" />
      {text}
    </NavLink>
  );
};

export default ButtomBar;
