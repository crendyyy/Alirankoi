import { Button, Form, Input, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../components/service/user/userServices";
import { AuthContext } from "../context/AuthContext";
import logoKoi from "/logo/logo-koi.png";

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { login, auth } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleInput = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (loginMutation.isLoading) return;

    loginMutation.mutate(credentials, {
      onSuccess: (data) => {
        if (data && data.data) {
          const { token, user } = data.data.payload;
          if (token) {
            login(user, token);
            navigate(user.is_admin ? "/dashboard" : "/home");
          } else {
            console.log("Invalid Credentials");
          }
        } else {
          console.log("Unexpected response format. Please try again.");
        }
      },
      onError: (error) => {
        console.error("Login error:", error);
      },
    });
  };

  return (
    <Layout className="flex items-center justify-center bg-white">
      <Content className="flex items-center w-80">
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col items-center mb-8 text-center">
            <img src={logoKoi} alt="Logo Koi" className="mb-6 w-fit" />
            <h1 className="mb-1 text-3xl font-bold">Welcome!</h1>
            <p className="text-[#6C6F93]">Please enter Your Account details.</p>
          </div>
          <Form layout="vertical" style={{ maxWidth: 600 }} name="login" initialValues={{ remember: true }} onFinish={handleSubmit}>
            <Form.Item
              label="Username"
              rules={[{ required: true, message: "Please input your Username!" }]}
              className="text-[#0E0B3D] text-sm"
            >
              <Input
                placeholder="Enter username"
                required
                value={credentials.username}
                onChange={(e) => handleInput("username", e.target.value)}
                className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
              />
            </Form.Item>
            <Form.Item label="Password" rules={[{ required: true, message: "Please input your Password!" }]}>
              <Input
                placeholder="Enter password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => handleInput("password", e.target.value)}
                className="bg-[#F7F9FC] placeholder:text-[#B3B8D0] text-sm px-4 py-3 border-0 rounded-xl hover:bg-[#F7F9FC] focus:bg-[#F7F9FC] focus:ring-1 "
              />
            </Form.Item>
            <Form.Item>
              <button
                className="w-full py-3 text-base text-center text-white bg-primary rounded-xl"
                type="submit"
                loading={loginMutation.isLoading} // Show loading state while submitting
              >
                Sign In
              </button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
