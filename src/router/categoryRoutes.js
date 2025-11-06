import express from "express";
import {createCategory,getAllCategories,updateCategory,deleteCategory} from "../controller/categoryController.js"

const router = express.Router()

router.route("/")
    .post(createCategory)
    .get(getAllCategories)

router.route("/:id")
    .put(updateCategory)
    .delete(deleteCategory)

export default router;