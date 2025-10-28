import express from "express";
import {registerUser,getAllUser,getUserById,updateUser,deleteUser} from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyRoles } from "../middleware/verifyRoles.js"; 

const router = express.Router()

//public route register new user 
router.route("/register")
.post(registerUser)

router.route("/")
.get(getAllUser)

router.route("/update")
.put(updateUser)


router.route("/delete/:id")
.delete(deleteUser)

router.route("/:id")
.get(getUserById)

// protectes route only accessible with access token 


router.route("/profile")
.get(verifyToken,(req,res)=>{
    res.json({message:"welcome to your profile",user:req.user})
})

router.route("/admin")
.get(verifyToken,verifyRoles,(req,res)=>{
    res.json({message:"welcome admin"})
})

export default router
