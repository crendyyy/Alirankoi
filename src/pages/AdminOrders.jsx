import { Button, DatePicker, Select } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import TableAdminOrder from "../components/orders/TableAdminOrder";
import NewTableAdminOrder from "../components/orders/NewTableAdminOrder";

const AdminOrders = () => {
  // Date
  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
  };

  // Select
  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <>
      <Title level={1}>All Orders</Title>
      <div className="flex justify-between items-end">
        <div className="flex gap-5">
          <div className="flex gap-2 flex-col">
            <h3 className="text-sm font-medium">Selected Date</h3>
            <DatePicker onChange={onChangeDate} />
          </div>
          <div className="flex gap-2 flex-col">
            <h3 className="text-sm font-medium text-nowrap">Selected Order</h3>
            <Select
              placeholder="Select order"
              className="w-40"
              onChange={handleChange}
            >
              <Option value="Complete">Complete</Option>
              <Option value="Cancel">Cancel</Option>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2 w-full">
            <div className="flex items-center justify-between gap-2">
              <Button type="primary" className="text-white bg-primary">
                Update Selected Order Status
              </Button>{" "}
              |
              <Button type="primary" danger className="text-white">
                Delete Selected Order
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <NewTableAdminOrder />
        <TableAdminOrder />
      </div>
    </>
  );
};
export default AdminOrders;
