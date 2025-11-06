import express from "express";
import {addVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor

} from "../controller/vendorController.js"

const router = express.Router()

router.route("/")
    .post(addVendor)
    .get(getAllVendors)

router.route("/:id")
    .get(getVendorById)
    .put(updateVendor)
    .delete(deleteVendor)

export default router;