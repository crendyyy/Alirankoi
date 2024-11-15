import {
  ClockCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Status from "../components/shared/Status";
import { Button, Carousel, Form, Image, Input, Upload } from "antd";
import Title from "antd/es/typography/Title";
import { useLocation, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { useGetStock } from "../components/service/stock/useGetStock";
import { formatRupiah } from "../libs/utils";
import {
  useCancelOrderUser,
  useConfirmOrderUser,
  useUpdateOrderUser,
} from "../components/service/user/order/useUpdateOrderUser";
import { AuthContext } from "../context/AuthContext";
import Countdown from "../components/shared/Countdown";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { order } = state;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [orderId, setOrderId] = useState();
  const [qrLength, setQrLength] = useState();
  const { auth } = useContext(AuthContext);

  const editOrderMutation = useUpdateOrderUser();
  const confirmOrderMutation = useConfirmOrderUser();
  const cancelOrderMutation = useCancelOrderUser();

  const [qrCodeList, setQrCodeList] = useState([]);
  useEffect(() => {
    if (order.orders && order.orders.length > 0) {
      const updatedQrCodeList = order.orders.map((orderItem, index) => ({
        uid: `${index}`,
        name: orderItem.ali_qr || `qr_code_${index}`, // Berikan nama default jika tidak ada QR
        status: "done",
        url: orderItem.ali_qr
          ? `http://localhost:3000/picture/${orderItem.ali_qr}`
          : "",
      }));
      setQrCodeList(updatedQrCodeList);
    }
  }, [order.orders]);

  const invoiceUrl = `http://localhost:3000/picture/${order.invoice_name}`;
  const [invoiceList, setInvoiceList] = useState([
    {
      uid: "-1",
      name: order.invoice_name,
      status: "done",
      url: invoiceUrl,
    },
  ]);

  console.log(orderId);
  console.log("qrLength", qrLength?.name.length);
  const [imageList, setImageList] = useState([]);
  const [imageEditList, setImageEditList] = useState([]);

  const [formConfirmOrder] = Form.useForm();

  const handleEdit = (orderItemId, qrCodeLength) => {
    setOrderId(orderItemId); // Set orderId dari item yang diedit
    setIsEdit(true); // Aktifkan mode edit
    setQrLength(qrCodeLength);
  };

  const handleSubmitEditBank = (value) => {
    const data = {
      bank_number: value.bank_number,
      bank_detail: value.bank_detail,
      bank_branch: value.bank_branch,
      account_name: value.account_name,
    };

    editOrderMutation.mutate({ id: orderId, data });
    setIsEdit(false);
  };

  const handleSubmitEditAli = async (value) => {
    console.log("qrCodeList:", qrCodeList);

    let file = null;

    if (qrLength?.name.length > 0) {
      // Ambil file terbar  u dari qrCodeList jika ada
      file = qrCodeList[0].originFileObj;
    } else if (imageEditList[0]?.originFileObj) {
      // Ambil dari imageEditList jika qrCodeList kosong
      file = imageEditList[0].originFileObj;
    }
    console.log("File to be submitted:", file);
    const formData = new FormData();
    formData.append("ali_number_or_email", value.ali_number_or_email);
    formData.append("ali_name", value.ali_name);

    if (file) {
      // Jika ada file baru, kirim file tersebut
      formData.append("qr", file);
    }

    await editOrderMutation.mutate({ id: orderId, data: formData });
    setIsEdit(false);
  };

  const handleConfirmOrder = async () => {
    const formData = new FormData();
    formData.append("invoice", imageList[0]?.originFileObj);
    formData.append("token", auth.token);

    try {
      await confirmOrderMutation.mutate({
        id: order._id,
        data: formData,
      });
      console.log("Confirm order successfully.");
      navigate("/home");
    } catch (error) {
      console.error("Error confirm order", error);
    }

    formConfirmOrder.resetFields();
  };

  const handleCancelOrder = () => {
    cancelOrderMutation.mutate({ id: order._id });
    navigate("/home");
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const tenMinutesAfterCreatedAt = new Date(
    new Date(order.createdAt).getTime() + 10 * 60 * 1000
  ).toISOString();

  const handleChange = ({ fileList }) => setImageList(fileList);
  const handleChangeQr = ({ fileList }) => {
    if (order.ali_qr?.length > 0) {
      // Update qrCodeList if order.ali_qr already has data
      setQrCodeList(fileList);
    } else {
      // Update imageEditList if there's no initial QR data
      setImageEditList(fileList);
    }
  };
  const handleChangeQrtes = ({ fileList }, index) => {
    console.log("File uploaded:", fileList);
    // Update qrCodeList at the correct index with the latest file
    const updatedQrCodeList = [...qrCodeList];

    // Hanya simpan file yang terbaru (index terakhir dari fileList)
    const latestFile = fileList[fileList.length - 1];
    updatedQrCodeList[index] = latestFile;

    setQrCodeList(updatedQrCodeList);
  };

  return (
    <div className="bg-[#F8F8F8] h-full w-full flex flex-col gap-4 max-sm:gap-3.5 mb-24 px-3">
      <h1 className="p-6 font-bold bg-white max-sm:p-5 rounded-b-3xl">
        Order Detail
      </h1>
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
          <p>{order._id}</p>
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
          <p>¥ {formatRupiah(order.totalAmount, false)}</p>
        </div>
      </div>
      {order.status === "Awaiting Payment" && (
        <div className="flex justify-between p-6 max-sm:p-5 bg-[#FECACA] rounded-3xl border-2 border-dashed border-[#DC2626] gap-2 max-sm:gap-3">
          <p className="max-sm:text-xs text-sm text-[#DC2626]">
            Upload payment proof before time runs out to avoid order
            cancellation.
          </p>
          <div className="flex items-center gap-2">
            <ClockCircleOutlined className="text-[#DC2626]" />
            <p className="text-xs text-[#DC2626] font-bold">
              <Countdown endTime={tenMinutesAfterCreatedAt} />
            </p>
          </div>
        </div>
      )}
      <div className="p-6 bg-white max-sm:p-5 rounded-3xl">
        <h1 className="text-base font-bold max-sm:text-sm">Payment Proof</h1>
        {order.status === "Awaiting Payment" ? (
          <div>
            <small className="flex gap-1 items-center my-2 max-sm:items-start text-[#9CA3AF]">
              <InfoCircleOutlined className="max-sm:mt-1" />
              Upload your payment proof below!
            </small>
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
                      showRemoveIcon: true,
                      showDownloadIcon: false,
                    }}
                  >
                    {order.status === "Complete" ||
                    order.status === "Cancel" ||
                    order.status === "Pending" ? (
                      <Button
                        type="dashed"
                        className="border-primary text-primary max-sm:text-xs"
                        icon={<UploadOutlined />}
                        disabled
                      >
                        Click to Upload
                      </Button>
                    ) : (
                      <Button
                        type="dashed"
                        className="border-primary text-primary max-sm:text-xs"
                        icon={<UploadOutlined />}
                      >
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
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>
          </div>
        ) : (
          <div>
            {order.status === "Awaiting Payment" && (
              <small className="flex gap-1 items-center my-2 max-sm:items-start text-[#9CA3AF]">
                <InfoCircleOutlined className="max-sm:mt-1" />
                If you need to upload a new payment proof, click the button
                below!
              </small>
            )}
            <div className="flex mt-5">
              <Upload
                listType="picture"
                className="w-full"
                fileList={invoiceList}
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
                {order.status === "Complete" ||
                order.status === "Cancel" ||
                order.status === "Pending" ? (
                  <Button
                    type="dashed"
                    className="border-primary text-primary max-sm:text-xs"
                    icon={<UploadOutlined />}
                    disabled
                  >
                    Click to Upload
                  </Button>
                ) : (
                  <Button
                    type="dashed"
                    className="border-primary text-primary max-sm:text-xs"
                    icon={<UploadOutlined />}
                  >
                    Click to Upload
                  </Button>
                )}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  className="w-full"
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col h-auto gap-6 p-6 text-sm font-normal bg-white max-sm:p-5 rounded-3xl">
        {order.order_type === "Bank" ? (
          order.status === "Awaiting Payment" ? (
            // Carousel Bank
            <Carousel arrows infinite={false} className="carousel-order-detail">
              {order.orders.map((order, index) => (
                <>
                  <div
                    key={index}
                    className="flex items-center justify-between mb-5"
                  >
                    <h1 className="text-base font-bold max-sm:text-sm">
                      <span className="mr-2">#{index + 1}</span>Payment
                      Information
                    </h1>
                    {isEdit && orderId === order._id && (
                      <Button
                        style={{ padding: 0 }}
                        type="link"
                        htmlType="submit"
                        form={`editForm_${order._id}`} // Set form ID dinamis sesuai dengan orderItem._id
                        className="underline max-sm:text-xs text-primary"
                      >
                        Submit Data
                      </Button>
                    )}
                    {!isEdit && (
                      <Button
                        style={{ padding: 0 }}
                        type="link"
                        onClick={() => handleEdit(order._id)} // Set orderId saat tombol edit ditekan
                        className="underline max-sm:text-xs text-primary"
                      >
                        Edit Data
                      </Button>
                    )}
                  </div>
                  <Form
                    id={`editForm_${order._id}`}
                    layout="vertical"
                    initialValues={{
                      bank_detail: order.bank_detail,
                      bank_number: order.bank_number,
                      bank_branch: order.bank_branch,
                      account_name: order.account_name,
                    }}
                    onFinish={handleSubmitEditBank}
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
                        disabled={!isEdit || orderId !== order._id}
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
                        disabled={!isEdit || orderId !== order._id}
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
                        disabled={!isEdit || orderId !== order._id}
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
                        disabled={!isEdit || orderId !== order._id}
                        className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                      />
                    </Form.Item>
                    <span className="font-medium text-sm text-[#9CA3AF] flex mb-4">{`Amount : ¥ ${order.amount}`}</span>
                  </Form>
                </>
              ))}
            </Carousel>
          ) : order.status === "Pending" ? (
            <Carousel arrows infinite={false} className="carousel-order-detail">
              {order.orders.map((order, index) => (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h1 className="text-base font-bold max-sm:text-sm">
                      <span className="mr-2">#{index + 1}</span>Payment
                      Information
                    </h1>
                    {isEdit && orderId === order._id && (
                      <Button
                        style={{ padding: 0 }}
                        type="link"
                        htmlType="submit"
                        form={`editForm_${order._id}`} // Set form ID dinamis sesuai dengan orderItem._id
                        className="underline max-sm:text-xs text-primary"
                      >
                        Submit Data
                      </Button>
                    )}
                    {!isEdit && (
                      <Button
                        style={{ padding: 0 }}
                        type="link"
                        onClick={() => handleEdit(order._id)} // Set orderId saat tombol edit ditekan
                        className="underline max-sm:text-xs text-primary"
                      >
                        Edit Data
                      </Button>
                    )}
                  </div>
                  <Form
                    id={`editForm_${order._id}`}
                    layout="vertical"
                    initialValues={{
                      bank_detail: order.bank_detail,
                      bank_number: order.bank_number,
                      bank_branch: order.bank_branch,
                      account_name: order.account_name,
                    }}
                    onFinish={handleSubmitEditBank}
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
                        disabled={!isEdit || orderId !== order._id}
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
                        disabled={!isEdit || orderId !== order._id}
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
                        disabled={!isEdit || orderId !== order._id}
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
                        disabled={!isEdit || orderId !== order._id}
                        className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                      />
                    </Form.Item>
                    <span className="font-medium text-sm text-[#9CA3AF] flex mb-4">{`Amount : ¥ ${order.amount}`}</span>
                  </Form>
                </>
              ))}
            </Carousel>
          ) : (
            <Carousel arrows infinite={false} className="carousel-order-detail">
              {order.orders.map((order, index) => (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h1 className="text-base font-bold max-sm:text-sm">
                      <span className="mr-2">#{index + 1}</span>Payment
                      Information
                    </h1>
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
                    onFinish={handleSubmitEditBank}
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
                        disabled
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
                    <span className="font-medium text-sm text-[#9CA3AF] flex mb-4">{`Amount : ¥ ${order.amount}`}</span>
                  </Form>
                </>
              ))}
            </Carousel>
          )
        ) : // ALI FORM
        order.status === "Awaiting Payment" ? (
          <Carousel arrows infinite={false} className="carousel-order-detail">
            {order.orders.map((order, index) => (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-base font-bold max-sm:text-sm">
                    <span className="mr-2">#{index + 1}</span>Payment
                    Information
                  </h1>
                  {isEdit && orderId === order?._id && (
                    <Button
                      style={{ padding: 0 }}
                      type="link"
                      htmlType="submit"
                      form={`editForm_${order?._id}`} // Set form ID dinamis sesuai dengan orderItem._id
                      className="underline max-sm:text-xs text-primary"
                    >
                      Submit Data
                    </Button>
                  )}
                  {!isEdit && (
                    <Button
                      style={{ padding: 0 }}
                      type="link"
                      onClick={() => handleEdit(order?._id, qrCodeList[index])} // Set orderId saat tombol edit ditekan
                      className="underline max-sm:text-xs text-primary"
                    >
                      Edit Data
                    </Button>
                  )}
                </div>
                <Form
                  id={`editForm_${order?._id}`}
                  layout="vertical"
                  initialValues={{
                    ali_number_or_email: order.ali_number_or_email,
                    ali_name: order.ali_name,
                  }}
                  onFinish={handleSubmitEditAli}
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
                      disabled={!isEdit || orderId !== order?._id}
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
                      disabled={!isEdit || orderId !== order?._id}
                      className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                    />
                  </Form.Item>
                  <Form.Item noStyle name="file" className="w-full">
                    <span className="font-medium">
                      <span className="text-xs text-red-500">*</span> QR Code
                    </span>
                    <div className="p-4 bg-[#F7F9FC] rounded-md !w-full flex justify-between items-center mt-2">
                      {order.ali_qr?.length > 0 ? (
                        <Upload
                          listType="picture"
                          className="w-full"
                          fileList={
                            qrCodeList[index] ? [qrCodeList[index]] : []
                          }
                          onChange={(info) => handleChangeQrtes(info, index)}
                          beforeUpload={() => false}
                          maxCount={3}
                          disabled={!isEdit || orderId !== order?._id}
                          showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: isEdit,
                            showDownloadIcon: false,
                          }}
                        >
                          {order.status === "Complete" ||
                          order.status === "Cancel" ? (
                            <Button
                              type="dashed"
                              className="border-primary text-primary max-sm:text-xs"
                              icon={<UploadOutlined />}
                              disabled
                            >
                              QR Code
                            </Button>
                          ) : (
                            <Button
                              type="dashed"
                              className="border-primary text-primary max-sm:text-xs"
                              icon={<UploadOutlined />}
                              disabled={!isEdit || orderId !== order?._id}
                            >
                              QR Code
                            </Button>
                          )}
                          <span className="ml-2 text-gray-500 max-sm:text-xs">
                            (Optional)
                          </span>
                        </Upload>
                      ) : (
                        <>
                          <Upload
                            listType="picture"
                            className="w-full"
                            fileList={imageEditList}
                            onPreview={handlePreview}
                            onChange={handleChangeQr}
                            beforeUpload={() => false}
                            maxCount={3}
                            disabled={!isEdit || orderId !== order?._id}
                            showUploadList={{
                              showPreviewIcon: true,
                              showRemoveIcon: isEdit,
                              showDownloadIcon: false,
                            }}
                          >
                            <Button
                              type="dashed"
                              className="border-primary text-primary max-sm:text-xs"
                              icon={<UploadOutlined />}
                              disabled={!isEdit || orderId !== order?._id}
                            >
                              QR Code
                            </Button>

                            <span className="ml-2 text-gray-500 max-sm:text-xs">
                              (Optional)
                            </span>
                          </Upload>
                        </>
                      )}
                    </div>
                  </Form.Item>
                  <span className="font-medium text-sm text-[#9CA3AF] flex mb-4 mt-4">
                    {`Amount : ¥ ${order.amount}`}
                  </span>
                </Form>
              </>
            ))}
          </Carousel>
        ) : order.status === "Pending" ? (
          <Carousel arrows infinite={false} className="carousel-order-detail">
            {order.orders.map((order, index) => (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-base font-bold max-sm:text-sm">
                    <span className="mr-2">#{index + 1}</span>Payment
                    Information
                  </h1>
                  {isEdit && orderId === order?._id && (
                    <Button
                      style={{ padding: 0 }}
                      type="link"
                      htmlType="submit"
                      form={`editForm_${order?._id}`} // Set form ID dinamis sesuai dengan orderItem._id
                      className="underline max-sm:text-xs text-primary"
                    >
                      Submit Data
                    </Button>
                  )}
                  {!isEdit && (
                    <Button
                      style={{ padding: 0 }}
                      type="link"
                      onClick={() => handleEdit(order?._id)} // Set orderId saat tombol edit ditekan
                      className="underline max-sm:text-xs text-primary"
                    >
                      Edit Data
                    </Button>
                  )}
                </div>
                <Form
                  id={`editForm_${order?._id}`}
                  layout="vertical"
                  initialValues={{
                    ali_number_or_email: order.ali_number_or_email,
                    ali_name: order.ali_name,
                  }}
                  onFinish={handleSubmitEditAli}
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
                      disabled={!isEdit || orderId !== order?._id}
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
                      disabled={!isEdit || orderId !== order?._id}
                      className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                    />
                  </Form.Item>
                  <Form.Item noStyle name="file" className="w-full">
                    <span className="font-medium">
                      <span className="text-xs text-red-500">*</span> QR Code
                    </span>
                    <div className="p-4 bg-[#F7F9FC] rounded-md !w-full flex justify-between items-center mt-2">
                      {order.ali_qr?.length > 0 ? (
                        <Upload
                          listType="picture"
                          className="w-full"
                          fileList={
                            qrCodeList[index] ? [qrCodeList[index]] : []
                          }
                          onPreview={handlePreview}
                          onChange={(info) => handleChangeQrtes(info, index)}
                          beforeUpload={() => false}
                          maxCount={3}
                          disabled={!isEdit || orderId !== order?._id}
                          showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: false,
                            showDownloadIcon: false,
                          }}
                        >
                          {order.status === "Complete" ||
                          order.status === "Cancel" ? (
                            <Button
                              type="dashed"
                              className="border-primary text-primary max-sm:text-xs"
                              icon={<UploadOutlined />}
                              disabled
                            >
                              QR Code
                            </Button>
                          ) : (
                            <Button
                              type="dashed"
                              className="border-primary text-primary max-sm:text-xs"
                              icon={<UploadOutlined />}
                              disabled={!isEdit || orderId !== order?._id}
                            >
                              QR Code
                            </Button>
                          )}
                          <span className="ml-2 text-gray-500 max-sm:text-xs">
                            (Optional)
                          </span>
                        </Upload>
                      ) : (
                        <>
                          <Upload
                            listType="picture"
                            className="w-full"
                            fileList={imageEditList}
                            onPreview={handlePreview}
                            onChange={handleChangeQr}
                            beforeUpload={() => false}
                            maxCount={3}
                            disabled={!isEdit || orderId !== order?._id}
                            showUploadList={{
                              showPreviewIcon: true,
                              showRemoveIcon: false,
                              showDownloadIcon: false,
                            }}
                          >
                            <Button
                              type="dashed"
                              className="border-primary text-primary max-sm:text-xs"
                              icon={<UploadOutlined />}
                              disabled={!isEdit || orderId !== order?._id}
                            >
                              QR Code
                            </Button>

                            <span className="ml-2 text-gray-500 max-sm:text-xs">
                              (Optional)
                            </span>
                          </Upload>
                        </>
                      )}
                    </div>
                  </Form.Item>
                  <span className="font-medium text-sm text-[#9CA3AF] flex mb-4 mt-4">
                    {`Amount : ¥ ${order.amount}`}
                  </span>
                </Form>
              </>
            ))}
          </Carousel>
        ) : (
          <Carousel arrows infinite={false} className="carousel-order-detail">
            {order.orders.map((order, index) => (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-base font-bold max-sm:text-sm">
                    <span className="mr-2">#{index + 1}</span>Payment
                    Information
                  </h1>
                </div>
                <Form
                  id="editForm"
                  layout="vertical"
                  initialValues={{
                    ali_number_or_email: order.ali_number_or_email,
                    ali_name: order.ali_name,
                  }}
                  onFinish={handleSubmitEditBank}
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
                      disabled
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
                      disabled
                      className="bg-[#F7F9FC] p-2.5 rounded-md font-medium border-white hover:border"
                    />
                  </Form.Item>
                  <Form.Item noStyle name="file" className="w-full">
                    <span className="font-medium">
                      <span className="text-xs text-red-500">*</span> QR Code
                    </span>
                    <div className="p-4 bg-[#F7F9FC] rounded-md !w-full flex justify-between items-center mt-2">
                      {order.ali_qr?.length > 0 ? (
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
                          {order.status === "Complete" ||
                          order.status === "Cancel" ? (
                            <Button
                              type="dashed"
                              className="border-primary text-primary max-sm:text-xs"
                              icon={<UploadOutlined />}
                              disabled
                            >
                              QR Code
                            </Button>
                          ) : (
                            <Button
                              type="dashed"
                              className="border-primary text-primary max-sm:text-xs"
                              icon={<UploadOutlined />}
                            >
                              QR Code
                            </Button>
                          )}
                          <span className="ml-2 text-gray-500 max-sm:text-xs">
                            (Optional)
                          </span>
                        </Upload>
                      ) : (
                        <span className="text-xs italic text-gray-400">
                          Not Uplouded
                        </span>
                      )}
                    </div>
                  </Form.Item>
                  <span className="font-medium text-sm text-[#9CA3AF] flex mb-4 mt-4">
                    {`Amount : ¥ ${order.amount}`}
                  </span>
                </Form>
              </>
            ))}
          </Carousel>
        )}
      </div>
      <div className="flex items-center justify-between p-6 bg-white max-sm:p-5 rounded-3xl max-sm:text-sm">
        <span className="font-bold">Total Paid</span>
        <span className="font-bold">{`${formatRupiah(
          Number(order.totalAmount) * order.selling_price
        )}`}</span>
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
          <Form
            form={formConfirmOrder}
            onFinish={handleConfirmOrder}
            onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
          >
            <Form.Item noStyle className="w-full">
              <Button
                htmlType="submit"
                className="w-full px-2 py-6 font-semibold text-white rounded-full bg-primary max-sm:text-sm"
              >
                Confirm Payment
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <Button
          onClick={() => navigate("/home")}
          className="w-full px-2 py-6 font-semibold text-white rounded-full bg-primary max-sm:text-sm"
        >
          Back
        </Button>
      )}
    </div>
  );
};
export default OrderDetail;
