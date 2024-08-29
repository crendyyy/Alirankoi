import { ClockCircleOutlined, InfoCircleOutlined, UploadOutlined } from "@ant-design/icons";
import Status from "../components/shared/Status";
import { Button, Form, Image, Input, Upload } from "antd";
import Title from "antd/es/typography/Title";
import { useLocation, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { useGetStock } from "../components/service/stock/useGetStock";
import { formatRupiah } from "../libs/utils";
import { useCancelOrderUser, useConfirmOrderUser, useUpdateOrderUser } from "../components/service/user/order/useUpdateOrderUser";
import { AuthContext } from "../context/AuthContext";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { order } = state;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { auth } = useContext(AuthContext);

  const { data: stock, isPending: isPending, isError: isError } = useGetStock();

  const editOrderMutation = useUpdateOrderUser();

  // QR CODE
  const qrCodeUrl = `http://localhost:3000/picture/${order.ali_qr}`;

  const [qrCodeList, setqrCodeList] = useState([
    {
      uid: "-1", // UID unik
      name: order.ali_qr, // Nama file
      status: "done", // Status
      url: qrCodeUrl, // URL gambar
    },
  ]);

  const confirmOrderMutation = useConfirmOrderUser();
  const cancelOrderMutation = useCancelOrderUser();

  const invoiceUrl = `http://localhost:3000/picture/${order.invoice_name}`;

  const [imageList, setImageList] = useState([]);

  const [formConfirmOrder] = Form.useForm();

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleSubmitEdit = async (value) => {
    console.log("Submitting edit...");

    const data = {
      bank_number: value.bank_number,
      bank_detail: value.bank_detail,
      bank_branch: value.bank_branch,
      account_name: value.account_name,
    };

    await editOrderMutation.mutate({ id: order.id, data });
    setIsEdit(false);
  };

  const handleConfirmOrder = async () => {
    const file = imageList[0]?.originFileObj;
    console.log(file);
    const formData = new FormData();

    formData.append("invoice", imageList[0]?.originFileObj);

    formData.append("token", auth.token);

    await confirmOrderMutation.mutate({ id: order.id, data: formData });
    formConfirmOrder.resetFields();
  };

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate({ id: order.id });
  };

  const handlePreview = (file) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList }) => setImageList(fileList);

  // let tes = order.status;
  // let tes2 = "Complete";

  return (
    <div className="bg-[#F8F8F8] h-full w-full flex flex-col gap-4 max-sm:gap-3.5 mb-24 px-3">
      <h1 className="p-6 font-bold bg-white max-sm:p-5 rounded-b-3xl">Order Detail</h1>

      <div className="flex flex-col gap-6 p-6 max-sm:p-5 text-sm font-normal bg-white rounded-3xl max-sm:text-[13px]">
        <div className="flex justify-between">
          <p>Status</p>
          <Status status={order.status} />
        </div>
        <div className="flex justify-between">
          <p>Buy</p>
          <p>{order.order_type}</p>
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
          <p>{formatRupiah(order.selling_price)}</p>
        </div>
        <div className="flex justify-between">
          <p>Amount</p>
          <p>¥ {formatRupiah(order.amount, false)}</p>
        </div>
      </div>

      {order.status === "Awaiting Payment" ? (
        <div className="flex justify-between p-6 max-sm:p-5 bg-[#FECACA] rounded-3xl border-2 border-dashed border-[#DC2626] gap-2 max-sm:gap-3">
          <p className="max-sm:text-xs text-sm text-[#DC2626]">Upload payment proof before time runs out to avoid order cancellation.</p>
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-[#DC2626]" />
            <p className="text-xs text-[#DC2626] font-bold">10:00</p>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="p-6 bg-white max-sm:p-5 rounded-3xl">
        <h1 className="text-base font-bold max-sm:text-sm">Payment Proof</h1>
        {order.status === "Awaiting Payment" ? (
          <small className="flex gap-1 items-center my-2 max-sm:items-start text-[#9CA3AF]">
            <InfoCircleOutlined className="max-sm:mt-1" />
            Upload your payment proof below!
          </small>
        ) : order.status === "Pending" ? (
          <small className="flex gap-1 items-center my-2 max-sm:items-start text-[#9CA3AF]">
            <InfoCircleOutlined className="max-sm:mt-1" />
            If you need to upload a new payment proof, click the button below!
          </small>
        ) : (
          ""
        )}
        <div className="flex mt-5">
          <Form form={formConfirmOrder} className="w-full">
            <Form.Item noStyle name="invoice" className="w-full">
              <Upload
                listType="picture"
                className="w-full"
                fileList={imageList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
                maxCount={3}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: false,
                  showDownloadIcon: false,
                }}
              >
                {order.status === "Complete" || order.status === "Cancel" ? (
                  <Button type="dashed" className="border-primary text-primary max-sm:text-xs" icon={<UploadOutlined />} disabled>
                    Click to Upload
                  </Button>
                ) : (
                  <Button type="dashed" className="border-primary text-primary max-sm:text-xs" icon={<UploadOutlined />}>
                    Click to Upload
                  </Button>
                )}
              </Upload>
            </Form.Item>
          </Form>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              className="w-full"
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

      <div className="flex flex-col gap-6 p-6 text-sm font-normal bg-white max-sm:p-5 rounded-3xl">
        {order.order_type === "Bank" ? (
          order.status === "Awaiting Payment" ? (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-base font-bold max-sm:text-sm">Payment Information</h1>
                {isEdit && (
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    htmlType="submit"
                    form="editForm"
                    className="max-sm:text-xs underline text-primary"
                  >
                    Submit Data
                  </Button>
                )}
                {!isEdit && (
                  <Button style={{ padding: 0 }} type="link" onClick={handleEdit} className="max-sm:text-xs underline text-primary">
                    Edit Data
                  </Button>
                )}
              </div>
              <Form
                id="editForm"
                layout="vertical"
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
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Bank Name"
                    disabled={!isEdit}
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
                <Form.Item
                  label="Bank Number"
                  name="bank_number"
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank number!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Bank Number"
                    disabled={!isEdit}
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
                <Form.Item
                  label="Bank Branch"
                  name="bank_branch"
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank branch!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Bank Branch"
                    disabled={!isEdit}
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
                <Form.Item
                  label="Account Name"
                  name="account_name"
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your account name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Account Name"
                    disabled={!isEdit}
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
              </Form>
            </>
          ) : order.status === "Pending" ? (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-base font-bold max-sm:text-sm">Payment Information</h1>
                {isEdit && (
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    htmlType="submit"
                    form="editForm"
                    className="max-sm:text-xs underline text-primary"
                  >
                    Submit Data
                  </Button>
                )}
                {!isEdit && (
                  <Button style={{ padding: 0 }} type="link" onClick={handleEdit} className="max-sm:text-xs underline text-primary">
                    Edit Data
                  </Button>
                )}
              </div>
              <Form
                id="editForm"
                layout="vertical"
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
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Bank Name"
                    disabled={!isEdit}
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
                <Form.Item
                  label="Bank Number"
                  name="bank_number"
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank number!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Bank Number"
                    disabled={!isEdit}
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
                <Form.Item
                  label="Bank Branch"
                  name="bank_branch"
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank branch!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Bank Branch"
                    disabled={!isEdit}
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
                <Form.Item
                  label="Account Name"
                  name="account_name"
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your account name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Account Name"
                    disabled={!isEdit}
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
              </Form>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-base font-bold max-sm:text-sm">Payment Information</h1>
              </div>
              <Form
                id="editForm"
                layout="vertical"
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
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank name!",
                    },
                  ]}
                >
                  <Input placeholder="Bank Name" disabled className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border" />
                </Form.Item>
                <Form.Item
                  label="Bank Number"
                  name="bank_number"
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank number!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Bank Number"
                    disabled
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
                <Form.Item
                  label="Bank Branch"
                  name="bank_branch"
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your bank branch!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Bank Branch"
                    disabled
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
                <Form.Item
                  label="Account Name"
                  name="account_name"
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Please input your account name!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Account Name"
                    disabled
                    className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                  />
                </Form.Item>
              </Form>
            </>
          )
        ) : // ALI FORM
        order.status === "Awaiting Payment" ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold max-sm:text-sm">Payment Information ali</h1>
              {isEdit && (
                <Button
                  style={{ padding: 0 }}
                  type="link"
                  htmlType="submit"
                  form="editForm"
                  className="max-sm:text-xs underline text-primary"
                >
                  Submit Data
                </Button>
              )}
              {!isEdit && (
                <Button style={{ padding: 0 }} type="link" onClick={handleEdit} className="max-sm:text-xs underline text-primary">
                  Edit Data
                </Button>
              )}
            </div>
            <Form
              id="editForm"
              layout="vertical"
              initialValues={{
                ali_number_or_email: order.ali_number_or_email,
                ali_name: order.ali_name,
                bank_branch: order.bank_branch,
                account_name: order.account_name,
              }}
              onFinish={handleSubmitEdit}
            >
              <Form.Item
                label="No / Email"
                name="ali_number_or_email"
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: "Please input your no / email!",
                  },
                ]}
              >
                <Input
                  placeholder="No / Email"
                  disabled={!isEdit}
                  className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                />
              </Form.Item>
              <Form.Item
                label="Name"
                name="ali_name"
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input
                  placeholder="Name"
                  disabled={!isEdit}
                  className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                />
              </Form.Item>
              <Form.Item noStyle name="qr_qode" className="w-full">
                <div className="p-4 bg-[#F7F9FC] rounded-md !w-full flex justify-between items-center">
                  <Upload
                    listType="picture"
                    className="w-full"
                    fileList={qrCodeList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    maxCount={3}
                    showUploadList={{
                      showPreviewIcon: true,
                      showRemoveIcon: false,
                      showDownloadIcon: false,
                    }}
                  >
                    {order.status === "Complete" || order.status === "Cancel" ? (
                      <Button type="dashed" className="border-primary text-primary max-sm:text-xs" icon={<UploadOutlined />} disabled>
                        QR Code
                      </Button>
                    ) : (
                      <Button type="dashed" className="border-primary text-primary max-sm:text-xs" icon={<UploadOutlined />}>
                        QR Code
                      </Button>
                    )}
                    <span className="ml-2 max-sm:text-xs text-gray-500">(Optional)</span>
                  </Upload>
                </div>
              </Form.Item>
            </Form>
          </>
        ) : order.status === "Pending" ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold max-sm:text-sm">Payment Information</h1>
              {isEdit && (
                <Button
                  style={{ padding: 0 }}
                  type="link"
                  htmlType="submit"
                  form="editForm"
                  className="max-sm:text-xs underline text-primary"
                >
                  Submit Data
                </Button>
              )}
              {!isEdit && (
                <Button style={{ padding: 0 }} type="link" onClick={handleEdit} className="max-sm:text-xs underline text-primary">
                  Edit Data
                </Button>
              )}
            </div>
            <Form
              id="editForm"
              layout="vertical"
              initialValues={{
                ali_number_or_email: order.ali_number_or_email,
                ali_name: order.ali_name,
                bank_branch: order.bank_branch,
                account_name: order.account_name,
              }}
              onFinish={handleSubmitEdit}
            >
              <Form.Item
                label="No / Email"
                name="ali_number_or_email"
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: "Please input your no / email!",
                  },
                ]}
              >
                <Input
                  placeholder="No / Email"
                  disabled={!isEdit}
                  className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                />
              </Form.Item>
              <Form.Item
                label="Name"
                name="ali_name"
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input
                  placeholder="Name"
                  disabled={!isEdit}
                  className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                />
              </Form.Item>
              <Form.Item noStyle name="qr_qode" className="w-full">
                <div className="p-4 bg-[#F7F9FC] rounded-md !w-full flex justify-between items-center">
                  <Upload
                    listType="picture"
                    className="w-full"
                    fileList={qrCodeList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    maxCount={3}
                    showUploadList={{
                      showPreviewIcon: true,
                      showRemoveIcon: false,
                      showDownloadIcon: false,
                    }}
                  >
                    {order.status === "Complete" || order.status === "Cancel" ? (
                      <Button type="dashed" className="border-primary text-primary max-sm:text-xs" icon={<UploadOutlined />} disabled>
                        QR Code
                      </Button>
                    ) : (
                      <Button type="dashed" className="border-primary text-primary max-sm:text-xs" icon={<UploadOutlined />}>
                        QR Code
                      </Button>
                    )}
                    <span className="ml-2 max-sm:text-xs text-gray-500">(Optional)</span>
                  </Upload>
                </div>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold max-sm:text-sm">Payment Information</h1>
            </div>
            <Form
              id="editForm"
              layout="vertical"
              initialValues={{
                ali_number_or_email: order.ali_number_or_email,
                ali_name: order.ali_name,
                bank_branch: order.bank_branch,
                account_name: order.account_name,
              }}
              onFinish={handleSubmitEdit}
            >
              <Form.Item
                label="No / Email"
                name="ali_number_or_email"
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: "Please input your no / email!",
                  },
                ]}
              >
                <Input placeholder="No / Email" disabled className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border" />
              </Form.Item>
              <Form.Item
                label="Name"
                name="ali_name"
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <Input placeholder="Name" disabled className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border" />
              </Form.Item>
              <Form.Item noStyle name="qr_qode" className="w-full">
                <div className="p-4 bg-[#F7F9FC] rounded-md !w-full flex justify-between items-center">
                  <Upload
                    listType="picture"
                    className="w-full"
                    fileList={qrCodeList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    maxCount={3}
                    showUploadList={{
                      showPreviewIcon: true,
                      showRemoveIcon: false,
                      showDownloadIcon: false,
                    }}
                  >
                    {order.status === "Complete" || order.status === "Cancel" ? (
                      <Button type="dashed" className="border-primary text-primary max-sm:text-xs" icon={<UploadOutlined />} disabled>
                        QR Code
                      </Button>
                    ) : (
                      <Button type="dashed" className="border-primary text-primary max-sm:text-xs" icon={<UploadOutlined />}>
                        QR Code
                      </Button>
                    )}
                    <span className="ml-2 max-sm:text-xs text-gray-500">(Optional)</span>
                  </Upload>
                </div>
              </Form.Item>
            </Form>
          </>
        )}
      </div>

      <div className="flex items-center justify-between p-6 bg-white max-sm:p-5 rounded-3xl max-sm:text-sm">
        <span className="font-bold">Total Paid</span>
        <span className="font-bold">{isPending ? "-" : `${formatRupiah(Number(order.amount) * order.selling_price)}`}</span>
      </div>

      {order.status === "Awaiting Payment" ? (
        <>
          <Button
            onClick={handleCancelOrder}
            danger
            className="w-full px-2 py-6 font-semibold text-black bg-white rounded-full max-sm:text-sm"
          >
            Cancel
          </Button>
          <Form form={formConfirmOrder} onFinish={handleConfirmOrder} onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}>
            <Form.Item noStyle className="w-full">
              <Button htmlType="submit" className="w-full px-2 py-6 font-semibold text-white rounded-full bg-primary max-sm:text-sm">
                Confirm Payment
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <Button onClick={() => navigate("/")} className="w-full px-2 py-6 font-semibold text-white bg-primary rounded-full max-sm:text-sm">
          Back
        </Button>
      )}
    </div>
  );
};
export default OrderDetail;
