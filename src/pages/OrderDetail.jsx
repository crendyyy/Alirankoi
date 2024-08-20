import { ClockCircleOutlined, UploadOutlined } from "@ant-design/icons";
import Status from "../components/shared/Status";
import { Button, Image, Input, Upload } from "antd";
import Title from "antd/es/typography/Title";
import { useLocation } from "react-router";
import { useState } from "react";
import { useGetStock } from "../components/service/stock/useGetStock";
import { formatRupiah } from "../libs/utils";

const OrderDetail = () => {
  const { state } = useLocation();
  const { order } = state;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const { data: stock, isPending: isPending, isError: isError } = useGetStock();

  console.log(order);

  const invoiceUrl = `http://localhost:3000/picture/${order.invoice_name}`;

  const [imageList, setImageList] = useState([
    {
      uid: "-1", // UID unik
      name: order.invoice_name, // Nama file
      status: "done", // Status
      url: invoiceUrl, // URL gambar
    },
  ]);

  const handlePreview = (file) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList }) => setImageList(fileList);

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
          <p>{order.id}</p>
        </div>
        <div className="flex justify-between">
          <p>Date</p>
          <p>{order.createdAt}</p>
        </div>
        <div className="flex justify-between">
          <p>Rate</p>
          <p>{formatRupiah(order.bank_number)}</p>
        </div>
        <div className="flex justify-between">
          <p>Amount</p>
          <p>¥ {formatRupiah(order.amount, false)}</p>
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
          <Upload
            listType="picture"
            className="w-full"
            fileList={imageList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => false}
            maxCount={1}
            disabled
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: false,
              showDownloadIcon: false,
            }}
          ></Upload>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 text-sm font-normal bg-white rounded-3xl">
        {order.status === "Pending" ? (
          <>
            <div className="flex justify-between">
              <h1>Payment Information</h1>
            </div>
            <Input placeholder="Bank Name" value={order.bank_detail} />
            <Input placeholder="Bank Number" value={order.bank_number} />
            <Input placeholder="Bank Branch" value={order.bank_branch} />
            <Input placeholder="Account Name" value={order.account_name} />
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <h1>Payment Information</h1>
            </div>
            <Input placeholder="Bank Name" value={order.bank_detail} disabled />
            <Input
              placeholder="Bank Number"
              value={order.bank_number}
              disabled
            />
            <Input
              placeholder="Bank Branch"
              value={order.bank_branch}
              disabled
            />
            <Input
              placeholder="Account Name"
              value={order.account_name}
              disabled
            />
          </>
        )}
      </div>

      <div className="flex items-center justify-between p-6 bg-white rounded-3xl">
        <span className="font-bold">Total Paid</span>
        <span className="font-bold">
          {isPending
            ? "-"
            : `${formatRupiah(
                Number(order.amount) * (stock && stock.payload[0].price)
              )}`}
        </span>
      </div>

      {/* <button className="p-6 bg-[#1367FF] text-white rounded">Payment Done</button> */}
      <Button type="primary" className="rounded-2xl" size="large">
        Payment Done
      </Button>
    </div>
  );
};
export default OrderDetail;
