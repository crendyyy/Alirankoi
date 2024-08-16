import { Button, DatePicker, Select } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import TableAdminOrder from "../components/orders/TableAdminOrder";
import { useGetOrder } from "../components/service/admin/useGetOrders";

const AdminOrders = () => {
  // API CALLS
  console.log(useGetOrder());

  // Date
  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
  };

  // Select
  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  // TABLE

  // const originData = [];
  // for (let i = 0; i < 100; i++) {
  //   originData.push({
  //     key: i.toString(),
  //     name: `Edward ${i}`,
  //     age: 32,
  //     address: `London Park no. ${i}`,
  //   });
  // }
  // const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  //   const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  //   return (
  //     <td {...restProps}>
  //       {editing ? (
  //         <Form.Item
  //           name={dataIndex}
  //           style={{
  //             margin: 0,
  //           }}
  //           rules={[
  //             {
  //               required: true,
  //               message: `Please Input ${title}!`,
  //             },
  //           ]}
  //         >
  //           {inputNode}
  //         </Form.Item>
  //       ) : (
  //         children
  //       )}
  //     </td>
  //   );
  // };

  // const [form] = Form.useForm();
  // const [data, setData] = useState(originData);
  // const [editingKey, setEditingKey] = useState("");
  // const isEditing = (record) => record.key === editingKey;
  // const edit = (record) => {
  //   form.setFieldsValue({
  //     name: "",
  //     age: "",
  //     address: "",
  //     ...record,
  //   });
  //   setEditingKey(record.key);
  // };
  // const cancel = () => {
  //   setEditingKey("");
  // };
  // const save = async (key) => {
  //   try {
  //     const row = await form.validateFields();
  //     const newData = [...data];
  //     const index = newData.findIndex((item) => key === item.key);
  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, {
  //         ...item,
  //         ...row,
  //       });
  //       setData(newData);
  //       setEditingKey("");
  //     } else {
  //       newData.push(row);
  //       setData(newData);
  //       setEditingKey("");
  //     }
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //   }
  // };

  // // Columns
  // const columns = [
  //   {
  //     title: "name",
  //     dataIndex: "name",
  //     width: "25%",
  //     editable: true,
  //   },
  //   {
  //     title: "age",
  //     dataIndex: "age",
  //     width: "15%",
  //     editable: true,
  //   },
  //   {
  //     title: "address",
  //     dataIndex: "address",
  //     width: "40%",
  //     editable: true,
  //   },
  //   {
  //     title: "operation",
  //     dataIndex: "operation",
  //     render: (_, record) => {
  //       const editable = isEditing(record);
  //       return editable ? (
  //         <span>
  //           <Typography.Link
  //             onClick={() => save(record.key)}
  //             style={{
  //               marginInlineEnd: 8,
  //             }}
  //           >
  //             Save
  //           </Typography.Link>
  //           <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
  //             <a>Cancel</a>
  //           </Popconfirm>
  //         </span>
  //       ) : (
  //         <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
  //           Edit
  //         </Typography.Link>
  //       );
  //     },
  //   },
  // ];

  // // Merged Columns
  // const mergedColumns = columns.map((col) => {
  //   if (!col.editable) {
  //     return col;
  //   }
  //   return {
  //     ...col,
  //     onCell: (record) => ({
  //       record,
  //       inputType: col.dataIndex === "age" ? "number" : "text",
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       editing: isEditing(record),
  //     }),
  //   };
  // });

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
            <Select placeholder="Select order" className="w-40" onChange={handleChange}>
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
        <TableAdminOrder />
        <TableAdminOrder />
      </div>
    </>
  );
};
export default AdminOrders;
