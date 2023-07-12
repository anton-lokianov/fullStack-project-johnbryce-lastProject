import express from "express";
import {
  addFollowerController,
  removeFollowerController,
  removeAllFollowersController,
  getAllFollowersController,
} from "../controllers/Follow";
import { verifyToken } from "../middlewares/Auth";

const router = express.Router();

router.post("/:userId,:vacationId", verifyToken, addFollowerController);
router.delete("/:userId,:vacationId", verifyToken, removeFollowerController);
router.delete(
  "/removeAll/:vacationId",

  removeAllFollowersController
);
router.get("/", verifyToken, getAllFollowersController);

export default router;
