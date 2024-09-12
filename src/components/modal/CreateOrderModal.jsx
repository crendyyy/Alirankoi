import {
  AlipayOutlined,
  BankOutlined,
  ShoppingCartOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Upload,
} from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useGetUserList } from "../service/admin/orders/useGetUserList";
import { useCreateManualOrder } from "../service/admin/orders/useCreateManualOrder";
import { useCreateOrderGroup } from "../service/user/order/useCreateOrderGroup";

const CreateOrderModal = ({ isOpen, onConfirm, onCancel }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageList, setImageList] = useState([]);
  const [orderType, setOrderType] = useState("Bank");
  const [userId, setUserId] = useState("");

  const { data: userList, isPending, isError } = useGetUserList();
  const createOrderGroupMutation = useCreateOrderGroup();
  const createManualOrderMutation = useCreateManualOrder();

  const radioChangeHandle = (e) => {
    setOrderType(e.target.value);
  };
  const selectUserChangeHandle = (e) => {
    setUserId(e);
  };

  const handlePreview = (file) => {
    setPreviewImage(file.thumbUrl || file.preview);
    setPreviewOpen(true);
  };

  const [formBank] = Form.useForm();
  const [formAli] = Form.useForm();

  const handleCreateOrderBank = async (value) => {
    const file = imageList[0]?.originFileObj;
    const formData = new FormData();
    formData.append("amount", value.amount);
    formData.append("bank_number", value.bank_number);
    formData.append("bank_detail", value.bank_detail);
    formData.append("bank_branch", value.bank_branch);
    formData.append("account_name", value.account_name);

    formData.append("order_type", orderType);
    formData.append("user_id", userId);
    if (file) {
      formData.append("invoice", file);
    }

    await createManualOrderMutation.mutate(formData);
    formBank.resetFields();
    setImageList([]);
    onCancel();
  };

  const handleCreateOrderAli = async (value) => {
    try {
      // Step 1: Generate order_group_id using createOrderGroupMutation
      const orderGroupResponse = await createOrderGroupMutation.mutateAsync();
      const order_group_id = orderGroupResponse?.data?.payload?.order_group_id;

      if (!order_group_id) {
        console.error("Failed to retrieve order_group_id");
        return;
      }

      const file = imageList[0]?.originFileObj;
      const formData = new FormData();

      formData.append("amount", value.amount);
      formData.append("ali_number_or_email", value.ali_number_or_email);
      formData.append("ali_name", value.ali_name);

      if (file) {
        formData.append("invoice", file);
      }

      // Append additional fields
      formData.append("order_type", orderType);
      console.log(orderType);
      formData.append("user_id", userId);
      formData.append("order_group_id", order_group_id); // Attach the same order_group_id

      // Step 3: Send each order one by one
      await createManualOrderMutation.mutateAsync(formData);

      // Step 4: Clear forms and close modal
      formBank.resetFields();
      setImageList([]);
      onCancel();
    } catch (error) {
      console.error("Failed to create Ali order", error);
      // Handle error here, e.g., show an error notification
    }
  };

  const handleChange = ({ fileList }) => setImageList(fileList);
  return (
    <Modal
      title="Manual Order"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      width={650}
      footer={[
        <div
          key="cancel"
          className="w-full p-6 bg-[#F7F9FC] rounded-2xl flex gap-2"
        >
          <Button
            className="w-1/3 rounded-full py-6 text-red-500 bg-white hover:!bg-red-100 hover:!text-red-500 border border-red-300 shadow-none"
            type="primary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Form
            className="w-full"
            form={orderType === "Bank" ? formBank : formAli}
            onFinish={
              orderType === "Bank"
                ? handleCreateOrderBank
                : handleCreateOrderAli
            }
            onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
          >
            <Form.Item noStyle className="w-full">
              <Button
                className="w-full rounded-full py-6 text-white bg-primary hover:!bg-blue-400 "
                type="primary"
                htmlType="submit"
              >
                <ShoppingCartOutlined className="mb-1 text-xl" />
                Pay Now
              </Button>
            </Form.Item>
          </Form>
        </div>,
      ]}
    >
      <Flex className="w-full" vertical gap={24}>
        <Select
          rules={[
            {
              required: true,
              message: "Please choose username",
            },
          ]}
          className="h-10"
          loading={isPending}
          onChange={selectUserChangeHandle}
          showSearch
          style={{ width: "100%" }}
          placeholder="Search to select username"
          optionFilterProp="label"
          allowClear
          options={userList?.payload.map((user) => ({
            value: user.id,
            label: user.username,
          }))}
        />
        <Radio.Group
          className="flex w-full gap-2"
          defaultValue={orderType}
          onChange={radioChangeHandle}
        >
          <Radio.Button
            className="w-full !border-none !text-white flex items-center justify-center py-6 !rounded-full"
            value="Bank"
          >
            <BankOutlined className="mr-1 text-lg" /> Buy Bank
          </Radio.Button>
          <Radio.Button
            className="w-full !border-none !text-white flex items-center justify-center py-6 !rounded-full"
            value="Alipay"
          >
            <AlipayOutlined className="mr-1 text-lg" /> Buy Ali
          </Radio.Button>
        </Radio.Group>
        <Title level={5} className="!-mb-3">
          Bank Payment Information
        </Title>
        {orderType === "Bank" ? (
          <Form form={formBank}>
            <Flex gap="small" vertical>
              <Form.Item
                noStyle
                name="bank_detail"
                rules={[
                  {
                    required: true,
                    message: "Please input bank name",
                  },
                ]}
              >
                <Input
                  variant="filled"
                  placeholder="Bank Name"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
              <Form.Item
                noStyle
                name="bank_number"
                rules={[
                  {
                    required: true,
                    message: "Please input bank number",
                  },
                ]}
              >
                <Input
                  placeholder="Bank Number"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
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
                    message: "Please input bank branch",
                  },
                ]}
              >
                <Input
                  variant="filled"
                  placeholder="Bank Branch"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
              <Form.Item
                noStyle
                name="account_name"
                rules={[
                  {
                    required: true,
                    message: "Please input account name",
                  },
                ]}
              >
                <Input
                  variant="filled"
                  placeholder="Account Name"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
              <Form.Item noStyle name="invoice">
                <Form.Item
                  noStyle
                  name="invoice"
                  className="w-full"
                  rules={[
                    {
                      required: true,
                      message: "Please upload your invoice!",
                    },
                  ]}
                >
                  <div className="flex w-full p-6 rounded-md bg-[#F7F9FC]">
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
                      <Button
                        type="dashed"
                        className="border-primary text-primary max-sm:text-xs"
                        icon={<UploadOutlined />}
                      >
                        Invoice
                      </Button>
                    </Upload>
                  </div>
                </Form.Item>
                {/* </Form> */}
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
                    message: "Please input ur phone number or email",
                  },
                ]}
              >
                <Input
                  variant="filled"
                  placeholder="Number Phone / Email"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
              <Form.Item
                noStyle
                name="ali_name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name",
                  },
                ]}
              >
                <Input
                  variant="filled"
                  placeholder="Name"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
              <Flex justify="space-between">
                <Form.Item
                  noStyle
                  name="file"
                  rules={[
                    {
                      required: true,
                      message: "Please input your invoice",
                    },
                  ]}
                >
                  <div className="flex w-full p-6 rounded-md bg-[#F7F9FC]">
                    <Upload
                      listType="picture"
                      className="w-full"
                      fileList={imageList}
                      onPreview={handlePreview}
                      onChange={handleChange}
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
                          type="dashed"
                          icon={<UploadOutlined />}
                          className="border-primary text-primary max-sm:text-xs"
                        >
                          Invoice
                        </Button>
                      </Flex>
                    </Upload>
                  </div>
                </Form.Item>

                {previewImage && (
                  <Image
                    wrapperStyle={{
                      display: "none",
                    }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Flex>
            </Flex>
          </Form>
        )}
        <Title level={5}>Purchase Amount</Title>
        <Form form={orderType === "Bank" ? formBank : formAli}>
          <Form.Item
            noStyle
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input amount",
              },
            ]}
          >
            <InputNumber
              className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 w-full"
              variant="filled"
              prefix="¥"
              min={1}
              formatter={(value) =>
                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
              }
              parser={(value) => value.replace(/\.\s?|(\.)/g, "")}
            />
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  );
};
export default CreateOrderModal;
