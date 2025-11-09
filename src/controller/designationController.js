import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// Create Designation
export const createDesignation = async (req, res) => {
  try {
    const db = getDB();
    const { name, level } = req.body;

    if (!name || !level) {
      return res.status(400).json({ message: "Name and level are required" });
    }

    const newDesignation = { name: name.trim(), level: level.trim() };

    await db.collection("designations").insertOne(newDesignation);

    res.status(201).json({
      success: true,
      message: "Designation created successfully",
      data: newDesignation,
    });
  } catch (error) {
    console.error("Error creating designation:", error);
    res.status(500).json({ success: false, message: "Failed to create designation" });
  }
};

// Get All Designations
export const getAllDesignations = async (req, res) => {
  try {
    const db = getDB();
    const designations = await db.collection("designations").find().toArray();

    res.status(200).json({
      success: true,
      data: designations,
    });
  } catch (error) {
    console.error("Error fetching designations:", error);
    res.status(500).json({ success: false, message: "Failed to fetch designations" });
  }
};

// Get Designation by ID
export const getDesignationById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid designation ID" });
    }

    const designation = await db.collection("designations").findOne({ _id: new ObjectId(id) });

    if (!designation) {
      return res.status(404).json({ message: "Designation not found" });
    }

    res.status(200).json({ success: true, data: designation });
  } catch (error) {
    console.error("Error fetching designation:", error);
    res.status(500).json({ success: false, message: "Failed to fetch designation" });
  }
};

// Update Designation
export const updateDesignation = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { name, level } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid designation ID" });
    }

    const updatedFields = {
      ...(name && { name: name.trim() }),
      ...(level && { level: level.trim() }),
    };

    const result = await db
      .collection("designations")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes were made" });
    }

    res.status(200).json({
      success: true,
      message: "Designation updated successfully",
      updatedFields,
    });
  } catch (error) {
    console.error("Error updating designation:", error);
    res.status(500).json({ success: false, message: "Failed to update designation" });
  }
};

//Delete Designation
export const deleteDesignation = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid designation ID" });
    }

    const result = await db.collection("designations").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Designation not found" });
    }

    res.status(200).json({
      success: true,
      message: "Designation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting designation:", error);
    res.status(500).json({ success: false, message: "Failed to delete designation" });
  }
};
