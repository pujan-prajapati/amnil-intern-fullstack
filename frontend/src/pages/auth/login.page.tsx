import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { httpPost } from "../../services/axios.service";
import { FaGoogle } from "react-icons/fa";
import { API_URL } from "../../constants";
import { useState } from "react";

interface LoginFormValuels {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValuels) => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const response = await httpPost(`/auth/loginUser`, values);

        if (response.success) {
          localStorage.setItem("token", response.data.accessToken);
          message.success(response.message);
          navigate("/");
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log("Failed to login user", error);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    try {
      window.location.href = `${API_URL}/auth/google`;
    } catch (error) {
      console.error("Failed to redirect to Google login:", error);
      message.error("Failed to initiate Google login. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto h-screen flex flex-col justify-center ">
      <Form
        onFinish={onFinish}
        layout="vertical"
        className="bg-gray-100 rounded-lg p-10 shadow-lg shadow-gray-300"
      >
        <h1 className="text-4xl text-center text-indigo-700 underline font-semibold mb-10">
          Login
        </h1>

        {/* email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            {
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input type="email" placeholder="Email" size="large" />
        </Form.Item>

        {/* password */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            {
              min: 6,
              message: "Password must be at least 6 characters long",
            },
          ]}
        >
          <Input.Password placeholder="******" size="large" />
        </Form.Item>

        <div className="mb-5">
          <Link to="/forgot-password" className="app_link">
            Forgot password?
          </Link>
        </div>

        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            block
            size="large"
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            icon={<FaGoogle />}
            className="primary_btn"
            block
            size="large"
            onClick={handleGoogleLogin}
            loading={googleLoading}
          >
            Login with Google
          </Button>
        </Form.Item>

        <div className="text-center">
          Don't have an account?{" "}
          <Link to="/register" className="app_link">
            Register
          </Link>
        </div>
      </Form>
    </div>
  );
};
