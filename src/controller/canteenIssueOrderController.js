import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// Create new issue order
export const createCanteenIssueOrder = async (req, res) => {
  try {
    const db = getDB();
    const issueOrder = req.body;

    const result = await db.collection("canteenIssueOrders").insertOne(issueOrder);

    res.status(201).json({
      success: true,
      message: "Canteen Issue Order created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating issue order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all issue orders
export const getAllCanteenIssueOrders = async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.collection("canteenIssueOrders").find().toArray();

    res.status(200).json({
      success: true,
      message: "Canteen Issue Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching issue orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get issue order by ID
export const getCanteenIssueOrderById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const order = await db.collection("canteenIssueOrders").findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({ success: false, message: "Issue order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Canteen Issue Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching issue order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update issue order by ID
export const updateCanteenIssueOrder = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const updatedOrder = req.body;

    const result = await db
      .collection("canteenIssueOrders")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedOrder });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Issue order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Canteen Issue Order updated successfully",
    });
  } catch (error) {
    console.error("Error updating issue order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete issue order by ID
export const deleteCanteenIssueOrder = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const result = await db.collection("canteenIssueOrders").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Issue order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Canteen Issue Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting issue order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
