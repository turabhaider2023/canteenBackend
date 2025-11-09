import { getDB } from "../config/db.js";
import {ObjectId} from "mongodb";

export const createInventory = async(req,res)=>{
    try {
        const db = getDB()
        const {itemId,currentStock,store} = req.body

        if(!itemId||currentStock===undefined
            ||currentStock===null||currentStock===""||!store)
            {
                return res.status(400)
                .json({message:"itemId ,currentStock,store all are required"})
            }

        const newInventory = {
            itemId,
            currentStock:Number(currentStock),
            lastupdated:new Date(),
            store,
                    }

        const result = await db.collection("inventory").insertOne(newInventory)

        return res.status(201)
        .json({message:"new inventory created successfully",
        data:{...newInventory,id:result.insertedId}},);
    } catch (error) {
        console.error("error in creating the inventory",error)
        return res.status(500).json({message:"internal server error"})
        
    }
}

export const getAllInventory = async(req,res)=>{
    try {
        const db = getDB();
        
        const result = await db.collection("inventory").find().toArray()

        if (!result.legth){
            return res.status(404).json({message:"no inventory record is found"})
        }
    
        return res.status(200)
        .json({message:"all inventory records found successfully",data:result})
    } catch (error) {
        console.error("error in founding all inventory")
        return res.status(500).json({message:"internal server error"})
        
    }
}

// get inventory by id
export const getInventoryById = async(req,res)=>{
    try {
        const db = getDB()
        const{id} = req.params
    
        if(!id||!ObjectId.isValid(id)){
            return res.status(400).json({message:"invalid inventory id"})
        }
    
        const result = await db.collection("inventory").findOne({_id:new ObjectId(id)})
    
        if(!result){
            return res.status(404).json({message:"inventory not found"})
        }

        return res.status(200)
        .json({message:"inventory record found successfully"
            ,inventorRecord:result
        })
    } catch (error) {
        console.error("error in fetching inventory record",error)
        return res.status(500).json({message:"internal server error"})
        
    }
}

//update inventory 

export const updateInventory = async(req,res)=>{
    try {
        const db = getDB()
        const {id}=req.params
        const {itemId,currentStock,store} = req.body

        if(!id||!ObjectId.isValid(id)){
            return res.status(400).json({message:"invalid inventory id"})
        }

        if(!itemId||currentStock===undefined
            ||currentStock===null||currentStock===""
             ||!store)
             {
            return res.status(400)
            .json({message:"itemId,currentStock and store are requires"})
             }

        const updatedData = {
            itemId,
            currentStock:Number(currentStock),
            store,
            updatedAt:new Date()

        }

        const result = await db.collection("invertory").updateOne(
            {_id:new ObjectId(id)},
            {$set:updatedData}
        )

        if(result.matchedCount===0){
            return res.status(404).json({message:"not record found"})
        }

        return res.status(200)
        .json({message:"inventory record updated successfully"
            ,data:updatedData
        })

    } catch (error) {
        console.error("error in updating the inventory")
        return res.status(500).json({message:"internal server error"})
        
    }
}

export const deleteInventory = async(req,res)=>{
    try {
        const db = getDB()
        const {id}=req.params

        if(!id||!ObjectId.isValid(id)){
            return res.status(400).json({message:"invalid inventory id"})
        }

        const result = await db.collection("inventory").deleteOne({_id:new ObjectId(id)})

        if(result.deletedCount===0){
            return res.status(404)
            .json({message:"inventory not found"})
        }

        return res.status(200)
                .json({message:"inventory deleted successfully"})
    } catch (error) {
        console.error("error in deletion the inventory",error)
        return res.status(500).json({message:"internal server error"})
        
    }
}