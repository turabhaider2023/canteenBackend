import { getDB } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config()


export const loginUser= async (req,res)=>{
  try {
      const db = getDB()
      const{email,password} = req.body
      if(!email||!password){
          return res.status(400).json({message:"email and password both are required"})
  
      }
  
      const user = await db.collection("users").findOne({email})
      if(!user){
          return res.status(400).json({message:"invalid email or password "})
      }
  
      const isMatch = await bcrypt.compare(password,user.password)
      if(!isMatch){
          return res.status(400).json({message:"invalid email or password"})
      }
  
      //generate jwt token
  
      const jwtToken = jwt.sign({id:user._id,email:user.email,role:user.role}
          ,process.env.JWT_SECRET
          ,{expiresIn:"7d"}
      );
  
      //send response
  
      return res.status(201).json({message:"login successful",
          jwtToken,
          user:{
              id:user._id,
              name:user.name,
              email:user.email,
              role:user.role,
              office:user.office,
              designation:user.designation
  
          }
      })
  
  } catch (error) {
    console.error(error)
    return res.status(500).json({message:"server error"})
    
  }

     
}