import * as express from "express";
import * as orderControllers from "../controllers/order.controllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(authMiddleware, orderControllers.createOrder);

export { router as orderRouter };
