import { ClockCircleOutlined, UploadOutlined } from "@ant-design/icons";
import Status from "../components/shared/Status";
import { Button, Input, Upload } from "antd";
import Title from "antd/es/typography/Title";
import { useLocation } from "react-router";

const OrderDetail = () => {
  const { state } = useLocation();
  const { order } = state;
  console.log(order);

  const props = {
    listType: "picture",
    beforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = document.createElement("img");
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = "red";
            ctx.textBaseline = "middle";
            ctx.font = "33px Arial";
            ctx.fillText("Ant Design", 20, 20);
            canvas.toBlob((result) => resolve(result));
          };
        };
      });
    },
  };

  return (
    <div className="bg-[#F8F8F8] h-full w-full flex flex-col gap-5 mb-24">
      <h1 className="p-5 font-bold bg-white">Order Detail</h1>

      <div className="flex flex-col gap-6 p-6 text-sm font-normal bg-white rounded-3xl">
        <div className="flex justify-between">
          <p>Status</p>
          <Status status={order.status} />
        </div>
        <div className="flex justify-between">
          <p>Order Id</p>
          <p>{order.orderId}</p>
        </div>
        <div className="flex justify-between">
          <p>Date</p>
          <p>{order.date}</p>
        </div>
        <div className="flex justify-between">
          <p>Rate</p>
          <p>{order.rate}</p>
        </div>
        <div className="flex justify-between">
          <p>Amount</p>
          <p>{order.totalAmount}</p>
        </div>
      </div>

      {order.status === "Pending" ? (
        <div className="flex justify-between p-6 bg-[#FECACA] rounded-3xl border-2 border-dashed border-[#DC2626]">
          <p className="text-xs text-[#DC2626]">
            Upload payment proof before time runs out to avoid order
            cancellation.
          </p>
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-[#DC2626]" />
            <p className="text-xs text-[#DC2626] font-bold">10:00</p>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="p-6 bg-white rounded-3xl">
        <h1 className="mb-4">Payment Proof</h1>
        <div className="flex">
          <Upload {...props} className="w-full">
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 text-sm font-normal bg-white rounded-3xl">
        <div className="flex justify-between">
          <h1>Payment Information</h1>
        </div>
        <Input placeholder="Bank Name" />
        <Input placeholder="Bank Number" />
        <Input placeholder="Bank Branch" />
        <Input placeholder="Account Name" />
      </div>

      <div className="flex items-center justify-between p-6 bg-white rounded-3xl">
        <span className="font-bold">Total Paid</span>
        <span className="font-bold">Rp 22.400.000</span>
      </div>

      {/* <button className="p-6 bg-[#1367FF] text-white rounded">Payment Done</button> */}
      <Button type="primary" className="rounded-2xl" size="large">
        Payment Done
      </Button>
    </div>
  );
};
export default OrderDetail;
