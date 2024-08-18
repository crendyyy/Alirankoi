import Title from "antd/es/typography/Title";
import Modal from "../shared/Modal";
import { Button, Flex, Input, InputNumber, Upload, Image, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { useCreateOrder } from "../service/user/order/useCreateOrder";
import { AuthContext } from "../../context/AuthContext";

const PaymentModal = ({ onClose, typeModal }) => {
  const [paymentType, setPaymentType] = useState('bank');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageList, setImageList] = useState([]);
  const {auth} = useContext(AuthContext)

  console.log(auth.token);

  const createOrderMutation = useCreateOrder();

  const [formBank] = Form.useForm();

  const handleCreateOrderBank = async (value) => {
    const formData = new FormData();
    formData.append("amount", value.amount);
    formData.append("bank_number", value.bank_number);
    formData.append("bank_detail", value.bank_detail);
    formData.append("bank_branch", value.bank_branch);
    formData.append("account_name", value.account_name);

    if (imageList.length > 0) {
      formData.append("invoice", imageList[0].originFileObj);
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

  useEffect(() => {
    setPaymentType(typeModal);
  }, [typeModal]);

  const handleChange = ({ fileList }) => setImageList(fileList);
  return (
    <Modal onCancel={onClose}>
      <div className="bg-[#F8F8F8] flex flex-col gap-2 rounded-t-3xl">
        <div className="flex flex-col gap-6 p-6 bg-white rounded-3xl">
          <Title level={5}>Payment Information</Title>
          {paymentType === "bank" ? (
            <Form form={formBank}>
              <Flex gap="middle" vertical>
                <Form.Item noStyle name="bank_detail">
                  <Input
                    variant="filled"
                    placeholder="Bank Name"
                    className="flex items-center w-full h-12 px-2"
                  />
                </Form.Item>
                <Form.Item noStyle name="bank_number">
                  <InputNumber
                    placeholder="Bank Number"
                    className="flex items-center w-full h-12 "
                    variant="filled"
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item noStyle name="bank_branch">
                  <Input
                    variant="filled"
                    placeholder="Bank Branch"
                    className="flex items-center w-full h-12 px-2"
                  />
                </Form.Item>
                <Form.Item noStyle name="account_name">
                  <Input
                    variant="filled"
                    placeholder="Account Name"
                    className="flex items-center w-full h-12 px-2"
                  />
                </Form.Item>
                <Flex justify="space-between">
                  <Form.Item noStyle name="invoice">
                    <Upload
                      listType="picture"
                      className="w-full"
                      fileList={imageList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                      maxCount={1}
                      showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                        showDownloadIcon: false,
                      }}
                    >
                      <Flex gap="small" align="center">
                        <Button icon={<UploadOutlined />}>Invoice</Button>
                      </Flex>
                    </Upload>
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
          ) : (
            <Form>
              <Flex vertical gap="middle">
                <Form.Item noStyle>
                  <Input
                    variant="filled"
                    placeholder="Nomor / Email"
                    className="flex items-center w-full h-12 px-2"
                  />
                </Form.Item>
                <Form.Item noStyle>
                  <Input
                    variant="filled"
                    placeholder="Nama"
                    className="flex items-center w-full h-12 px-2"
                  />
                </Form.Item>
                <Form.Item noStyle>
                  <InputNumber
                    placeholder="Nominal"
                    className="flex items-center w-full h-12 "
                    variant="filled"
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  
                  />
                </Form.Item>
                <Flex justify="space-between">
                  <Form.Item noStyle>
                    <Upload
                      listType="picture"
                      className="w-full"
                      fileList={imageList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                      maxCount={1}
                      showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                        showDownloadIcon: false,
                      }}
                    >
                      <Flex gap="small" align="center">
                        <Button icon={<UploadOutlined />}>QR code</Button>
                        <span className="text-[#9CA3AF] text-sm">
                          {"(Optional)"}
                        </span>
                      </Flex>
                    </Upload>
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
        </div>
        <div className="flex flex-col gap-5 p-6 bg-white rounded-3xl">
          <Title level={5}>Purhcase Amount</Title>
          <Form form={formBank}>
            <Form.Item noStyle name="amount">
              <InputNumber
                className="flex items-center w-full h-12 px-2"
                variant="filled"
                prefix="¥"
                formatter={(value) =>
                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
                }
                parser={(value) => value.replace(/\.\s?|(\.)/g, "")}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="flex p-6 gap-2 bg-[#2C2C2C] rounded-t-3xl w-full">
          <button
            onClick={onClose}
            className="h-12 bg-[#F3F4F6] w-[35%] rounded-full text-sm font-bold text-black flex justify-center items-center"
          >
            Cancel
          </button>
          <Form
            className="w-full"
            form={formBank}
            onFinish={handleCreateOrderBank}
            onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
          >
            <Form.Item noStyle className="w-full">
              <Button
                htmlType="submit"
                className="flex items-center justify-center w-full h-12 text-sm font-bold text-white bg-blue-500 rounded-full"
              >
                Payment Now
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentModal;
