import Title from "antd/es/typography/Title";
import Modal from "../shared/Modal";
import { Button, Flex, Input, InputNumber, Upload, Image, Form } from "antd";
import { AlipayOutlined, BankOutlined, ShoppingCartOutlined, UploadOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { useCreateOrder } from "../service/user/order/useCreateOrder";
import { AuthContext } from "../../context/AuthContext";

const PaymentModal = ({ onClose, typeModal }) => {
  const [paymentType, setPaymentType] = useState("Bank");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageList, setImageList] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    setPaymentType(typeModal);
  }, [typeModal]);

  const createOrderMutation = useCreateOrder();

  const [formBank] = Form.useForm();

  const handleCreateOrderBank = async (value) => {
    const file = imageList[0]?.originFileObj;
    const formData = new FormData();
    formData.append("amount", value.amount);
    formData.append("bank_number", value.bank_number);
    formData.append("bank_detail", value.bank_detail);
    formData.append("bank_branch", value.bank_branch);
    formData.append("account_name", value.account_name);

    if (file) {
      formData.append("file", file);
    }

    formData.append("token", auth.token);

    await createOrderMutation.mutate(formData);
    formBank.resetFields();
    setImageList([]);
  };

  const handlePreview = (file) => {
    setPreviewImage(file.thumbUrl || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList }) => setImageList(fileList);
  return (
    <Modal onCancel={onClose}>
      <div className="flex flex-col gap-2 bg-black rounded-t-3xl">
        <div className="flex flex-col gap-3 max-sm:gap-3 p-6 max-sm:p-4 bg-[#111111] rounded-2xl">
          <Title level={5} className="max-sm:!text-sm !text-white">
            {typeModal === "Bank" ? (
              <BankOutlined className="text-xl max-sm:!text-base mr-1" />
            ) : (
              <AlipayOutlined className="text-xl max-sm:!text-base mr-1" />
            )}
            Payment Information {typeModal}
          </Title>
          {paymentType === "Bank" ? (
            <Form form={formBank}>
              <Flex gap="small" vertical>
                <Form.Item noStyle name="bank_detail">
                  <Input
                    variant="filled"
                    placeholder="Bank Name"
                    className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                  />
                </Form.Item>
                <Form.Item noStyle name="bank_number">
                  <Input
                    placeholder="Bank Number"
                    className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                    type="number"
                    variant="filled"
                  />
                </Form.Item>
                <Form.Item noStyle name="bank_branch">
                  <Input
                    variant="filled"
                    placeholder="Bank Branch"
                    className="flex items-center w-full h-12 px-4 max-sm:h-11 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                  />
                </Form.Item>
                <Form.Item noStyle name="account_name">
                  <Input
                    variant="filled"
                    placeholder="Account Name"
                    className="flex items-center w-full h-12 px-4 max-sm:h-11 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                  />
                </Form.Item>
                <Flex justify="space-between">
                  <Form.Item noStyle name="file">
                    <div className="flex bg-[#1F222B] w-full p-6 max-sm:p-4 rounded-md">
                      <Upload
                        listType="picture"
                        className="w-full upload-payment-modal-user"
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
                          <Button icon={<UploadOutlined />} className="max-sm:text-xs">
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
                        afterOpenChange: (visible) => !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                    />
                  )}
                </Flex>
              </Flex>
            </Form>
          ) : (
            <Form>
              <Flex vertical gap="small">
                <Form.Item noStyle>
                  <Input
                    variant="filled"
                    placeholder="Number Phone / Email"
                    className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                  />
                </Form.Item>
                <Form.Item noStyle>
                  <Input
                    variant="filled"
                    placeholder="Name"
                    className="flex items-center w-full h-12 max-sm:h-11 px-4 bg-[#1F222B] text-white placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B]"
                  />
                </Form.Item>
                {/* <Form.Item noStyle>
                  <InputNumber
                    placeholder="Nominal"
                    className="input-number-custom w-full p-2 max-sm:p-1.5 placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:!border-gray-700 hover:bg-[#1F222B] active:bg-[#1F222B] !bg-[#1F222B] !text-white !hover:text-white !active:text-white"
                    variant="filled"
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        : ""
                    }
                    parser={(value) => value.replace(/\.\s?|(\.)/g, "")}
                  />
                </Form.Item> */}
                <Flex justify="space-between">
                  <Form.Item noStyle>
                    <div className="flex bg-[#1F222B] w-full p-6 max-sm:p-4 rounded-md">
                      <Upload
                        listType="picture"
                        className="w-full upload-payment-modal-user"
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
                          <Button icon={<UploadOutlined />} className="hover:!border-black hover:!text-black max-sm:text-xs">
                            QR code
                          </Button>
                          <span className="text-[#9CA3AF] text-sm max-sm:text-xs">{"(Optional)"}</span>
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
                        afterOpenChange: (visible) => !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
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
          <Form form={formBank}>
            <Form.Item noStyle name="amount">
              <InputNumber
                className="input-number-custom  flex items-center w-full h-12 px-4 max-sm:h-11 placeholder:text-[#9CA3AF] focus:bg-[#1F222B] focus:border-gray-700 hover:bg-[#1F222B] active:bg-[#1F222B] !bg-[#1F222B] !text-white !hover:text-white !active:text-white"
                variant="filled"
                prefix="¥"
                min={0}
                formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "")}
                parser={(value) => value.replace(/\.\s?|(\.)/g, "")}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="flex p-6 max-sm:p-4 gap-2 bg-[#111111] rounded-t-2xl w-full">
          <Button
            onClick={onClose}
            className="p-6 !bg-[#F3F4F6] w-[35%] rounded-full text-sm font-semibold text-black flex justify-center items-center hover:!border-white hover:!bg-transparent hover:!text-white"
          >
            Cancel
          </Button>
          <Form
            className="w-full"
            form={formBank}
            onFinish={handleCreateOrderBank}
            onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
          >
            <Form.Item noStyle className="w-full">
              <Button
                htmlType="submit"
                className="flex items-center justify-center w-full p-6 text-sm font-bold text-white bg-primary border-primary rounded-full hover:!border-blue-700 hover:!text-white hover:!bg-blue-700"
              >
                <ShoppingCartOutlined className="-mt-1 text-xl" />
                Pay Now
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentModal;
