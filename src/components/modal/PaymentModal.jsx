import Title from "antd/es/typography/Title";
import Modal from "../shared/Modal";
import {
  Button,
  Flex,
  Input,
  InputNumber,
  Upload,
  Image,
  Form,
  Carousel,
} from "antd";
import {
  AlipayOutlined,
  BankOutlined,
  PlusCircleOutlined,
  ShoppingCartOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { useCreateOrder } from "../service/user/order/useCreateOrder";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCreateOrderGroup } from "../service/user/order/useCreateOrderGroup";

const PaymentModal = ({ onClose, typeModal }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState("");
  const [previewImageQR, setPreviewImageQR] = useState("");
  const [submitType, setSubmitType] = useState("");
  const [formAdd, setFormAdd] = useState([]);
  const [qrCodeList, setqrCodeList] = useState([]);
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  const createOrderGroupMutation = useCreateOrderGroup();

  const createOrderMutation = useCreateOrder();

  const [formBank] = Form.useForm();
  const [formAli] = Form.useForm();
  console.log(formAdd);

  const handleAddCreateOrderBank = (values) => {
    const formData = new FormData();
    formData.append("amount", values.amount);
    formData.append("bank_number", values.bank_number);
    formData.append("bank_detail", values.bank_detail);
    formData.append("bank_branch", values.bank_branch);
    formData.append("account_name", values.account_name);
    formData.append("token", auth.token);
    formData.append("order_type", typeModal);

    const newForm = {
      id: formAdd.length + 1,
      formData,
    };

    setFormAdd([...formAdd, newForm]);
    formBank.resetFields();
  };

  const handleCreateOrderBank = async (value) => {
    const formData = new FormData();

    // Add the common fields (token and order_type)
    formData.append("token", auth.token);
    formData.append("order_type", typeModal);
    formData.append("amount", value.amount);
    formData.append("bank_number", value.bank_number);
    formData.append("bank_detail", value.bank_detail);
    formData.append("bank_branch", value.bank_branch);
    formData.append("account_name", value.account_name);

    if (formAdd.length > 0) {
      // If there are additional forms in formAdd, add all their fields one after another
      formAdd.forEach((form) => {
        formData.append("amount", form.formData.get("amount"));
        formData.append("bank_number", form.formData.get("bank_number"));
        formData.append("bank_detail", form.formData.get("bank_detail"));
        formData.append("bank_branch", form.formData.get("bank_branch"));
        formData.append("account_name", form.formData.get("account_name"));
      });

      try {
        const response = await createOrderMutation.mutateAsync(formData);
        const order = response.data.payload;

        console.log(order);

        navigate(`/order/${order?.order_type.toLowerCase()}/${order._id}`, {
          state: { order },
        });

        formBank.resetFields();
        setFormAdd([]); // Clear formAdd after submission
        setqrCodeList([]);
        onClose();
      } catch (error) {
        console.error("Failed to create orders", error);
      }
    } else {
      // If no additional forms in formAdd, handle the single form submission
      formData.append("amount", value.amount);
      formData.append("bank_number", value.bank_number);
      formData.append("bank_detail", value.bank_detail);
      formData.append("bank_branch", value.bank_branch);
      formData.append("account_name", value.account_name);

      try {
        const response = await createOrderMutation.mutateAsync(formData);
        const order = response.data.payload;

        console.log(order);

        navigate(`/order/${order?.order_type.toLowerCase()}/${order._id}`, {
          state: { order },
        });

        formBank.resetFields();
        setqrCodeList([]);
        onClose();
      } catch (error) {
        console.error("Failed to create order", error);
      }
    }
  };

  const handleAddCreateOrderAli = (value) => {
    const file = qrCodeList[0]?.originFileObj;
    const formData = new FormData();
    formData.append("amount", value.amount);
    formData.append("ali_number_or_email", value.ali_number_or_email);
    formData.append("ali_name", value.ali_name);

    if (file) {
      formData.append("file", file);
    }

    formData.append("token", auth.token);
    formData.append("order_type", typeModal);
    const newForm = {
      id: formAdd.length + 1,
      formData,
    };

    setFormAdd([...formAdd, newForm]);
    setqrCodeList([]);
    formAli.resetFields();
  };

  const handleCreateOrderAli = async (value) => {
    try {
      // Step 1: Generate order_group_id first using createOrderGroupMutation
      const orderGroupResponse = await createOrderGroupMutation.mutateAsync();
      const order_group_id = orderGroupResponse?.data?.payload?.order_group_id;
      console.log(order_group_id);

      if (!order_group_id) {
        console.error("Failed to retrieve order_group_id");
        return;
      }

      // Step 2: If formAdd has entries, handle multiple orders
      if (formAdd.length > 0) {
        // Loop through each form in formAdd
        for (const form of formAdd) {
          const formData = new FormData();
          const file = form.formData.get("file");

          // Append fields for each order
          formData.append("amount", form.formData.get("amount"));
          formData.append(
            "ali_number_or_email",
            form.formData.get("ali_number_or_email")
          );
          formData.append("ali_name", form.formData.get("ali_name"));
          if (file) {
            formData.append("qr", file);
          }

          // Add common fields
          formData.append("token", auth.token);
          formData.append("order_type", typeModal);
          formData.append("order_group_id", order_group_id); // Attach the generated order_group_id

          // Step 3: Send each order one by one
          const response = await createOrderMutation.mutateAsync(formData);
          const order = response.data.payload;
          console.log(order);

          // Navigate to the order detail page (for the last order)
          navigate(`/order/${order?.order_type.toLowerCase()}/${order._id}`, {
            state: { order },
          });
        }

        // Clear the forms and close the modal after all orders are sent
        formAli.resetFields();
        setFormAdd([]);
        setqrCodeList([]);
        onClose();
      } else {
        // Step 4: If there is only one order (no entries in formAdd)
        const file = qrCodeList[0]?.originFileObj;
        const formData = new FormData();

        // Append fields for the single order
        formData.append("amount", value.amount);
        formData.append("ali_number_or_email", value.ali_number_or_email);
        formData.append("ali_name", value.ali_name);
        if (file) {
          formData.append("qr", file);
        }

        // Add common fields
        formData.append("token", auth.token);
        formData.append("order_type", typeModal);
        formData.append("order_group_id", order_group_id); // Attach the generated order_group_id

        // Step 5: Send the single order
        const response = await createOrderMutation.mutateAsync(formData);
        const order = response.data.payload;

        console.log(order);
        navigate(`/order/${order?.order_type.toLowerCase()}/${order._id}`, {
          state: { order },
        });

        // Clear the forms and close the modal
        formAli.resetFields();
        setqrCodeList([]);
        onClose();
      }
    } catch (error) {
      console.error("Failed to create Ali order", error);
      // Handle error here, e.g., show an error notification
    }
  };

  const handlePreviewQR = (file) => {
    setPreviewImageQR(file.thumbUrl || file.preview);
    setPreviewOpen(true);
  };

  const handleChangeQR = ({ fileList }) => setqrCodeList(fileList);
  return (
    <Modal onCancel={onclose}>
      <div className="flex flex-col gap-2 bg-black rounded-t-3xl">
        <Carousel arrows infinite={false}>
          <>
            <div className="flex flex-col gap-3 max-sm:gap-3 p-6 max-sm:p-4 bg-[#111111] rounded-2xl">
              <div className="flex justify-between">
                <Title level={5} className="max-sm:!text-sm !text-white">
                  {typeModal === "Bank" ? (
                    <BankOutlined className="text-xl max-sm:!text-base mr-1" />
                  ) : (
                    <AlipayOutlined className="text-xl max-sm:!text-base mr-1" />
                  )}
                  Payment Information {typeModal}
                </Title>
                <span className="text-white">#1</span>
              </div>
              {typeModal === "Bank" ? (
                <Form form={formBank}>
                  <Flex gap="small" vertical>
                    <Form.Item
                      noStyle
                      name="bank_detail"
                      rules={[
                        {
                          required: true,
                          message: "Please input Bank Name",
                        },
                      ]}
                    >
                      <Input
                        variant="filled"
                        placeholder="Bank Name"
                        className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                      />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name="bank_number"
                      rules={[
                        {
                          required: true,
                          message: "Please input Bank Number",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Bank Number"
                        className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                        type="number"
                        variant="filled"
                      />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name="bank_branch"
                      rules={[
                        {
                          required: true,
                          message: "Please input Bank Branch",
                        },
                      ]}
                    >
                      <Input
                        variant="filled"
                        placeholder="Bank Branch"
                        className="flex items-center w-full h-12 px-4 max-sm:h-11 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                      />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name="account_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input Account Name",
                        },
                      ]}
                    >
                      <Input
                        variant="filled"
                        placeholder="Account Name"
                        className="flex items-center w-full h-12 px-4 max-sm:h-11 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                      />
                    </Form.Item>
                  </Flex>
                </Form>
              ) : (
                <Form form={formAli}>
                  <Flex vertical gap="small">
                    <Form.Item
                      noStyle
                      name="ali_number_or_email"
                      rules={[
                        {
                          required: true,
                          message: "Please input Number Phone / Email",
                        },
                      ]}
                    >
                      <Input
                        variant="filled"
                        placeholder="Number Phone / Email"
                        className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                      />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      name="ali_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input Ali Name",
                        },
                      ]}
                    >
                      <Input
                        variant="filled"
                        placeholder="Name"
                        className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                      />
                    </Form.Item>
                    <Flex justify="space-between">
                      <Form.Item noStyle name="file">
                        <div className="flex bg-[#1F222B] w-full p-6 max-sm:p-4 rounded-md">
                          <Upload
                            listType="picture"
                            className="w-full upload-payment-modal-user"
                            fileList={qrCodeList}
                            onPreview={handlePreviewQR}
                            onChange={handleChangeQR}
                            beforeUpload={() => false}
                            maxCount={1}
                            showUploadList={{
                              showPreviewIcon: true,
                              showRemoveIcon: true,
                              showDownloadIcon: false,
                            }}
                          >
                            <Flex gap="small" align="center">
                              <Button
                                icon={<UploadOutlined />}
                                className="hover:!border-black hover:!text-black max-sm:text-xs"
                              >
                                QR code
                              </Button>
                              <span className="text-[#9CA3AF] text-sm max-sm:text-xs">
                                {"(Optional)"}
                              </span>
                            </Flex>
                          </Upload>
                        </div>
                      </Form.Item>

                      {previewImageQR && (
                        <Image
                          wrapperStyle={{
                            display: "none",
                          }}
                          preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImageQR(""),
                          }}
                          src={previewImageQR}
                        />
                      )}
                    </Flex>
                  </Flex>
                </Form>
              )}
            </div>
            <div className="flex flex-col gap-2 max-sm:gap-2 p-6 max-sm:p-4 bg-[#111111] rounded-2xl">
              <Title level={5} className="max-sm:!text-sm !text-white">
                Purhcase Amount
              </Title>
              <Form form={typeModal === "Bank" ? formBank : formAli}>
                <Form.Item
                  noStyle
                  name="amount"
                  rules={[
                    {
                      required: true,
                      message: "Please input Amount",
                    },
                  ]}
                >
                  <InputNumber
                    className="input-number-custom  flex items-center w-full h-12 px-4 max-sm:h-11 placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B] active:bg-[#1F222B] !bg-[#1F222B] !text-white !hover:text-white !active:text-white"
                    variant="filled"
                    prefix="¥"
                    min={0}
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""
                    }
                    parser={(value) => value.replace(/\.\s?|(\.)/g, "")}
                  />
                </Form.Item>
              </Form>
            </div>
          </>
          {formAdd.map((form, index) => (
            <>
              <div
                key={index}
                className="flex flex-col gap-3 max-sm:gap-3 p-6 max-sm:p-4 bg-[#111111] rounded-2xl"
              >
                <div className="flex justify-between">
                  <Title level={5} className="max-sm:!text-sm !text-white">
                    {typeModal === "Bank" ? (
                      <BankOutlined className="text-xl max-sm:!text-base mr-1" />
                    ) : (
                      <AlipayOutlined className="text-xl max-sm:!text-base mr-1" />
                    )}
                    Payment Information {typeModal}
                  </Title>
                  <span className="text-white">{`#${index + 2}`}</span>
                </div>
                {typeModal === "Bank" ? (
                  <Form
                    initialValues={{
                      bank_detail: form.formData.get("bank_detail"),
                      bank_number: form.formData.get("bank_number"),
                      bank_branch: form.formData.get("bank_branch"),
                      account_name: form.formData.get("account_name"),
                    }}
                    onFinish={handleAddCreateOrderBank}
                  >
                    <Flex gap="small" vertical>
                      <Form.Item
                        noStyle
                        name="bank_detail"
                        rules={[
                          {
                            required: true,
                            message: "Please input Bank Name",
                          },
                        ]}
                      >
                        <Input
                          variant="filled"
                          placeholder="Bank Name"
                          className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name="bank_number"
                        rules={[
                          {
                            required: true,
                            message: "Please input Bank Number",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Bank Number"
                          className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                          type="number"
                          variant="filled"
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name="bank_branch"
                        rules={[
                          {
                            required: true,
                            message: "Please input Bank Branch",
                          },
                        ]}
                      >
                        <Input
                          variant="filled"
                          placeholder="Bank Branch"
                          className="flex items-center w-full h-12 px-4 max-sm:h-11 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name="account_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input Account Name",
                          },
                        ]}
                      >
                        <Input
                          variant="filled"
                          placeholder="Account Name"
                          className="flex items-center w-full h-12 px-4 max-sm:h-11 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                        />
                      </Form.Item>
                    </Flex>
                  </Form>
                ) : (
                  <Form
                    initialValues={{
                      ali_number_or_email: form.formData.get(
                        "ali_number_or_email"
                      ),
                      ali_name: form.formData.get("ali_name"),
                      qr: form.formData.get("qr"),
                    }}
                    onFinish={handleAddCreateOrderBank}
                  >
                    <Flex vertical gap="small">
                      <Form.Item
                        noStyle
                        name="ali_number_or_email"
                        rules={[
                          {
                            required: true,
                            message: "Please input Number Phone / Email",
                          },
                        ]}
                      >
                        <Input
                          variant="filled"
                          placeholder="Number Phone / Email"
                          className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        name="ali_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input Ali Name",
                          },
                        ]}
                      >
                        <Input
                          variant="filled"
                          placeholder="Name"
                          className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                        />
                      </Form.Item>
                      <Flex justify="space-between">
                        <Form.Item noStyle name="qr">
                          <div className="flex bg-[#1F222B] w-full p-6 max-sm:p-4 rounded-md">
                            <Upload
                              listType="picture"
                              className="w-full upload-payment-modal-user"
                              fileList={qrCodeList}
                              onPreview={handlePreviewQR}
                              onChange={handleChangeQR}
                              beforeUpload={() => false}
                              maxCount={1}
                              showUploadList={{
                                showPreviewIcon: true,
                                showRemoveIcon: true,
                                showDownloadIcon: false,
                              }}
                            >
                              <Flex gap="small" align="center">
                                <Button
                                  icon={<UploadOutlined />}
                                  className="hover:!border-black hover:!text-black max-sm:text-xs"
                                >
                                  QR code
                                </Button>
                                <span className="text-[#9CA3AF] text-sm max-sm:text-xs">
                                  {"(Optional)"}
                                </span>
                              </Flex>
                            </Upload>
                          </div>
                        </Form.Item>

                        {previewImageQR && (
                          <Image
                            wrapperStyle={{
                              display: "none",
                            }}
                            preview={{
                              visible: previewOpen,
                              onVisibleChange: (visible) =>
                                setPreviewOpen(visible),
                              afterOpenChange: (visible) =>
                                !visible && setPreviewImageQR(""),
                            }}
                            src={previewImageQR}
                          />
                        )}
                      </Flex>
                    </Flex>
                  </Form>
                )}
              </div>
              <div className="flex flex-col gap-2 max-sm:gap-2 p-6 max-sm:p-4 bg-[#111111] rounded-2xl">
                <Title level={5} className="max-sm:!text-sm !text-white">
                  Purhcase Amount
                </Title>
                <Form
                  onFinish={
                    typeModal === "Bank"
                      ? handleAddCreateOrderBank
                      : handleAddCreateOrderAli
                  }
                  initialValues={{ amount: form.formData.get("amount") }}
                >
                  <Form.Item
                    noStyle
                    name="amount"
                    rules={[
                      {
                        required: true,
                        message: "Please input Amount",
                      },
                    ]}
                  >
                    <InputNumber
                      className="input-number-custom  flex items-center w-full h-12 px-4 max-sm:h-11 placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B] active:bg-[#1F222B] !bg-[#1F222B] !text-white !hover:text-white !active:text-white"
                      variant="filled"
                      prefix="¥"
                      min={0}
                      formatter={(value) =>
                        value
                          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                          : ""
                      }
                      parser={(value) => value.replace(/\.\s?|(\.)/g, "")}
                    />
                  </Form.Item>
                </Form>
              </div>
            </>
          ))}
        </Carousel>
        <div className="flex p-6 max-sm:p-4 gap-2 bg-[#111111] rounded-t-2xl w-full">
          {/* Cancel Button */}
          <Button
            onClick={onClose}
            className="p-6 !bg-[#F3F4F6] w-[35%] rounded-full text-sm font-semibold text-black flex justify-center items-center hover:!border-white hover:!bg-transparent hover:!text-white"
          >
            Cancel
          </Button>

          {/* Single Form */}
          <Form
            className="w-full"
            form={typeModal === "Bank" ? formBank : formAli}
            onFinish={(values) => {
              // Decide which handler to call based on the button clicked
              if (submitType === "payNow") {
                typeModal === "Bank"
                  ? handleCreateOrderBank(values)
                  : handleCreateOrderAli(values);
              } else if (submitType === "addPayment") {
                typeModal === "Bank"
                  ? handleAddCreateOrderBank(values)
                  : handleAddCreateOrderAli(values);
              }
            }}
            onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
          >
            {/* Pay Now Button */}
            <Form.Item noStyle className="w-full">
              <Button
                htmlType="submit"
                className="flex items-center justify-center w-full p-6 text-sm font-bold text-white bg-primary border-primary rounded-full hover:!border-blue-700 hover:!text-white hover:!bg-blue-700"
                onClick={() => setSubmitType("payNow")} // Set submit type to pay now
              >
                <ShoppingCartOutlined className="-mt-1 text-xl" />
                Pay Now
              </Button>
            </Form.Item>

            {/* Add Another Payment Button */}
            <Form.Item noStyle className="w-full">
              <Button
                htmlType="submit"
                className={`after:content-['${2}'] after:border after:border-red-500 after:px-1.5 relative after:bg-red-100 after:text-[10px] after:rounded-full after:absolute after:top-0 after:right-0 after:text-red-500 !bg-[#F3F4F6] rounded-full max-sm:!w-[89px] px-[15px] max-sm:px-0 font-semibold text-black flex justify-center items-center`}
                onClick={() => setSubmitType("addPayment")} // Set submit type to add payment
              >
                <PlusCircleOutlined className="text-xl" />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentModal;
