import { useState } from "react";

const useModal = () => {
  const [isModalopen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalopen,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
  };
};
export default useModal;
