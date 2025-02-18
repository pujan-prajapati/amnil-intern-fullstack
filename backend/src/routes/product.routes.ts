import * as express from "express";
import * as productControllers from "../controllers/product.controllers";
import { upload } from "../middleware/multer";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 * @swagger
 * /api/v1/product:
 *  post:
 *    summary: Create a new product
 *    description: Create a new product in the database
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Puma white sneaker"
 *              description:
 *                type: string
 *                example: "This is a Puma white sneaker, very popular and cheap in cost"
 *              price:
 *                type: number
 *                example: 2000.00
 *              image:
 *                type: string
 *                format: binary
 *              category:
 *                type: string
 *                example: "shoes"
 *              quantity:
 *                type: integer
 *                example: 23
 *    responses:
 *      201:
 *        description: Product created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                statusCode:
 *                  type: integer
 *                  example: 201
 *                message:
 *                  type: string
 *                  example: "Product created successfully"
 *                success:
 *                  type: boolean
 *                  example: true
 *                data:
 *                  $ref: "#/components/schemas/Product"
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized (Admin only)
 *      500:
 *        description: Internal server error
 *
 */
router
  .route("/")
  .post(
    authMiddleware,
    isAdmin,
    upload.single("image"),
    productControllers.createProduct
  );

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
router.route("/").get(productControllers.getAllProducts);

/**
 * @swagger
 * /api/v1/product/{id}:
 *  get:
 *    summary: Get a product by ID
 *    description: Retrieve a product from the database by its ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the product is required
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A product
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                statusCode:
 *                  type: integer
 *                  example: 200
 *                message:
 *                  type: string
 *                success:
 *                  type: boolean
 *                data:
 *                  $ref: "#/components/schemas/Product"
 */
router.route("/:id").get(productControllers.getProduct);

router.route("/category").get(productControllers.getAllCategory);

export { router as ProductRouter };
