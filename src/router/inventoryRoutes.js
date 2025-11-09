import express from "express"
import {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory
} from "../controller/inventoryController.js"

const router = express.Router()

router.route("/")
    .post(createInventory)
    .get(getAllInventory)

router.route("/:id")
    .get(getInventoryById)
    .put(updateInventory)
    .delete(deleteInventory)

export default router;