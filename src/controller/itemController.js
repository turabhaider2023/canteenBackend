import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const createItem = async(req,res)=>{
    try {
        const db = getDB();
        const {name,categoryId,salePrice,unit,availableStock} = req.body;


        
        if(!name||!categoryId){
            return res.status(400).json({message:"name and categoryId are required"})
        }

        if (!ObjectId.isValid(categoryId)) {
       return res.status(400).json({ message: "Invalid category ID format" });
    }

   

        const categoryExist = await db.collection("categories").findOne({_id:new ObjectId(categoryId)})
        if(!categoryExist){
            return res.status(404).json({message:"category not found"})
        }

        const newcreateItems = {
            name,
            categoryId:new ObjectId(categoryId),
            salePrice:salePrice||0,
            unit:unit||"",
            availableStock:availableStock||0,
            createdAt:new Date()

        }
        
        const result=await db.collection("items").insertOne(newcreateItems);
        return res.status(201).json({message:"item created successfuly",item:{...newcreateItems,_id:result.insertedId}})
    } catch (error) {
        console.error("error in item creation",error)
        return res.status(500).json({message:"internal sever error"})
        
    }
}

// get all items
export const getAllItems = async(req,res)=>{
  try {
      const db = getDB()
  
      const result =await db.collection("items").find().toArray()
  
      return res.status(200).json({message:"item fetch successfully",items:result})
  } catch (error) {
    console.error("error in fetching items",error)
    return res.status(500).json({message:"internal server error"})
    
  }
}

// get item by id

export const getItemById = async(req,res)=>{
    try {
        const db = getDB()
        const {id} = req.params

        if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }
    
        const result=await db.collection("items").findOne({_id:new ObjectId(id)})
    
        if(!result){
            return res.status(404).json({message:"item is not found"})
        }
    
        return res.status(200).json({message:"item fetched successfully",item:result})
    }
    catch (error) {
    console.error("error in fetching the item by id");
    return res.status(500).json({message:"internal sever error"})

        
    }
}

export const updateItem = async(req,res)=>{
    try {
        const db = getDB()

        const {id}=req.params
        const {name,salePrice,unit,availableStock} = req.body;

        if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

       const result= await db.collection("items").updateOne(
                     {_id:new ObjectId(id)},
                     {$set:{
                        name,
                        salePrice,
                        unit,
                        availableStock,
                        updatedAt:new Date()
                     }}

        )
        if(result.matchedCount===0){
            return res.status(404).json({message:"item is not found"})
        }

        return res.status(200).json({message:"item updated successfully"})
    } catch (error) {
        console.error("error in updating item",error)
        return res.status(500).json({message:"internal server error"})
        
    }
}

// delete item by id 

export const deleteItem = async(req,res)=>{
   try {
     const db = getDB();
     const {id}=req.params

     if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }
 
     const result=await db.collection("items").deleteOne({_id:new ObjectId(id)})
 
     if(result.deletedCount===0){
         return res.status(404).json({message:"item not found"})
     }
 
     return res.status(200).json({message:"item deleted successfully",deletedId:id})
   } catch (error) {
    console.error("error in deletion of item",error)
    return res.status(500).json({message:"internal server error"})
    
   }
}

