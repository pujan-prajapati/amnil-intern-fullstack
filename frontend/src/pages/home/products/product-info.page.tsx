import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpGet } from "../../../services/axios.service";
import { HomeWrapper } from "../../../components/home/HomeWrapper";
import { Button, InputNumber } from "antd";

interface productProps {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  images: string[];
}

export const ProductInfo = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<productProps>();
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await httpGet(`/product/${id}`);
      setProduct(response.data);
      setMainImage(response.data.images[0]);
    } catch (error) {
      console.log("Failed to fetch product : ", error);
    }
  };

  const handleImageClick = (image: string) => {
    setMainImage(image);
  };

  return (
    <>
      <HomeWrapper>
        <section className="flex gap-10 justify-center">
          {/* image section */}
          <div className="flex flex-col h-full bg-gray-100 p-2 gap-2">
            <img
              src={mainImage}
              alt={product?.name}
              className="w-[500px] h-[300px] object-contain bg-white"
            />
            <div className="flex justify-between bg-white">
              {product?.images.map((image, index) => (
                <img
                  src={image}
                  key={index}
                  alt={`Thumbnail ${index}`}
                  className={`cursor-pointer w-[80px] h-[80px] object-contain`}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          </div>

          {/* info section */}
          <div className="space-y-5 max-w-[600px]">
            <h1 className="text-5xl font-semibold text-indigo-600">
              {product?.name}
            </h1>
            <p>{product?.description}</p>

            <hr />

            <p className="text-2xl text-red-600">
              <span className="font-semibold">Price : </span>
              Rs. {product?.price}
            </p>
            <p>
              <span className="font-semibold">Available : </span>
              {product?.quantity}
            </p>

            <hr />
            <label htmlFor="quantity" className="font-semibold">
              Quantity :{" "}
            </label>
            <InputNumber
              name="quantity"
              defaultValue={1}
              max={product?.quantity}
              className="w-52 font-semibold"
              size="large"
            />

            <hr />
            <Button className="primary_btn w-96 h-16" size="large">
              Add to Cart
            </Button>
          </div>
        </section>
      </HomeWrapper>
    </>
  );
};
