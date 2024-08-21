import { LogoutOutlined } from "@ant-design/icons";
import React from "react";

const LogoutButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex gap-1.5 items-center bg-[#FECACA] border-2 border-[#DC2626] text-[#DC2626] py-1 px-3 rounded-lg max-sm:text-xs"
    >
      <LogoutOutlined />
      Logout
    </button>
  );
};

export default LogoutButton;
