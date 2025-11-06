import express from "express";
import {createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem

} from "../controller/itemController.js";

const router = express.Router()

router.route("/")
    .post(createItem)
    .get(getAllItems)

router.route("/:id")
    .get(getItemById)
    .put(updateItem)
    .delete(deleteItem)

export default router;