import { Button, Form, Input, message, Upload } from "antd";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import type { UploadFile } from "antd/es/upload/interface";
import { httpPost } from "../../services/axios.service";

// Define type for form values
interface RegisterValues {
  username: string;
  email: string;
  password: string;
  phone: string;
  avatar?: File;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const onFinish = async (values: RegisterValues) => {
    setLoading(true);
    const formData = new FormData();

    // Append form values to FormData
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key as keyof RegisterValues] as string);
    });

    // Append avatar if selected
    if (fileList.length > 0) {
      formData.append("avatar", fileList[0].originFileObj as File);
    } else {
      message.error("Avatar is required.");
      return;
    }

    try {
      const response = await httpPost(`/auth/registerUser`, formData);
      if (response.success) {
        message.success("User Registered Successfully");
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Failed to register user", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto h-screen flex flex-col justify-center">
      <Form
        onFinish={onFinish}
        layout="vertical"
        className="bg-gray-100 rounded-lg p-10 shadow-lg shadow-gray-300"
      >
        <h1 className="text-4xl text-center text-indigo-700 underline font-semibold mb-10">
          Register
        </h1>

        {/* Avatar */}
        <Form.Item label="Avatar" name="avatar">
          <Upload
            listType="picture"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleAvatarChange}
            maxCount={1}
            type="drag"
          >
            <Button icon={<FaUpload />}>Select Avatar</Button>
          </Upload>
        </Form.Item>

        {/* Username */}
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username" }]}
        >
          <Input type="text" placeholder="Username" size="large" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input type="email" placeholder="Email" size="large" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Password must be at least 8 characters long" },
          ]}
        >
          <Input.Password placeholder="******" size="large" />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          label="Phone number"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
            { len: 10, message: "Phone number must be 10 digits long" },
          ]}
        >
          <Input placeholder="Phone number" size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            block
            size="large"
            loading={loading}
          >
            Register
          </Button>
        </Form.Item>

        <div className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="app_link">
            Login
          </Link>
        </div>
      </Form>
    </div>
  );
};
