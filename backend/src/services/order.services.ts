import { Auth } from "../entity/auth.entity";
import { Cart } from "../entity/cart.entity";
import { Order } from "../entity/order.entity";
import { OrderItem } from "../entity/orderItem.entity";

export const createOrder = async (id: string) => {
  const user = await Auth.findOne({ where: { id }, select: ["id"] });
  if (!user) {
    throw new Error("User not found");
  }

  const cart = await Cart.findOne({
    where: { user: user },
    relations: ["items", "items.product"],
  });
  if (!cart) {
    throw new Error("Cart not found");
  }

  let totalPrice = 0;
  const order = new Order();
  order.user = user;
  order.items = [];

  for (const item of cart.items) {
    const orderItem = new OrderItem();
    orderItem.product = item.product;
    order.items.push(orderItem);
    totalPrice += item.product.price * item.quantity;
  }

  order.totalPrice = totalPrice;

  await order.save();
  await Cart.delete({ id: cart.id });

  return order;
};
