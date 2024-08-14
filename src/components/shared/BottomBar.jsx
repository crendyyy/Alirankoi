import { NavLink } from "react-router-dom";
import HomeIcon from "../icons/HomeIcon";
import DiscountIcon from "../icons/DiscountIcon";
import SettingIcon from "../icons/SettingIcons";
import UserIcon from "../icons/UserIcon";

const ButtomBar = () => {
  return (
    <div className="fixed bottom-0 z-10 flex w-[600px] max-[1080px]:w-full overflow-hidden bg-white border-t border-gray-200 border-solid">
      <div className="flex justify-between w-full">
        <Menu icon={HomeIcon} link="/" text="Home" />
        <Menu icon={DiscountIcon} link="/order" text="Order" />
        <Menu icon={SettingIcon} link="/setting" text="Setting" />
        <Menu icon={UserIcon} link="/profile" text="Profile" />
      </div>
    </div>
  );
};

const Menu = ({ text, icon: Icon, link }) => {
  return (
    <NavLink
      to={link}
      className={({ isActive, isPending }) =>
        `flex flex-col p-3 cursor-pointer items-center w-full font-semibold hover:bg-[#EFEFEF] hover:text-black ${
          isActive ? "text-black bg-[#EFEFEF] shadow-button" : "text-black"
        }`
      }
    >
      <Icon />
      {text}
    </NavLink>
  );
};

export default ButtomBar;
