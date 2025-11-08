import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

// ✅ Create a new office
export const AddOffice = async (req, res) => {
  try {
    const db = getDB();
    const { name, location, email } = req.body;

    if (!name || !location || !email) {
      return res
        .status(400)
        .json({ message: "Office name, location, and email are required." });
    }

    const officeExisting = await db.collection("offices").findOne({ name });
    if (officeExisting) {
      return res.status(409).json({ message: "Office already exists." });
    }

    const newOffice = {
      name: name.trim(),
      location: location.trim(),
      email: email.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("offices").insertOne(newOffice);
    return res
      .status(201)
      .json({
        message: "Office created successfully",
        officeId: result.insertedId,
      });
  } catch (error) {
    console.error("Error in office creation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all offices
export const getAllOffices = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("offices").find().toArray();

    return res
      .status(200)
      .json({ message: "All offices fetched successfully", offices: result });
  } catch (error) {
    console.error("Error in fetching offices:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get office by ID
export const getOfficeById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid office ID" });
    }

    const result = await db
      .collection("offices")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ message: "Office not found" });
    }

    return res
      .status(200)
      .json({ message: "Office fetched successfully", office: result });
  } catch (error) {
    console.error("Error in fetching office by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update office by ID (safe update)
export const updateOffice = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { name, location, email } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid office ID" });
    }

    // ✅ Safe dynamic update (ignore undefined or empty values)
   const updatedData = {
    ...(name !==undefined && name.trim()!=="" &&{name:name.trim()}),
    ...(location !==undefined && location.trim() !==""&&{location:location.trim()}),
    ...(email !==undefined && email.trim()!=="" &&{email:email.trim()}),
      updatedAt:new Date(),
   };
    if (Object.keys(updatedData).length === 1) {
      // only 'updatedAt' → nothing to update
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const result = await db
      .collection("offices")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Office not found" });
    }

    return res.status(200).json({ message: "Office updated successfully" });
  } catch (error) {
    console.error("Error in updating office:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete office
export const deleteOffice = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid office ID" });
    }

    const result = await db
      .collection("offices")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Office not found" });
    }

    return res.status(200).json({ message: "Office deleted successfully" });
  } catch (error) {
    console.error("Error in deleting office:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
