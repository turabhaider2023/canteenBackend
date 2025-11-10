import express from "express";
import {
  createCanteenIssueOrder,
  getAllCanteenIssueOrders,
  getCanteenIssueOrderById,
  updateCanteenIssueOrder,
  deleteCanteenIssueOrder,
} from "../controller/canteenIssueOrderController.js";

const router = express.Router();

router
  .route("/")
  .post(createCanteenIssueOrder)
  .get(getAllCanteenIssueOrders);

router
  .route("/:id")
  .get(getCanteenIssueOrderById)
  .put(updateCanteenIssueOrder)
  .delete(deleteCanteenIssueOrder);

export default router;
