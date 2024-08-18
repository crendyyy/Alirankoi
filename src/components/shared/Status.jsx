import React from "react";

const Status = ({ status }) => {
  return (
    <span
      className={`py-0.5 px-3 rounded-full block text-center ${
        status === "Complete"
          ? "bg-green-200 text-green-700"
          : status === "Pending"
          ? "bg-yellow-200 text-yellow-700"
          : status === "Cancel"
          ? "bg-red-200 text-red-700"
          : ""
      } h-fit text-xs`}
    >
      {status}
    </span>
  );
};

export default Status;
