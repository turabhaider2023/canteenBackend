import express from "express";
import {
    createStockTransaction,
    getAllTransactions,
    getStockTransactionById,
    updateStockTransaction,
    deleteStockTransaction,
} from "../controller/stockTransactionController.js";

const router = express.Router()

router.route("/")
    .post(createStockTransaction)
    .get(getAllTransactions)

router.route("/:id")
    .get(getStockTransactionById)
    .put(updateStockTransaction)
    .delete(deleteStockTransaction)

export default router;
