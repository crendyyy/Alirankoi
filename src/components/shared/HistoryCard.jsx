import { formatRupiah } from "../../libs/utils";
import Status from "./Status";

const HistoryCard = ({ totalAmount, date, rate, status, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-3xl"
    >
      <div className="flex flex-col gap-6">
        <span className="text-base font-bold">
          ¥ {formatRupiah(totalAmount, false)}
        </span>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-400">{date}</span>
          <span className="text-xs font-bold text-gray-400">{rate}</span>
        </div>
      </div>
      <Status status={status} />
    </div>
  );
};
export default HistoryCard;
