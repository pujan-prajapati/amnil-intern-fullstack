import { Request, Response } from "express";
import * as asyncHandler from "express-async-handler";
import * as orderServices from "../services/order.services";
import { ApiResponse } from "../utils/ApiResponse";

// order item
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user;
  const order = await orderServices.createOrder(id);
  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});
