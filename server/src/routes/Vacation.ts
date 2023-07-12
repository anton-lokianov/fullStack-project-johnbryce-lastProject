import express from "express";
import {
  deleteVacationController,
  getAllVacationsController,
} from "../controllers/Vacation";
import { verifyToken } from "../middlewares/Auth";

const router = express.Router();

router.get("/", verifyToken, getAllVacationsController);
router.delete("/:id", verifyToken, deleteVacationController);

export default router;
