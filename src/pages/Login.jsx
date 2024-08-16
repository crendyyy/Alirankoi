import { Button, Form, Input, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../components/service/user/userServices";

const Login = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

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
        console.log("Response data:", data); // Log the entire response
        if (data && data.data) {
          // Adjust based on actual structure
          const { token, user } = data.data.payload; // Access 'data' field

          if (token) {
            localStorage.setItem("token", token);
            document.cookie = `token=${token};path=/`;

            if (user.is_admin) {
              navigate("/dashboard");
            } else {
              navigate("/");
            }
          } else {
            alert("Invalid Credentials");
          }
        } else {
          alert("Unexpected response format. Please try again.");
        }
      },
      onError: (error) => {
        console.error("Login error:", error);
        alert("An error occurred during login. Please try again.");
      },
    });
  };

  return (
    <Layout className="flex items-center justify-center bg-white">
      <Content className="flex items-center w-72">
        <div className="flex flex-col w-full gap-4">
          <Title level={2}>Login</Title>
          <Form
            layout="vertical"
            style={{ maxWidth: 600 }}
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                placeholder="Username"
                required
                value={credentials.username}
                onChange={(e) => handleInput("username", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                placeholder="Password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => handleInput("password", e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                className="w-full"
                size="large"
                htmlType="submit"
                loading={loginMutation.isLoading} // Show loading state while submitting
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
