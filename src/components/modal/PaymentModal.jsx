import Title from "antd/es/typography/Title";
import Modal from "../shared/Modal";
import { Flex, Input, InputNumber } from "antd";

const PaymentModal = ({ onClose }) => {
  const onChange = (value) => {
    console.log("changed", value);
  };
  return (
    <Modal onCancel={onClose}>
      <div className="bg-[#F8F8F8] flex flex-col gap-2 rounded-t-3xl">
        <div className="p-6 bg-white rounded-3xl flex flex-col gap-6">
          <Title level={5}>Payment Information</Title>
          <Flex vertical gap="middle">
            <Input
              variant="filled"
              placeholder="Bank Name"
              className="w-full h-12 flex items-center px-2"
            />
            <InputNumber
              placeholder="Bank Number"
              className="w-full h-12 flex items-center "
              variant="filled"
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              onChange={onChange}
            />
            <Input
              variant="filled"
              placeholder="Bank Branch"
              className="w-full h-12 flex items-center px-2"
            />
            <Input
              variant="filled"
              placeholder="Account Name"
              className="w-full h-12 flex items-center px-2"
            />
          </Flex>
        </div>
        <div className="p-6 bg-white rounded-3xl flex flex-col gap-5">
          <Title level={5}>Purhcase Amount</Title>
          <InputNumber
            className="w-full h-12 flex items-center px-2"
            variant="filled"
            prefix="¥"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            onChange={onChange}
          />
        </div>
        <div className="flex p-6 gap-2 bg-[#2C2C2C] rounded-t-3xl">
          <button
            onClick={onClose}
            className="h-12 bg-[#F3F4F6] w-[35%] rounded-full text-sm font-bold text-black flex justify-center items-center"
          >
            Cancel
          </button>
          <button className="h-12 bg-blue-500 w-3/4 rounded-full text-sm font-bold text-white flex justify-center items-center">
            Payment Now
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentModal;
