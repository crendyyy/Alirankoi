import React from "react";

const Status = ({ status }) => {
  return (
    <span
      className={`py-1 px-3 rounded-full block text-center font-medium ${
        status === "Complete"
          ? "bg-green-200 text-green-700"
          : status === "Pending"
          ? "bg-yellow-200 text-yellow-700"
          : status === "Awaiting Payment"
          ? "bg-cyan-200 text-cyan-800"
          : status === "Cancel"
          ? "bg-red-200 text-red-700"
          : ""
      } h-fit text-xs max-sm:text-[11px]`}
    >
      {status}
    </span>
  );
};

export default Status;
