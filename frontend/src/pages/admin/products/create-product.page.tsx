import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  UploadFile,
} from "antd";
import { AdminHeader } from "../../../components/admin/common/AdminHeader";
import { useState } from "react";

export const CreateProduct = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleProductImageChange = ({
    fileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(fileList);
  };

  const onFinish = async (values: any) => {
    console.log(values);
  };

  return (
    <>
      <AdminHeader title="Create Product" />

      <Form
        onFinish={onFinish}
        size="large"
        labelCol={{ span: 4 }}
        labelAlign="left"
      >
        <Form.Item
          label="Product Name"
          name={"name"}
          rules={[{ required: true, message: "Please input product name!" }]}
        >
          <Input placeholder="Product Name" />
        </Form.Item>

        <Form.Item
          label="Product Description"
          name={"description"}
          rules={[
            { required: true, message: "Please input product description!" },
          ]}
        >
          <Input.TextArea rows={5} placeholder="Product Description" />
        </Form.Item>

        <Form.Item
          label="Product Price"
          name={"price"}
          rules={[{ required: true, message: "Please input product price!" }]}
        >
          <InputNumber className="w-52" prefix="Rs." placeholder="0" />
        </Form.Item>

        <Form.Item
          label="Product Quantity"
          name={"quantity"}
          rules={[
            { required: true, message: "Please input product quantity!" },
          ]}
        >
          <InputNumber className="w-52" placeholder="0" />
        </Form.Item>

        <Form.Item
          label="Product Category"
          name={"category"}
          rules={[
            { required: true, message: "Please input product category!" },
          ]}
        >
          <Select
            placeholder="Select Category"
            options={[
              { value: "Shoes", label: "Shoes" },
              { value: "Clothes", label: "Clothes" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Product Image"
          name={"image"}
          valuePropName="file"
          rules={[{ required: true, message: "Please input product image!" }]}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleProductImageChange}
            multiple={true}
            maxCount={4}
            type="drag"
          >
            {fileList.length < 4 && "+ Upload"}
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button htmlType="submit" type="primary" className="w-52 primary_btn">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
