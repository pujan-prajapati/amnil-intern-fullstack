import * as express from "express";
import * as passport from "passport";
import * as authControllers from "../controllers/auth.controllers";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/multer";

const router = express.Router();

router
  .route("/registerUser")
  .post(upload.single("avatar"), authControllers.registerUser);
router.route("/loginUser").post(authControllers.loginUser);
router.route("/logoutUser").post(authMiddleware, authControllers.logoutUser);
router.route("/forgotPassword").post(authControllers.forgotPassword);
router.route("/verifyOTP").post(authControllers.verifyOTP);
router.route("/resetPassword").post(authControllers.resetPassword);

router.route("/refresh").post(authControllers.resfreshToken);

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
