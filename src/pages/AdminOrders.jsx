import { Button, DatePicker, Flex, Select } from "antd";
import Title from "antd/es/typography/Title";
import { useRef, useState } from "react";
import NewTableAdminOrder from "../components/orders/NewTableAdminOrder";
import { useDeleteOrder } from "../components/service/admin/orders/useDeleteOrder";
import { useUpdateStatusOrder } from "../components/service/admin/orders/useUpdateStatusOrder";
import { useReactToPrint } from "react-to-print";
import PrintModal from "../components/modal/PrintModal";

const AdminOrders = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [printType, setPrintType] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const printAreaRef = useRef();

  const updateStatusOrderMutation = useUpdateStatusOrder();

  const deleteOrderMutation = useDeleteOrder();

  const onChangeDate = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const handleChangeStatus = (value) => {
    setSelectedStatus(value);
  };

  const handleUpdateStatusSelectedRow = (selectedRowId) => {
    selectedRowId.forEach((orderId) => {
      updateStatusOrderMutation.mutate({
        id: orderId,
        data: { status: selectedStatus },
      });
    });
    window.location.reload();
  };

  const handleDeleteSelectedRow = (selectedRowId) => {
    selectedRowId.forEach((orderId) => {
      deleteOrderMutation.mutate(orderId);
    });
    setSelectedRowKeys([]);
    setSelectedRow([]);
  };
  console.log(selectedRowKeys);
  console.log(selectedRow);

  const handleOpenModal = (typeModal) => {
    setIsModalOpen(true);
    setPrintType(typeModal);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPrintType();
  };

  const handleOnPrint = useReactToPrint({
    content: () => printAreaRef.current,
  });

  console.log(selectedDate);

  return (
    <>
      <PrintModal
        isOpen={isModalOpen}
        onCancel={handleCloseModal}
        selectedRow={selectedRow}
        printAreaRef={printAreaRef}
        onConfirm={handleOnPrint}
        typeModal={printType}
      />
      <Title level={1}>All Orders</Title>
      <Flex vertical gap="middle">
        <div className="flex items-end w-full gap-6">
          <div className="flex w-1/2 gap-5">
            <div className="flex flex-col w-3/5 gap-2">
              <h3 className="text-sm font-medium">Selected Date</h3>
              <DatePicker onChange={onChangeDate} />
            </div>
            <div className="flex flex-col w-2/5 gap-2">
              <h3 className="text-sm font-medium text-nowrap">
                Update Selected Order
              </h3>
              <Select
                placeholder="Select order"
                className="w-full"
                allowClear
                onChange={handleChangeStatus}
              >
                <Select.Option value="Complete">Complete</Select.Option>
                <Select.Option value="Cancel">Cancel</Select.Option>
              </Select>
            </div>
          </div>

          <div className="flex flex-col w-1/2 gap-3">
            <div className="flex items-center justify-between w-full gap-2">
              <Button
                type="primary"
                className="w-3/5 text-white bg-primary"
                onClick={() => handleUpdateStatusSelectedRow(selectedRowKeys)}
              >
                Update Selected Order Status
              </Button>{" "}
              |
              <Button
                type="primary"
                danger
                className="w-2/5 text-white"
                onClick={() => handleDeleteSelectedRow(selectedRowKeys)}
              >
                Delete Selected Order
              </Button>
            </div>
          </div>
        </div>
        <div>
          <NewTableAdminOrder
            setSelectedRowKeys={setSelectedRowKeys}
            setSelectedRow={setSelectedRow}
            selectedRow={selectedRow}
            onOpenModalPrint={() => handleOpenModal("printPageOrders")}
            selectedDate={selectedDate}
            selectedStatus={selectedStatus}
          />
        </div>
      </Flex>
    </>
  );
};
export default AdminOrders;
