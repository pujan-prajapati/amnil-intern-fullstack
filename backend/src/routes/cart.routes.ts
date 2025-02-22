import * as express from "express";
import { addToCart, getUserCart } from "../controllers/cart.controllers";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.route("/").post(authMiddleware, addToCart);
router.route("/").get(authMiddleware, getUserCart);

export { router as cartRouter };
