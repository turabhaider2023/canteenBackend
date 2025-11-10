import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// CREATE Restock Order
export const createRestockOrder = async (req, res) => {
  try {
    const db = getDB();
    const {
      items,
      vendorId,
      requestedBy,
      approvedBy,
      status,
      receivedAt,
      remarks,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !vendorId || !requestedBy) {
      return res.status(400).json({
        success: false,
        message: "Items, vendorId, and requestedBy are required",
      });
    }

    // Calculate totals
    const updatedItems = items.map((item) => ({
      ...item,
      total: item.price * item.quantity,
    }));

    const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);

    const newOrder = {
      items: updatedItems,
      totalAmount,
      vendorId,
      requestedBy,
      approvedBy: approvedBy || null,
      status: status || "pending",
      createdAt: new Date(),
      receivedAt: receivedAt || null,
      remarks: remarks || "",
    };

    const result = await db.collection("canteenRestockOrders").insertOne(newOrder);

    res.status(201).json({
      success: true,
      message: "Restock order created successfully",
      data: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating restock order:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating restock order",
    });
  }
};

// GET ALL Restock Orders
export const getAllRestockOrders = async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.collection("canteenRestockOrders").find().toArray();

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No restock orders found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching restock orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching restock orders",
    });
  }
};

// GET Restock Order by ID
export const getRestockOrderById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const order = await db
      .collection("canteenRestockOrders")
      .findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching restock order by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching restock order by ID",
    });
  }
};

// UPDATE Restock Order
export const updateRestockOrder = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const {
      items,
      vendorId,
      approvedBy,
      status,
      receivedAt,
      remarks,
    } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const updatedFields = {
      ...(items && Array.isArray(items) && items.length > 0 && {
        items: items.map((item) => ({
          ...item,
          total: item.price * item.quantity,
        })),
      }),
      ...(vendorId && { vendorId }),
      ...(approvedBy && { approvedBy }),
      ...(status && { status }),
      ...(receivedAt && { receivedAt }),
      ...(remarks && { remarks }),
    };

    if (updatedFields.items) {
      updatedFields.totalAmount = updatedFields.items.reduce(
        (sum, item) => sum + item.total,
        0
      );
    }

    const result = await db
      .collection("canteenRestockOrders")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Restock order updated successfully",
    });
  } catch (error) {
    console.error("Error updating restock order:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating restock order",
    });
  }
};

// DELETE Restock Order
export const deleteRestockOrder = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const result = await db
      .collection("canteenRestockOrders")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Restock order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting restock order:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting restock order",
    });
  }
};
