import {
  ClockCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Status from "../components/shared/Status";
import { Button, Form, Image, Input, Upload } from "antd";
import Title from "antd/es/typography/Title";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useGetStock } from "../components/service/stock/useGetStock";
import { formatRupiah } from "../libs/utils";
import { useUpdateOrderUser } from "../components/service/user/order/useUpdateOrderUser";

const OrderDetail = () => {
  const { state } = useLocation();
  const { order } = state;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [formEdit] = Form.useForm();

  const { data: stock, isPending: isPending, isError: isError } = useGetStock();

  const editOrderMutation = useUpdateOrderUser();

  const invoiceUrl = `http://localhost:3000/picture/${order.invoice_name}`;

  const [imageList, setImageList] = useState([
    {
      uid: "-1", // UID unik
      name: order.invoice_name, // Nama file
      status: "done", // Status
      url: invoiceUrl, // URL gambar
    },
  ]);

  useEffect(() => {
    formEdit.setFieldsValue({
      bank_detail: order.bank_detail,
      bank_number: order.bank_number,
      bank_branch: order.bank_branch,
      account_name: order.account_name,
    });
  }, [order, formEdit]);

  const handleEdit = () => {
    setIsEdit((prev) => !prev);
  };

  const handleSubmitEdit = async (value) => {
    console.log("Submitting edit...");
    const formData = new FormData();
    formData.append("bank_number", value.bank_number);
    formData.append("bank_detail", value.bank_detail);
    formData.append("bank_branch", value.bank_branch);
    formData.append("account_name", value.account_name);

    await editOrderMutation.mutate({ id: order.id, data: formData });
    setIsEdit(false);
  };

  const handlePreview = (file) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList }) => setImageList(fileList);

  return (
    <div className="bg-[#F8F8F8] h-full w-full flex flex-col gap-4 max-sm:gap-3.5 mb-24 px-3">
      <h1 className="p-6 max-sm:p-5 font-bold bg-white rounded-b-3xl">
        Order Detail
      </h1>

      <div className="flex flex-col gap-6 p-6 max-sm:p-5 text-sm font-normal bg-white rounded-3xl max-sm:text-[13px]">
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
        <div className="flex justify-between p-6 max-sm:p-5 bg-[#FECACA] rounded-3xl border-2 border-dashed border-[#DC2626] gap-2">
          <p className="max-sm:text-xs text-sm text-[#DC2626]">
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

      <div className="p-6 max-sm:p-5 bg-white rounded-3xl">
        <h1 className="max-sm:text-sm font-bold text-base">Payment Proof</h1>
        <small className="flex gap-1 items-center my-2 max-sm:items-start text-[#9CA3AF]">
          <InfoCircleOutlined className="max-sm:mt-1" />
          If you need to upload a new payment proof, click the button below!
        </small>
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

      <div className="flex flex-col gap-6 p-6 max-sm:p-5 text-sm font-normal bg-white rounded-3xl">
        {order.status === "Pending" ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="max-sm:text-sm font-bold text-base">
                Payment Information
              </h1>
              {isEdit ? (
                <Form form={formEdit} onFinish={handleSubmitEdit}>
                  <Form.Item noStyle>
                    <Button
                      style={{ padding: 0 }}
                      type="link"
                      htmlType="submit"
                    >
                      Submit Edit
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <Button style={{ padding: 0 }} type="link" onClick={handleEdit}>
                  Edit Data
                </Button>
              )}
            </div>

            <Form
              layout="vertical"
              className="flex flex-col"
              form={formEdit}
              initialValues={{
                bank_detail: order.bank_detail,
                bank_number: order.bank_number,
                bank_branch: order.bank_branch,
                account_name: order.account_name,
              }}
              onFinish={handleSubmitEdit}
            >
              <Form.Item
                label="Bank Name"
                name="bank_detail"
                className="font-semibold !text-gray-500"
              >
                <Input
                  placeholder="Bank Name"
                  disabled={!isEdit}
                  className="bg-[#F7F9FC] p-2.5 rounded-lg border-white hover:border"
                />
              </Form.Item>
              <Form.Item
                label="Bank Number"
                name="bank_number"
                className="font-semibold !text-xs"
              >
                <Input
                  placeholder="Bank Number"
                  disabled={!isEdit}
                  className="bg-[#F7F9FC] p-2.5 rounded-lg border-white hover:border"
                />
              </Form.Item>
              <Form.Item
                label="Bank Branch"
                name="bank_branch"
                className="font-semibold"
              >
                <Input
                  placeholder="Bank Branch"
                  disabled={!isEdit}
                  className="bg-[#F7F9FC] p-2.5 rounded-lg border-white hover:border"
                />
              </Form.Item>
              <Form.Item
                label="Account Name"
                name="account_name"
                className="font-semibold"
              >
                <Input
                  placeholder="Account Name"
                  disabled={!isEdit}
                  className="bg-[#F7F9FC] p-2.5 rounded-lg border-white hover:border"
                />
              </Form.Item>
            </Form>
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

      <div className="flex items-center justify-between p-6 max-sm:p-5 bg-white rounded-3xl max-sm:text-sm">
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
      <button className="rounded-full bg-primary text-white py-3 px-2 max-sm:text-sm font-semibold">
        Payment Done
      </button>
    </div>
  );
};
export default OrderDetail;
