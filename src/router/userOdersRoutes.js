import express from "express";
import {
    createUserOrder,
    getAllOrders,
    getOderById,
    updateOrder,
    deleteOrder
} from "../controller/userOderController.js"

const router = express.Router()

router.route("/")
    .post(createUserOrder)
    .get(getAllOrders)

router.route("/:id")
    .get(getOderById)
    .put(updateOrder)
    .delete(deleteOrder)

export default router;