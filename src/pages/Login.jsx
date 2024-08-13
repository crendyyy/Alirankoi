import { Button, Flex, Form, Input, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = () => {

    console.log(email);
    console.log(password);
  };

  return (
    <Layout className="bg-white flex justify-center items-center">
      <Content className="flex w-72 items-center">
        <Flex vertical gap="middle" className="w-full">
          <Title level={2}>Login</Title>
          <Form
            layout="vertical"
            style={{ maxWidth: 600 }}
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input placeholder="Username" onChange={(e) => setEmail(e.target.value)} value={email}/>
            </Form.Item>
            <Form.Item
              label="Password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input placeholder="Password" type="password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                className="w-full"
                size="large"
                htmlType="submit"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Content>
    </Layout>
  );
};
export default Login;
