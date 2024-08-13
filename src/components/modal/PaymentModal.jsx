import Modal from "../shared/Modal";

const PaymentModal = ({ onClose }) => {
  return (
    <Modal onCancel={onClose}>
      <div className="bg-[#F8F8F8] flex flex-col gap-2">
        <div className="flex p-6 gap-2 bg-[#2C2C2C] rounded-t-3xl">
          <button className="h-12 bg-[#F3F4F6] w-[35%] rounded-full text-sm font-bold text-black flex justify-center items-center">
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
