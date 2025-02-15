import * as express from "express";
import * as productControllers from "../controllers/product.controllers";
import { upload } from "../middleware/multer";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "759d95fe-64cc-4f4d-b5d6-7ad6f5e38008"
 *         name:
 *           type: string
 *           example: "Puma white sneaker"
 *         description:
 *           type: string
 *           example: "This is a Puma white sneaker, very popular and cheap in cost"
 *         price:
 *           type: number
 *           example: 2000.00
 *         image:
 *           type: string
 *           format: uri
 *           example: "http://res.cloudinary.com/.../image.jpg"
 *         category:
 *           type: string
 *           example: "shoes"
 *         quantity:
 *           type: integer
 *           example: 23
 *         views:
 *           type: integer
 *           example: 72
 *         reviews:
 *           type: integer
 *           example: 26
 *         likes:
 *           type: integer
 *           example: 59
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-02-10T11:38:59.954Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-02-10T11:38:59.954Z"
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: "Products fetched successfully"
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 *             totalProducts:
 *               type: integer
 *               example: 10
 *             limit:
 *               type: integer
 *               example: 10
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 1
 */

/**
 *  @swagger
 *  /api/v1/product:
 *    get:
 *      summary: Get all products
 *      description: Retrieve a list of products from the database
 *      responses:
 *        200:
 *          description: A list of products
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ProductResponse'
 */

router
  .route("/")
  .post(
    authMiddleware,
    isAdmin,
    upload.single("image"),
    productControllers.createProduct
  );

router.route("/").get(productControllers.getAllProducts);
router.route("/category").get(productControllers.getAllCategory);

export { router as ProductRouter };
