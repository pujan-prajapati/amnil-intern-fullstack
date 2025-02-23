import { Request, Response } from "express";
import * as asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse";
import * as cartServices from "../services/cart.services";
import { Cart } from "../entity/cart.entity";

const serializeCart = (cart: Cart) => {
  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      cart: undefined, // Remove the circular reference
    })),
  };
};

// add to cart
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;
  const { productId, quantity } = req.body;

  const cart = await cartServices.addToCart(id, productId, quantity);
  const serializedCart = serializeCart(cart);

  res
    .status(201)
    .json(new ApiResponse(201, serializedCart, "Product added to cart"));
});

// get user cart
export const getUserCart = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;
  const cart = await cartServices.getUserCart(id);

  res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// delete cart item
export const deleteCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { id } = req.params;

    await cartServices.deleteCartItem(userId, id);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Cart item deleted successfully"));
  }
);
