import { getDB } from "../config/db.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

// Helper function for safe ObjectId conversion
const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const db = getDB();

    const requiredFields = {
      name: {
        firstName: "",
        middleName: "",
        lastName: "",
      },
      email: "",
      password: "",
      designation: "",
      role: [],
      office: "",
      mobileNumber: "",
      officeLandlineNumber: "",
      officeAddress: "",
    };

    // Check for missing keys
    for (const key in requiredFields) {
      if (!Object.keys(req.body).includes(key)) {
        return res.status(400).json({ message: `Missing key: ${key}` });
      }

      if (!req.body[key]) {
        return res
          .status(400)
          .json({ message: `Value for key '${key}' is missing` });
      }
    }

    const { email, password } = req.body;

    // Check for existing user
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      ...req.body,
      createdAt: new Date(),
      password: hashedPassword,
    };

    const result = await db.collection("users").insertOne(newUser);

    return res
      .status(201)
      .json({ message: "User registered successfully", userId: result.insertedId });
  } catch (error) {
    console.error("Register User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET ALL USERS
export const getAllUser = async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection("users").find({}).project({ password: 0 }).toArray();
    return res
      .status(200)
      .json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const _id = toObjectId(id);

    if (!_id) return res.status(400).json({ message: "Invalid user ID" });

    const user = await db.collection("users").findOne(
      { _id },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get User by ID Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const db = getDB();
    const { id, ...others } = req.body;

    if (!id) return res.status(400).json({ message: "User ID is required" });

    const _id = toObjectId(id);
    if (!_id) return res.status(400).json({ message: "Invalid user ID" });

    const user = await db.collection("users").findOne({ _id });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle password if provided
    if (others.password?.length) {
      others.password = await bcrypt.hash(others.password, 10);
    }

    const result = await db
      .collection("users")
      .updateOne({ _id }, { $set: others });

    if (result.modifiedCount === 0)
      return res.status(400).json({ message: "No changes were made" });

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "User ID is required to delete" });

    const _id = toObjectId(id);
    if (!_id) return res.status(400).json({ message: "Invalid user ID" });

    const user = await db.collection("users").findOne({ _id });
    if (!user) return res.status(404).json({ message: "User not found" });

    await db.collection("users").deleteOne({ _id });

    return res
      .status(200)
      .json({ message: `User ${user.email} deleted successfully` });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
