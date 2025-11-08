import {getDB} from "../config/db.js";
import { ObjectId } from "mongodb";

// Create category
export const createCategory = async(req,res)=>{
    try {
        const db = getDB()
        const {name,description} = req.body;

        if(!name){
            return res.status(400).json({message:"category name is required"})
        }

        const existing = await db.collection("categories").findOne({name})

        if(existing){
            return res.status(409).json({message:"category already exist"})
        }

        const newCategory = {name, 
                            description:description||"",
                            createdAt:new Date()}

        await db.collection("categories").insertOne(newCategory)

        return res.status(201).json({message:"category successfully created",category:newCategory})
        
        
        
    } catch (error) {
        console.error("error in category creation",error)
        return res.status(500).json({message:"internal server error"})
        
    }
}

// get all categories 

export const getAllCategories = async(req,res)=>{
    try {
        const db = getDB()
        const {name,description} = req.body;
        const result = await db.collection("categories").find().toArray()
        return res.status(200).json({message:"category found sucessfully",result})
    } catch (error) {
        console.error("error in fetching categoies",error)
        return res.status(500).json({message:"internal sever error"})
        
    }
}

// get category by id 

export const getCategoryById = async(req,res)=>{
    try {
        const db = getDB();
        const {id}=req.params
        
        if(!id||!ObjectId.isValid(id)){
            return res.status(400).json({message:"invalid category id"})
        }

        const result = await db.collection("categories").findOne({_id:ObjectId(id)})

        if(!result){
            return res.status(400).json({message:"category not found"})
        }

        return res.status(200).json({message:"category fetched successfully"})
    } catch (error) {
        console.error("error in fetching category")
        return res.status(500).json({message:"internal sever error"})
        
    }
}

// update category by id 

export const updateCategory = async(req,res)=>{
    try {
        const db = getDB()
        const {id} = req.params
        const {name,description} = req.body

        const updatedData = {
            ...(name !==undefined && name.trim() !==""&&{name:name.trim()}),
            ...(description !==undefinded && description.trim()!=="" 
                &&{description:description.trim()}),
                updatedAt: new Date(),

        }

        if(Object.keys(updatedData).length===1){
            return res.status(400).json({message:"no valid field to update"})
        }

        const result = await db.collection("categories")
                       .updateOne(
                        {_id:new ObjectId(id)},
                        
                        {$set:updatedData})

        if (result.modifiedCount===0){
            return res.status(400).json({message:"category not found or not updated"})
        }

        return res.status(200).json({message:"category updated successfully"})
    } catch (error) {
        
        console.error("error in update category",error)
        return res.status(500).json({message:"internal server error"})
    }
}

export const deleteCategory = async(req,res)=>{
    try {
        const db = getDB();
        const {id}=req.params

        const result = await db.collection("categories").deleteOne({_id: new ObjectId(id)})
        if(result.deletedCount===0){
            return res.status(400).json({message:"category not found"})
        }

        return res.status(200).json({message:"category deleted successfully"})
    } catch (error) {
        console.error("error in deletion of category",error)
        return res.status(500).json({message:"internal server error"})
        
    }
}