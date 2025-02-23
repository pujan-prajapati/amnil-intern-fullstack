import { Auth } from "../entity/auth.entity";
import { Cart } from "../entity/cart.entity";
import { CartItem } from "../entity/cartItem.entity";
import { Product } from "../entity/product.entity";

// add to cart service
export const addToCart = async (
  id: string,
  productId: string,
  quantity: number
) => {
  const user = await Auth.findOne({ where: { id }, select: ["id"] });
  if (!user) {
    throw new Error("User not found");
  }

  const product = await Product.findOne({
    where: { id: productId },
    select: ["id", "quantity", "price", "name", "images"],
  });
  if (!product) {
    throw new Error("Product not found");
  }

  if (product.quantity < quantity) {
    throw new Error("Not enough stock available");
  }

  let cart = await Cart.findOne({
    where: { user: user },
    relations: ["items", "items.product"],
  });

  if (!cart) {
    cart = new Cart();
    cart.user = user;
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }

  let cartItem = cart.items.find((item) => item.product.id === productId);
  if (cartItem) {
    cartItem.quantity += quantity;
    cartItem.price = product.price;
  } else {
    cartItem = new CartItem();
    cartItem.cart = cart;
    cartItem.product = product;
    cartItem.quantity = quantity;
    cartItem.price = product.price;
    cart.items.push(cartItem);
  }

  await cartItem.save();

  cart.totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  await cart.save();

  return cart;
};

// get user cart service
export const getUserCart = async (id: string) => {
  const user = await Auth.findOne({ where: { id }, select: ["id"] });
  if (!user) {
    throw new Error("User not found");
  }

  const cart = await Cart.findOne({
    where: { user: user },
    relations: ["items", "items.product"],
  });

  return cart;
};

// delete cart service
export const deleteCartItem = async (userId: string, id: string) => {
  const user = await Auth.findOne({ where: { id: userId }, select: ["id"] });
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

  const cartItem = cart.items.find((item) => item.id === id);
  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  cart.items = cart.items.filter((item) => item.id !== id);

  await cart.save();

  return cart;
};
