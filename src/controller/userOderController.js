import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// create userOreder
export const createUserOrder = async(req,res)=>{
    try {
        const db = getDB()
        const {userId,items,pamentStatus,orderStatus} = req.body

        // 1.validation
        if(!userId||!Array.isArray(items)||items.length===0){
            return res.status(400).json({message:"userId and items are required"})
        }

        //2.validation for items
        for(const item of items){
            if(!item.itemId||!item.quantit<=0||!item.price<0){
                return res.status(400).json({message:"itemID and valid quantity and price are required"})
            }
        }

        // total amount 
        const totalAmount = items.reduce(
                            (sum,item)=>sum+item.quantity*item.price,0)

        const newUserOrder ={
            userId,
            items,
            totalAmount,
            paymentStatus:pamentStatus||"pending",
            orderStatus:orderStatus||"pending",
            placedAt:new Date()
        }

        const result = await db.collection("userOrders").insertOne(newUserOrder)
        return res.status(201).json({message:"user Order placed successfully",order:result})
    } catch (error) {
        console.error("error in userOder creation",error)
        return res.status(500).json({message:"internal server Error"})
    }
}

// get all orders

export const getAllOrders = async(req,res)=>{
    try {
        const db = getDB()
    
        const result = await db.collection("usersOrder").find().toArray();

        if(!result.length){
            return res.status.json({message:"no orders found"})
        }
    
        return res.status(200)
        .json({message:"all userOrders fetched sucessfully",allOrders:result})
    } catch (error) {
        console.error("error in fetching user orders")
        return res.status(500).json({message:"internal server error"})
    }
}

// get order by id

export const getOderById = async(req,res)=>{
    try {
        const db = getDB()
        const{id}=req.params

        if(!id||!ObjectId.isValid(id)){
            return res.status(400).json({message:"order id is not valid"})
        }

        const result = await db.collection("userOrders").findOne({_id:new ObjectId(id)})

        if(!result ){
            return res.status(400).json({message:"user order not found"})
        }

        return res.status(200).json({message:"user order fetched successfully"})
    } catch (error) {
        console.error("error in fetching the user order ")
        return res.status(500).json({message:"internal server error"})
        
    }
}

// update user order by id
export const updateOrder = async(req,res)=>{
    try {
        const db = getDB()
        const {id}= req.params
        const {items,pamentStatus,orderStatus}=req.body

        if(!id||!ObjectId.isValid(id)){
            return res.status(400).json({message:"invalid order Id"})
        }

        const existingOrder = await db.collection("userOrders").findOne({_id:new ObjectId(id)})
        if(!existingOrder){
            return res.status(404).json({message:"order in found"})
        }

        // Agar items diye gaye hain to totalAmount dobara calculate karenge
        let totalAmount = existingOrder.totalAmount;

        totalAmount=items.reduce((sum,item)=>sum+item.price*item.quantity)

        const updatedOrder = {
      ...(items && { items }),
      ...(paymentStatus && { paymentStatus }),
      ...(orderStatus && { orderStatus }),
      totalAmount,
      placedAt: existingOrder.placedAt, // same rehne do
      updatedAt: new Date(), // new field for tracking update time
     };

     const result = await db.collection("userOrders")
                    .updateOne({_id:ObjectId.isValid(id)},
                                {$set:updatedOrder}        )

     if(result.modifiedCount===0){
        return res.status(400).json({message:"no change is done in order"})

      }

      return res.status(200)
      .json({message:"user order updated sucessfully",updatedOrder:result})

     

    } catch (error) {
        console.error("error in updating order",error)
        return res.status(500).json({message:"internal server error"})
        
    }
}

// delete order 

export const deleteOrder = async(req,res)=>{
    try {
        const db = getDB()
        const {id} = req.params

        if(!id||!ObjectId.isValid(id)){
            return res.status(400).json({message:"order id is not valid"})
        }

        const result=await db.collection("userOrders").deleteOne({_id:new ObjectId(id)})
        
        if(result.deletedCount===0){
            return res.status(404).json({message:"order not found"})
        }

        return res.status(200).json({message:"user deleted successfully"})
    } catch (error) {
        console.error("error in deletion of user order")
        return res.status(500).json({message:"internal server error"})
        
    }
}