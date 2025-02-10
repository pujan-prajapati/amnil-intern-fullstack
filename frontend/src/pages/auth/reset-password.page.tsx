import { Button, Form, Input, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { httpPost } from "../../services/axios.service";

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();

  const { email } = state;

  const onFinish = async (values: FormValues) => {
    const data = {
      email: email,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };

    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await httpPost(`/auth/resetPassword`, data);

        if (response.success) {
          message.success(response.message);
          navigate("/login");
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log("Failed to verify otp", error);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  return (
    <>
      <section className="max-w-[500px] mx-auto h-screen flex flex-col justify-center ">
        <Form
          onFinish={onFinish}
          layout="vertical"
          className="bg-gray-100 rounded-lg p-10 shadow-lg shadow-gray-300"
        >
          <h1 className="text-4xl text-center text-indigo-700 underline font-semibold mb-5">
            Reset password
          </h1>

          <p className="mb-5 text-center">Reset password for : {email}</p>

          {/* new password */}
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password placeholder="******" size="large" />
          </Form.Item>

          {/* confirm password */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password placeholder="******" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              block
              size="large"
              loading={loading}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </section>
    </>
  );
};
