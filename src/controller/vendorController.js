import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const addVendor = async(req,res)=>{
    try {

        const db = getDB()
        const {name,address,contactPerson,email,contactNumber,GSTNumber} = req.body

        if(!name||!GSTNumber){
            return res.status(400).json({message:"name and GSTNumber are required"})
        }

       const existing = await db.collection("vendors").findOne({GSTNumber})

       if(existing){
        return res.status(409).json({message:"vendor already registered"})
       }

       const newVendor = {
        name,
        address:address||"",
        contactPerson:contactPerson||"",
        email:email||"",
        contactNumber:contactNumber||"",
        GSTNumber,
        createdAt:new Date()
       }

       const result=await db.collection("vendors").insertOne(newVendor);
       return res.status(201).json({message:"vendor created successfully",vendor:{...newVendor,_id:result.insertedId}})
    } catch (error) {
        console.error("error in vendor creation",error)
        return res.status(500).json({message:"server error"})
        
    }

}

// get all vendor data

export const getAllVendors = async(req,res)=>{
    try {
        const db = getDB()

        const result=await db.collection("vendors").find().toArray()

        return res.status(200).json({message:"successfully fetch all vendors",vendors:result})
    } catch (error) {
        console.error("error in fetching the vendors")
        return res.status(500).json({message:"internal server error"})
        
    }
}

// get vendor by id

export const getVendorById= async(req,res)=>{
    try {
        const db = getDB()
        const {id} = req.params;

        if(!ObjectId.isValid(id)){
            return res.status(400).json({message:"invalid vendor id"})
        }

        const result = await db.collection("vendors").findOne({_id:new ObjectId(id)})

        if(!result){
            return res.status(404).json({message:"vendor not found"})
        }
        return res.status(200).json({message:"vendor found successfully",vendor:result})

    } catch (error) {
        console.log("error in fetching the vendor")
        return res.status(500).json({message:"internal server error"})
        
    }
}

// update vendor by id 

export const updateVendor = async(req,res)=>{
    try {
        const db = getDB()
        const {id} = req.params
        const {name,address,contactPerson,email,contactNumber,GSTNumber} = req.body

        if(!ObjectId.isValid(id)){
            return res.status(400).json({message:"invalid vendor id"})
        }

        const updatedData = {
            name,
            address,
            contactPerson,
            email,
            contactNumber,
            GSTNumber,
            updatedAt:new Date()
        }

        const result =await db.collection("vendors").updateOne({_id:new ObjectId(id)},
        {$set:updatedData}

        )

        if(result.matchedCount===0){
            return res.status(404).json({message:"vendor not found"})
        }

        return res.status(200).json({message:"vendor updated successfully",updatedVendor:result})
    } catch (error) {
        console.error("error in updation of vendor")
        return res.status(500).json({message:"internal sever error"})
        
    }
}

// delete vendor by id 

export const deleteVendor = async(req,res)=>{
    try {
        const db = getDB();
        const {id}= req.params
        if(!ObjectId.isValid(id)){
            return res.status(400).json({message:"invalid vendor id "})
        }

        const result=await db.collection("vendors").deleteOne({_id:new ObjectId(id)})

        if(result.deletedCount===0){
            return res.status(404).json({message:"vendor not found"})
        }

        return res.status(200).json({message:"vendor deleted successfully"})
    } catch (error) {
        console.error("error in deletion of vendor")
        return res.status(500).json({message:"internal server error"})
        
    }

}