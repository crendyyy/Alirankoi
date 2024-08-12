import { NavLink } from "react-router-dom";
import HomeIcon from "../icons/HomeIcon";

const ButtomBar = () => {
  return (
    <div className="bottom-0 overflow-hidden w-full bg-white border-t border-gray-200 border-solid flex">
      <div className="flex w-full justify-between">
        <Menu icon={HomeIcon} link="/" text="Home" />
        <Menu icon={HomeIcon} link="/order" text="Home" />
        <Menu icon={HomeIcon} link="/setting" text="Home" />
        <Menu icon={HomeIcon} link="/profile" text="Home" />
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
          isActive ? "text-black bg-[#EFEFEF] shadow-button" : "text-gray-500"
        }`
      }
    >
      <Icon />
      {text}
    </NavLink>
  );
};

export default ButtomBar;
