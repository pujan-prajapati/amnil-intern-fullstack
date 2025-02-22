import { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Upload,
  UploadFile,
} from "antd";
import { AdminHeader } from "../../../components/admin/common/AdminHeader";
import "./product.css";
import { uploader } from "../../../services/axios.service";

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
}

const categoryOptions = [
  { value: "Shoes", label: "Shoes" },
  { value: "Clothes", label: "Clothes" },
  { value: "Laptops", label: "Laptops" },
];

export const CreateProduct = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleProductImageChange = ({ fileList }: { fileList: UploadFile[] }) =>
    setFileList(fileList);

  const onFinish = async (values: ProductFormValues) => {
    setLoading(true);
    if (fileList.length === 0) {
      message.error("At least one product image is required");
      setLoading(false);
      return;
    }

    try {
      const response = await uploader(
        "/product",
        "POST",
        values,
        "images",
        fileList.map((file) => file.originFileObj as File),
        true
      );

      if (response.success) {
        message.success("Product Created Successfully");
        form.resetFields();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Upload failed : ", error);
      message.error("Product creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Create Product" />
      <Form
        form={form}
        onFinish={onFinish}
        size="large"
        layout="vertical"
        className="grid grid-cols-3 gap-16"
      >
        {/* Left Column: Product Details */}
        <div className="col-span-2">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="Product Description"
            name="description"
            rules={[
              { required: true, message: "Please input product description!" },
            ]}
          >
            <Input.TextArea rows={5} placeholder="Enter product description" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              label="Product Price"
              name="price"
              rules={[
                { required: true, message: "Please input product price!" },
              ]}
            >
              <InputNumber className="w-full" prefix="Rs." placeholder="0" />
            </Form.Item>

            <Form.Item
              label="Product Quantity"
              name="quantity"
              rules={[
                { required: true, message: "Please input product quantity!" },
              ]}
            >
              <InputNumber className="w-full" placeholder="0" />
            </Form.Item>
          </div>

          <Form.Item
            label="Product Category"
            name="category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select category" options={categoryOptions} />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            className="w-40 primary_btn"
            loading={loading}
          >
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>

        {/* Right Column: Product Image Upload */}
        <div>
          <Form.Item
            className="product-image"
            label="Product Image"
            name="image"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleProductImageChange}
              multiple
              maxCount={4}
            >
              {fileList.length < 4 && "+ Upload"}
            </Upload>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};
