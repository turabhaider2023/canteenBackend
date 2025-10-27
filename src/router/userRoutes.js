import express from "express";
import {registerUser, getAllUser} from "../controller/userController.js";
import {verifyToken} from "../middleware/verifyToken.js"
import {verifyRoles} from "../middleware/verifyRoles.js"

const router = express.router();

// public route register new user

router
 .route("/register")
 .post(registerUser);

//  protected route only accessible with valid token

router
    .route("/profile")
    .get(verifyToken,(req,res)=>{
        res.json({message:"welcome to your profile",user:req.user})
    })

// admin only Token + role is required

router
    .route("/admin")
    .get(verifyToken,verifyRoles,(req,res)=>{
        res.json({message:"welcome Admin"})
    })

export default router
 
