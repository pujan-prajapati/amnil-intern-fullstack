import { useEffect, useState } from "react";
import { httpDelete, httpGet, httpPost } from "../../../services/axios.service";
import { HomeWrapper } from "../../../components/home/HomeWrapper";
import { FaTrash } from "react-icons/fa";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: string;
  price: number;
  quantity: number;
  product: {
    name: string;
    images: string[];
  };
}

interface CartData {
  id: string;
  totalPrice: number;
  items: CartItem[];
}

export const CartPage = () => {
  const [cart, setCart] = useState<CartData | null>(null);
  const navigate = useNavigate();

  const fetchCartItem = async () => {
    try {
      const response = await httpGet("/cart", null, true);
      setCart(response.data);
    } catch (error) {
      console.log("Failed to fetch cart item: ", error);
    }
  };

  useEffect(() => {
    fetchCartItem();
  }, []);

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await httpDelete(`/cart/${id}`, true);
      if (response.success) {
        message.success(response.message);
        fetchCartItem();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.log("Failed to delete cart item: ", error);
    }
  };

  const handleOrderItem = async () => {
    try {
      const response = await httpPost("/order", {}, true);
      console.log(response);

      if (response.success) {
        message.success(response.message);
        navigate("/products");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.log("Failed to order cart item: ", error);
    }
  };

  if (!cart) {
    return <div>No cart found</div>;
  }

  return (
    <>
      <HomeWrapper>
        {cart.items.length === 0 ? (
          <div>Your cart is empty!</div>
        ) : (
          cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center border-b pb-4 justify-between"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="w-[100px] h-[100px] object-contain"
              />
              <h1 className="text-3xl font-semibold">{item.product.name}</h1>
              <p>Price: Rs. {item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <Button
                type="primary"
                danger
                onClick={() => handleDeleteItem(item.id)}
              >
                <FaTrash />
              </Button>
            </div>
          ))
        )}

        <div className="text-right mt-5 text-xl font-semibold text-red-600">
          Total Price: Rs. {cart.totalPrice}
        </div>

        {cart.items.length !== 0 && (
          <div className="flex justify-end mt-10">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleOrderItem}
            >
              Checkout
            </button>
          </div>
        )}
      </HomeWrapper>
    </>
  );
};
