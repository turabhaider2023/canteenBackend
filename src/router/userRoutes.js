import {registerUser, getAllUser} from "../controller/userController.js";
import express from "express";
import {verifyToken} from "../middleware/authMiddleware.js"

const router=express.Router();

router.route("/register")
    .post(registerUser)

router.route("/")
    .get(verifyToken,getAllUser)

export default router;