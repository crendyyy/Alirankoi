import {
  AlipayOutlined,
  BankOutlined,
  CalendarOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { formatRupiah } from "../../libs/utils";
import Status from "./Status";

const HistoryCard = ({ totalAmount, date, rate, status, onClick, orderType }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between w-full p-5 max-sm:p-4 bg-[#F7F9FC] rounded-2xl cursor-pointer"
    >
      <div className="flex flex-col justify-between">
        <span className="text-base max-sm:text-sm font-bold mb-4 text-[#111111]">
          ¥ {formatRupiah(totalAmount, false)}
        </span>
        <div className="flex flex-col gap-2 font-semibold">
          <span className="text-xs text-[#9CA3AF] flex gap-2">
            <CalendarOutlined />
            {date}
          </span>
          <span className="text-xs text-[#9CA3AF] flex gap-2">
            <SwapOutlined />
            {formatRupiah(rate, true)}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-20 gap-5">
        <span className="text-sm max-sm:text-xs font-medium text-[#9CA3AF] flex items-center gap-1">
          <BankOutlined /> {orderType}
        </span>
        {/* <span className="text-sm font-medium">
          <AlipayOutlined /> Ali
        </span> */}
        <Status status={status} />
      </div>
    </div>
  );
};
export default HistoryCard;
