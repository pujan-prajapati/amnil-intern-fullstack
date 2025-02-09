import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { httpPost } from "../../services/axios.service";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: string) => {
    try {
      setLoading(true);
      const response = await httpPost(`/auth/forgotPassword`, values);

      if (response.success) {
        message.success(response.message);
        navigate("/verify-otp", { state: { email: values } });
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.log("Failed to login user", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="max-w-[500px] mx-auto h-screen flex flex-col justify-center ">
        <Form
          onFinish={onFinish}
          layout="vertical"
          className="bg-gray-100 rounded-lg p-10 shadow-lg shadow-gray-300"
        >
          <h1 className="text-4xl text-center text-indigo-700 underline font-semibold mb-10">
            Forgot Password
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

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              block
              size="large"
              loading={loading}
            >
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </section>
    </>
  );
};
