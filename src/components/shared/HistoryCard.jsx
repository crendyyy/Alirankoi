const HistoryCard = ({ totalAmount, date, rate, status }) => {
  return (
    <div className="w-full p-4 bg-gray-100 rounded-3xl flex justify-between items-center">
      <div className="flex flex-col gap-6">
        <span className="text-base font-bold">¥ {totalAmount}</span>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-400">{date}</span>
          <span className="text-xs font-bold text-gray-400">{rate}</span>
        </div>
      </div>
      <span
        className={`py-2 px-4 rounded-full ${
          status === "Succes"
            ? "bg-green-200 text-green-700"
            : status === "Pending"
            ? "bg-yellow-200 text-yellow-700"
            : status === "Canceled"
            ? "bg-red-200 text-red-700"
            : ""
        } h-fit text-sm font-bold`}
      >
        {status}
      </span>
    </div>
  );
};
export default HistoryCard;
