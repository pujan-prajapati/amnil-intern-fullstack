import { Button, Form, Input, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { httpPost } from "../../services/axios.service";

interface FormValues {
  otp: string;
}

export const VefifyOTP = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();

  const { email } = state;

  const onFinish = async (values: FormValues) => {
    const data = {
      email: email.email,
      otp: Number(values.otp),
    };

    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await httpPost(`/auth/verifyOTP`, data);

        if (response?.success) {
          message.success(response.message);
          navigate("/reset-password", { state: { email: email.email } });
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
            Verify OTP
          </h1>

          <p className="mb-5 text-center">
            Enter the OTP sent to your email : {email.email}
          </p>

          {/* email */}
          <Form.Item name="otp">
            <Input placeholder="Enter OTP" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              block
              size="large"
              loading={loading}
            >
              Verify
            </Button>
          </Form.Item>
        </Form>
      </section>
    </>
  );
};
