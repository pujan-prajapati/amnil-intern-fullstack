import * as express from "express";
import {
  createUser,
  deleteUser,
  getAllusers,
  getUserById,
  updateUser,
} from "../controllers/user.controllers";

const router = express.Router();

router.route("/").post(createUser);
router.route("/:id").put(updateUser);
router.route("/:id").delete(deleteUser);
router.route("/").get(getAllusers);
router.route("/:id").get(getUserById);

export { router as userRouter };
