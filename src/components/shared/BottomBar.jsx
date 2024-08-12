import { NavLink } from "react-router-dom";
import HomeIcon from "../icons/HomeIcon";

const ButtomBar = () => {
  return (
    <div className="fixed bottom-0 z-10 flex w-1/3 overflow-hidden bg-white border-t border-gray-200 border-solid">
      <div className="flex justify-between w-full">
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
