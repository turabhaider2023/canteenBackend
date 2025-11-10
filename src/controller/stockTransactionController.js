import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const createStockTransaction = async(req,res)=>{
    try {
        const db = getDB()

        const {itemId,quantity,type,referenceId,createdBy,approvedBy,remarks} = req.body

        if(!itemId
        ||quantity===undefined||quantity===null||quantity===""
        ||!type||!createdBy||!approvedBy||!remarks){
            return res.status(400).json({message:"all keys are required"})
        }

        const inventory = await db.collection("inventory").findOne({itemId})
        let currentStock = inventory ? inventory.currentStock:0
        const newBalance = currentStock+Number(quantity)

        const newStockTransaction = {
            itemId,
            quantity:Number(quantity),
            type,
            referenceId:referenceId||null,
            balanceAfter:newBalance,
            createdBy,
            approvedBy:approvedBy||null,
            remarks,
            createdAt:new Date()
        }

        const result = await db.collection("stockTransactions").insertOne(newStockTransaction)

        // inventory update krna pdega yha pr 

        await db.collection("inventory").updateOne(
            {itemId},
            {$set:{currentStock:newBalance,lastUpdate:new Date()} },
            {upsert:true}
        );

        res.status(201).json({
        success: true,
        message: "Stock transaction recorded successfully",
        data: newStockTransaction,
});


        } catch (error) {
            console.error("error in creation of stockTransaction")
            return res.status(500).json({message:"internal server error"})
        
    }
}

export const getAllTransactions = async(req,res)=>{
    try {
        const db = getDB()
        const result =await db.collection("stockTransactions").find().sort({createdAt:-1}).toArray();
        if(!result.length){
            return res.status(404).json({message:"stock Transaction not found"})
        }

        return res.status(200).json({message:"stock transaction fetched successfully",result})
    } catch (error) {
        console.error("error in fetching stockTransactions")
        return res.status(500).json({message:"internal server error"})
        
    }

}

export const getStockTransactionById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    // ID format check
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID format",
      });
    }

    const transaction = await db
      .collection("stockTransactions")
      .findOne({ _id: new ObjectId(id) });

    //Agar record nahi mila
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Stock transaction not found",
      });
    }

    //Success response
    res.status(200).json({
      success: true,
      message: "Stock transaction fetched successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error fetching stock transaction by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching stock transaction by ID",
    });
  }
};

// Update Stock Transaction
export const updateStockTransaction = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { quantity, type, referenceId, approvedBy, remarks } = req.body;

    //Check if ID is valid
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    // Prepare updated fields using spread operator
    const updatedFields = {
      ...(quantity !== undefined &&
        quantity !== null &&
        quantity !== "" && {
          quantity: Number(quantity),
        }),
      ...(type && { type }),
      ...(referenceId && { referenceId }),
      ...(approvedBy && { approvedBy }),
      ...(remarks && { remarks }),
    };

    // Agar koi field update nahi karni hai
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    //Update transaction in DB
    const result = await db
      .collection("stockTransactions")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updatedFields, updatedAt: new Date() } }
      );

    //Check if any document was modified
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock transaction updated successfully",
      updatedFields,
    });
  } catch (error) {
    console.error("Error updating stock transaction:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating stock transaction",
    });
  }
};

//  Delete Stock Transaction by ID
export const deleteStockTransaction = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    // Validate ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    // Try deleting the record
    const result = await db
      .collection("stockTransactions")
      .deleteOne({ _id: new ObjectId(id) });

    // Check if record was actually deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting stock transaction:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting stock transaction",
    });
  }
};


