import Title from "antd/es/typography/Title";
import Modal from "../shared/Modal";
import { Button, Flex, Input, InputNumber, Upload, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const PaymentModal = ({ onClose, typeModal }) => {
  const [paymentType, setPaymentType] = useState();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageList, setImageList] = useState([]);

  const handlePreview = (file) => {
    setPreviewImage(file.thumbUrl || file.url);
    setPreviewOpen(true);
  };

  useEffect(() => {
    setPaymentType(typeModal);
  }, [typeModal]);

  const handleChange = ({ fileList }) => setImageList(fileList);

  const onChange = (value) => {
    console.log("changed", value);
  };
  return (
    <Modal onCancel={onClose}>
      <div className="bg-[#F8F8F8] flex flex-col gap-2 rounded-t-3xl">
        <div className="p-6 bg-white rounded-3xl flex flex-col gap-6">
          <Title level={5}>Payment Information</Title>
          {paymentType === "bank" ? (
            <Flex vertical gap="middle">
              <Input
                variant="filled"
                placeholder="Bank Name"
                className="w-full h-12 flex items-center px-2"
              />
              <InputNumber
                placeholder="Bank Number"
                className="w-full h-12 flex items-center "
                variant="filled"
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                onChange={onChange}
              />
              <Input
                variant="filled"
                placeholder="Bank Branch"
                className="w-full h-12 flex items-center px-2"
              />
              <Input
                variant="filled"
                placeholder="Account Name"
                className="w-full h-12 flex items-center px-2"
              />
            </Flex>
          ) : (
            <Flex vertical gap="middle">
              <Input
                variant="filled"
                placeholder="Nomor / Email"
                className="w-full h-12 flex items-center px-2"
              />
              <Input
                variant="filled"
                placeholder="Nama"
                className="w-full h-12 flex items-center px-2"
              />
              <InputNumber
                placeholder="Nominal"
                className="w-full h-12 flex items-center "
                variant="filled"
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                onChange={onChange}
              />
              <Flex justify="space-between">
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
          )}
        </div>
        <div className="p-6 bg-white rounded-3xl flex flex-col gap-5">
          <Title level={5}>Purhcase Amount</Title>
          <InputNumber
            className="w-full h-12 flex items-center px-2"
            variant="filled"
            prefix="¥"
            formatter={(value) =>
              value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""
            }
            parser={(value) => value.replace(/\.\s?|(\.)/g, "")}
            onChange={onChange}
          />
        </div>
        <div className="flex p-6 gap-2 bg-[#2C2C2C] rounded-t-3xl">
          <button
            onClick={onClose}
            className="h-12 bg-[#F3F4F6] w-[35%] rounded-full text-sm font-bold text-black flex justify-center items-center"
          >
            Cancel
          </button>
          <button className="h-12 bg-blue-500 w-3/4 rounded-full text-sm font-bold text-white flex justify-center items-center">
            Payment Now
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default PaymentModal;
