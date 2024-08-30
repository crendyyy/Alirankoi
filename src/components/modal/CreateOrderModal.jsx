import { AlipayOutlined, BankOutlined, ShoppingCartOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Image, Input, InputNumber, Modal, Radio, Select, Upload } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useGetUserList } from "../service/admin/orders/useGetUserList";

const CreateOrderModal = ({ isOpen, onConfirm, onCancel }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageList, setImageList] = useState([]);
  const [orderType, setOrderType] = useState("bank");

  const { data: userList, isPending, isError } = useGetUserList();

  console.log(userList);

  const radioChangeHandle = (e) => {
    setOrderType(e.target.value);
  };
  console.log(orderType);

  const handlePreview = (file) => {
    setPreviewImage(file.thumbUrl || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList }) => setImageList(fileList);
  return (
    <Modal
      title="Manual Order Bank"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      width={650}
      footer={[
        <div key="cancel" className="w-full p-6 bg-[#111111] rounded-2xl flex gap-2">
          <Button
            className="w-1/3 rounded-full py-6 text-black bg-white hover:!bg-gray-100 hover:!text-black"
            type="primary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button className="w-2/3 rounded-full py-6 text-white bg-primary hover:!bg-blue-400 " type="primary" onClick={onCancel}>
            <ShoppingCartOutlined className="text-xl mb-1" />
            Pay Now
          </Button>
        </div>,
      ]}
    >
      <Flex className="w-full" vertical gap={24}>
        <Select
          className="h-10 "
          loading={isPending}
          showSearch
          style={{ width: "100%" }}
          placeholder="Search to Select Username"
          optionFilterProp="label"
          allowClear
          options={userList?.payload.map((user) => ({ value: user.id, label: user.username }))}
          //   options={[
          //     {
          //       value: "1",
          //       label: "Admin",
          //     },
          //     {
          //       value: "2",
          //       label: "Orang",
          //     },
          //   ]}
        />
        <Radio.Group className="flex w-full gap-2" defaultValue={orderType} onChange={radioChangeHandle}>
          <Radio.Button className="w-full !border-none !text-white flex items-center justify-center py-6 !rounded-full" value="bank">
            <BankOutlined className="text-lg mr-1" /> Buy Bank
          </Radio.Button>
          <Radio.Button className="w-full !border-none !text-white flex items-center justify-center py-6 !rounded-full" value="alipay">
            <AlipayOutlined className="text-lg mr-1" /> Buy Ali
          </Radio.Button>
        </Radio.Group>
        <Title level={5} className="!-mb-3">
          Bank Payment Information
        </Title>
        {orderType === "bank" ? (
          <Form>
            <Flex gap="small" vertical>
              <Form.Item noStyle name="bank_detail">
                <Input
                  variant="filled"
                  placeholder="Bank Name"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
              <Form.Item noStyle name="bank_number">
                <Input
                  placeholder="Bank Number"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                  type="number"
                  variant="filled"
                />
              </Form.Item>
              <Form.Item noStyle name="bank_branch">
                <Input
                  variant="filled"
                  placeholder="Bank Branch"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
              <Form.Item noStyle name="account_name">
                <Input
                  variant="filled"
                  placeholder="Account Name"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
            </Flex>
          </Form>
        ) : (
          <Form>
            <Flex vertical gap="small">
              <Form.Item noStyle name="ali_number_or_email">
                <Input
                  variant="filled"
                  placeholder="Number Phone / Email"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
              <Form.Item noStyle name="ali_name">
                <Input
                  variant="filled"
                  placeholder="Name"
                  className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
                />
              </Form.Item>
              <Flex justify="space-between">
                <Form.Item noStyle name="file">
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
                        <Button icon={<UploadOutlined />} className="bg-white">
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
        )}
        <Title level={5}>Purchase Amount</Title>
        <Form>
          <Form.Item noStyle name="amount">
            <InputNumber
              className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 w-full"
              variant="filled"
              prefix="¥"
              min={0}
              formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "")}
              parser={(value) => value.replace(/\.\s?|(\.)/g, "")}
            />
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  );
};
export default CreateOrderModal;
