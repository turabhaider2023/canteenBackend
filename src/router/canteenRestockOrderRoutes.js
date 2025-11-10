import express from "express";
import {
  createRestockOrder,
  getAllRestockOrders,
  getRestockOrderById,
  updateRestockOrder,
  deleteRestockOrder,
} from "../controller/canteenRestockOrderController.js"

const router = express.Router();

router.post("/", createRestockOrder);
router.get("/", getAllRestockOrders);
router.get("/:id", getRestockOrderById);
router.put("/:id", updateRestockOrder);
router.delete("/:id", deleteRestockOrder);

export default router;
