import { getDB } from "../config/db.js";
import bcrypt from "bcrypt";

export const registerUser = async(req,res)=>{
      try {
            const db = getDB()
            const tempNamebody={
                  name:{
                        firstName:"",
                        middleName:"",
                        lastName:""
                  },
                  email:"",
                  password:"",
                  designation:"",
                  role:[],
                  office:"",
                 mobileNumber:"",
            officeLandlineNumber:"",
                  officeAddress:""
            }

            for(const key in tempNamebody){
                  if(!Object.keys(req.body).includes(key)){
                        return res.status(400).json({message:"All keys are required"})
                  }

                  if (!req.body[key]){
                        return res.staus(400).json({message:'values corrosponding to this key ${key} is missing'})
                  }
            }

            const{email,password,...others}=req.body
            const existingUser = await db.collection("users").findOne({email})
            if(existingUser){
                  return res.status(400).json({message:"use is already registered"})

            }

            const hashedpassword= await bcrypt.hash(password,10)

            const newUser = {...req.body,"createdAt":new Date(),"password":hashedpassword}

            const result=await db.collection("users").insertOne(newUser);
            return res.status(201).json({message:"user registerd successfully",userId:result.insertedId})

           
            
      } catch (error) {
            console.error(error)
            return res.status(500).json({message:"server error"})
            
      }
 



}