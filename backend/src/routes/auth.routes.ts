import * as express from "express";
import * as passport from "passport";
import * as authControllers from "../controllers/auth.controllers";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/multer";

const router = express.Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *          username:
 *            type: string
 *          email:
 *            type: string
 *          phone:
 *            type: string
 *          avatar:
 *            type: string
 *            format: url
 *          role:
 *            type: string
 *          createdAt:
 *            type: string
 *          updatedAt:
 *            type: string
 *
 *      UserRequest:
 *        type: object
 *        properties:
 *          username:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          phone:
 *            type: string
 *          avatar:
 *            type: string
 *            format: binary
 *
 *      UserResponse:
 *        type: object
 *        properties:
 *          statusCode:
 *            type: integer
 *          message:
 *            type: string
 *          success:
 *            type: boolean
 *          data:
 *            $ref: "#/components/schemas/User"
 */

/**
 * @swagger
 *  /api/v1/auth/registerUser:
 *    post:
 *      summary: Register a new user
 *      description: Register a new user in the database
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: "#/components/schemas/UserRequest"
 *      responses:
 *        201:
 *          description: User registered successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/UserResponse"
 *
 *
 */
router
  .route("/registerUser")
  .post(upload.single("avatar"), authControllers.registerUser);

/**
 * @swagger
 *  /api/v1/auth/loginUser:
 *    post:
 *      summary: Login a user
 *      description: Login a user in the database
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: User logged in successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  statusCode:
 *                    type: integer
 *                  message:
 *                    type: string
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: object
 *                    properties:
 *                      user:
 *                        $ref: "#/components/schemas/User"
 *                      accessToken:
 *                        type: string
 *                      refreshToken:
 *                        type: string
 */
router.route("/loginUser").post(authControllers.loginUser);

router.route("/logoutUser").post(authMiddleware, authControllers.logoutUser);
router.route("/forgotPassword").post(authControllers.forgotPassword);
router.route("/verifyOTP").post(authControllers.verifyOTP);
router.route("/resetPassword").post(authControllers.resetPassword);

router.route("/refresh").post(authControllers.refreshToken);

router.route("/:id").put(authMiddleware, authControllers.updateUserPassword);

router
  .route("/:id")
  .delete(authMiddleware, isAdmin, authControllers.deleteUser);

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/").get(authMiddleware, isAdmin, authControllers.getAllUsers);
router.route("/me").get(authMiddleware, authControllers.getUserById);

export { router as authRouter };
