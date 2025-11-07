import express from "express";
import {
    AddOffice,
    getAllOffices,
    getOfficeById,
    updateOffice,
    deleteOffice
} from "../controller/officeController.js"

const router = express.Router()

router.route("/")
    .post(AddOffice)
    .get(getAllOffices)

router.route("/:id")
    .get(getOfficeById)
    .put(updateOffice)
    .delete(deleteOffice)


export default router;