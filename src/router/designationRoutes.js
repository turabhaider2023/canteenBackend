import express from "express";
import {
  createDesignation,
  getAllDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
} from "../controller/designationController.js";

const router = express.Router();

// CREATE
router.route("/")
    .post(createDesignation)
    .get(getAllDesignations)

router.route("/:id")
    .get(getDesignationById)
    .put(updateDesignation)
    .delete(deleteDesignation)





export default router;
