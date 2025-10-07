import { getDB } from "../config/db.js";
import bcrypt from "bcrypt";

export const registerUser = async(req,res)=>{
 try {
       const db = getDB();

       const{firstName,middleName="",lastName,email,password,designation,role,office,mobileNumber,officeLandlineNumber,officeAddress}=req.body

       const{middleName:_,...fieldRequired}=req.body;

       console.log("requestbody",req.body)
       console.log("field required values",fieldRequired)
       if(Object.values(fieldRequired).some(field=>!field)){
        return res.status(400).json({message:"All fields are required"})
       }

       const existingUser= await db.collection("users").findOne({email});

       if (existingUser){
        return res.status(400).json({message:"user is already registered"})
       }
       const hashedPassword= await bcrypt.hash(password,10)

       const newUser = {
        name:{firstName,middleName,lastName},
        email,
        password:hashedPassword,
        designation,
        role,
        mobileNumber,
        officeLandlineNumber,
        officeAddress,
        createdAt: new Date()
       }

       const result = await db.collection("users").insertOne(newUser);
       return res.status(201).json({message:"user successfully registered",userId:result.insertedId})



 } catch (error) {
    console.error(error)
    return res.status(500).json({message:"server error"})
 }
}



