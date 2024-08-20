import { Button, Flex, Form, Input, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useState } from "react";
import logoKoi from "/logo/logo-koi.png";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = () => {
    console.log(email);
    console.log(password);
  };

  return (
    <Layout className="bg-white flex justify-center items-center">
      <Content className="flex w-80 items-center">
        <Flex vertical gap="middle" className="w-full gap-4">
          <div className="text-center mb-8 flex flex-col items-center">
            <img src={logoKoi} alt="Logo Koi" className="w-fit mb-6" />
            <h1 className="font-bold text-3xl mb-1">Create Account!</h1>
            <p className="text-[#6C6F93]">
              Enter Your details to process further.
            </p>
          </div>
          <Form
            layout="vertical"
            style={{ maxWidth: 600 }}
            name="Register"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
              className="text-[#0E0B3D] text-sm"
            >
              <Input
                placeholder="Enter username"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
              />
            </Form.Item>
            <Form.Item
              label="Password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
              className="text-[#0E0B3D] text-sm"
            >
              <Input
                placeholder="Enter password"
                type="password"
                className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
              />
            </Form.Item>
            <Form.Item>
              <button
                className="w-full bg-primary text-base text-center text-white py-3 rounded-xl"
                type="submit"
              >
                Sign Up
              </button>
            </Form.Item>
          </Form>
        </Flex>
      </Content>
    </Layout>
  );
};
export default Register;
