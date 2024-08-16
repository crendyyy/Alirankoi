import React from "react";

const Status = ({ status }) => {
  return (
    <span
<<<<<<< Updated upstream
      className={`py-2 px-4 rounded-full ${
=======
      className={`py-0.5 px-4 rounded-full ${
>>>>>>> Stashed changes
        status === "Complete"
          ? "bg-green-200 text-green-700"
          : status === "Pending"
          ? "bg-yellow-200 text-yellow-700"
          : status === "Canceled"
          ? "bg-red-200 text-red-700"
          : ""
      } h-fit text-sm`}
    >
      {status}
    </span>
  );
};

export default Status;
