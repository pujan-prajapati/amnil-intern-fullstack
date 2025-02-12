import * as express from "express";
import * as productControllers from "../controllers/product.controllers";
import { upload } from "../middleware/multer";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware,
    isAdmin,
    upload.single("image"),
    productControllers.createProduct
  );

router.route("/").get(productControllers.getAllProducts);
router.route("/category").get(productControllers.getAllCategoy);

export { router as ProductRouter };
